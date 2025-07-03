'use client';

import { ChatAPIRequest, Message } from '@/types';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useCallback, useState } from 'react';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Clear any previous errors
    setError(null);
    setIsLoading(true);

    console.log('Starting message send:', content);

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Create AI message placeholder for streaming
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      content: '',
      isUser: false,
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, aiMessage]);
    setStreamingMessageId(aiMessageId);

    try {
      // Prepare API request for streaming
      const apiRequest: ChatAPIRequest = {
        model: "Qwen/Qwen2.5-VL-72B-Instruct",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant. Follow instructions carefully. Respond using markdown."
          },
          {
            role: "user",
            content: content.trim()
          }
        ],
        course_name: "BADM-350-Summer-2025",
        stream: true,
        temperature: 0.1,
        retrieval_only: false
      };

      console.log('Starting fetchEventSource...');

      // Determine the API URL based on environment
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/chat/stream'  // In production, use relative URL
        : 'http://localhost:3001/api/chat/stream'; // In development, use proxy server URL

      await fetchEventSource(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRequest),
        openWhenHidden: true,
        
        async onopen(response) {
          console.log('Stream opened:', response.status, response.statusText);
          if (response.ok) {
            return; // Everything is good
          } else {
            throw new Error(`Stream failed: ${response.status} ${response.statusText}`);
          }
        },

        onmessage(event) {
          console.log('Received SSE message:', event.data);
          
          try {
            const data = JSON.parse(event.data);
            
            if (data.error) {
              throw new Error(data.error);
            }
            
            // Handle connection confirmation
            if (data.type === 'connected') {
              console.log('Stream connection confirmed');
              return;
            }
            
            if (data.test) {
              console.log('Test message received:', data.test);
              return;
            }
            
            if (data.content) {
              // Update the streaming message with accumulated content
              setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId 
                  ? { ...msg, content: data.content, isStreaming: !data.done }
                  : msg
              ));
              console.log('Updated message content, length:', data.content.length, 'done:', data.done);
            }
            
            if (data.done) {
              console.log('Stream marked as complete');
            }
          } catch (parseError) {
            console.error('Error parsing SSE data:', parseError, 'Raw data:', event.data);
          }
        },

        onerror(err) {
          console.error('SSE error occurred:', err);
          // Don't re-throw - let the connection retry or close gracefully
          return;
        },

        onclose() {
          console.log('SSE connection closed - marking stream as complete');
          // Mark streaming as complete
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, isStreaming: false }
              : msg
          ));
        }
      });

      console.log('fetchEventSource completed');

    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);

      // Update the AI message with error
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { 
              ...msg, 
              content: `Sorry, I encountered an error: ${errorMessage}`,
              isStreaming: false 
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
    }
  }, [isLoading]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    streamingMessageId,
  };
}