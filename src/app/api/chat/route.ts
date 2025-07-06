import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.UIUC_API_KEY;
const API_URL = process.env.UIUC_API_URL || 'https://uiuc.chat/api/chat-api/chat';

export async function POST(request: NextRequest) {
  console.log('SSE streaming chat request received');
  
  try {
    const body = await request.json();
    
    // Validate API key
    if (!API_KEY) {
      throw new Error('UIUC API key not configured');
    }

    // Prepare API request
    const requestBody = {
      ...body,
      api_key: API_KEY,
      stream: true
    };

    console.log('Calling UIUC API with streaming...');

    // Make streaming request to UIUC API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    console.log('Got streaming response from UIUC API');

    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.error(new Error('No response body'));
          return;
        }

        let fullContent = '';
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              // Send final message
              const finalData = `data: ${JSON.stringify({ content: fullContent, done: true })}\n\n`;
              controller.enqueue(new TextEncoder().encode(finalData));
              console.log('UIUC stream ended');
              break;
            }
            
            // Accumulate content
            const text = new TextDecoder().decode(value);
            fullContent += text;
            
            // Send chunk as SSE data with full accumulated content
            const chunkData = `data: ${JSON.stringify({ content: fullContent, done: false })}\n\n`;
            controller.enqueue(new TextEncoder().encode(chunkData));
          }
        } catch (error) {
          console.error('Stream error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          const errorData = `data: ${JSON.stringify({ error: errorMessage })}\n\n`;
          controller.enqueue(new TextEncoder().encode(errorData));
        } finally {
          controller.close();
        }
      }
    });

    // Return streaming response with proper SSE headers
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'X-Accel-Buffering': 'no'
      }
    });

  } catch (error) {
    console.error('Streaming error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return error as SSE stream
    const errorStream = new ReadableStream({
      start(controller) {
        const errorData = `data: ${JSON.stringify({ error: errorMessage })}\n\n`;
        controller.enqueue(new TextEncoder().encode(errorData));
        controller.close();
      }
    });

    return new NextResponse(errorStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Chat API endpoint is ready',
    timestamp: new Date().toISOString(),
  });
}