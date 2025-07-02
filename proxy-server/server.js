require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const API_KEY = process.env.UIUC_API_KEY || 'your-api-key-here';
const API_URL = process.env.UIUC_API_URL || 'https://uiuc.chat/api/chat-api/chat';

// Enable CORS for Canvas and GitHub Pages
const corsOrigins = process.env.CORS_ORIGINS ? 
    process.env.CORS_ORIGINS.split(',').map(origin => 
        origin.includes('*') ? new RegExp(origin.replace(/\*/g, '.*')) : origin
    ) : 
    ['https://arluigi.github.io', /.*\.instructure\.com$/, /.*\.canvas\..*$/];

app.use(cors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For LTI form data

// Log all requests for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
    }
    next();
});

// Root endpoint - handles both info page (GET) and LTI launches (POST)
app.get('/', (req, res) => {
    res.send(`
        <h1>UIUC Course Chat</h1>
        <p>This is the Canvas LTI integration for UIUC Course Chat.</p>
        <p>Status: Server is running</p>
        <p>Time: ${new Date().toISOString()}</p>
        <p>Ready for LTI launches from Canvas</p>
    `);
});

// Handle LTI launches on root path (Basic HTML version)
app.post('/', (req, res) => {
    console.log('LTI Launch received on root path!');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    // Extract course info from LTI parameters
    const courseId = req.body.context_id || req.body.custom_canvas_course_id || 'default';
    const userId = req.body.user_id || 'anonymous';
    const userName = req.body.lis_person_name_full || 'User';
    
    // Serve the full chat interface
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>UIUC Course Chat</title>
    <style>
        #chat-container {
            width: 100%;
            height: 600px;
            border: 1px solid #ccc;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
        }
        #messages {
            flex-grow: 1;
            overflow-y: auto;
            padding: 10px;
            background: #f9f9f9;
        }
        #input-container {
            display: flex;
            padding: 10px;
            background: white;
            border-top: 1px solid #ccc;
        }
        #message-input {
            flex-grow: 1;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-right: 10px;
        }
        #send-button {
            padding: 8px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .message {
            margin: 5px 0;
            padding: 8px;
            border-radius: 4px;
        }
        .user-message {
            background: #e3f2fd;
            margin-left: 20%;
        }
        .bot-message {
            background: #f5f5f5;
            margin-right: 20%;
        }
        .welcome-message {
            background: #e8f5e8;
            text-align: center;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div id="chat-container">
        <div id="messages">
            <div class="message welcome-message">Welcome, ${userName}! Ask me anything about your course.</div>
        </div>
        <div id="input-container">
            <input type="text" id="message-input" placeholder="Type your message...">
            <button id="send-button">Send</button>
        </div>
    </div>

    <script>
        const config = {
            COURSE_ID: '${courseId}',
            USER_ID: '${userId}'
        };

        const messagesDiv = document.getElementById('messages');
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');

        function addMessage(content, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + (isUser ? 'user-message' : 'bot-message');
            messageDiv.textContent = content;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        async function sendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;

            addMessage(message, true);
            messageInput.value = '';

            const data = {
                model: "Qwen/Qwen2.5-VL-72B-Instruct",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful AI assistant. Follow instructions carefully. Respond using markdown."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                course_name: "BADM-350-Summer-2025",
                stream: false,
                temperature: 0.1,
                retrieval_only: false
            };

            try {
                const response = await fetch('/proxy/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('API error: ' + response.statusText);
                }

                const result = await response.json();
                if (!result.message) {
                    throw new Error('No message in API response');
                }

                addMessage(result.message);
            } catch (error) {
                console.error('Error:', error);
                addMessage('Error: ' + error.message);
            }
        }

        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    </script>
</body>
</html>
    `);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        port: port,
        environment: process.env.NODE_ENV || 'development'
    });
});

// Serve React app static files from the built output
app.use('/react/_next', express.static(path.join(__dirname, '../react-app/out/_next')));
app.use('/react', express.static(path.join(__dirname, '../react-app/out'), { index: false }));

// React app route - handle LTI launches for React version with streaming
app.post('/react', (req, res) => {
    console.log('React LTI Launch received!');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    // Extract course info from LTI parameters
    const courseId = req.body.context_id || req.body.custom_canvas_course_id || 'BADM-350-Summer-2025';
    const userId = req.body.user_id || 'anonymous';
    const userName = req.body.lis_person_name_full || 'User';
    
    // Read the built React app HTML
    const htmlPath = path.join(__dirname, '../react-app/out/index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Inject LTI context into the HTML
    const ltiContextScript = `
    <script>
        window.LTI_CONTEXT = {
            courseId: '${courseId}',
            userId: '${userId}',
            userName: '${userName}',
            courseName: 'BADM 350: IT for Networked Organizations'
        };
    </script>`;
    
    // Insert the script before the closing </head> tag
    htmlContent = htmlContent.replace('</head>', ltiContextScript + '</head>');
    
    // Fix asset paths for the /react route
    htmlContent = htmlContent.replace(/href="\/_next/g, 'href="/react/_next');
    htmlContent = htmlContent.replace(/src="\/_next/g, 'src="/react/_next');
    htmlContent = htmlContent.replace(/href="\/favicon\.ico"/g, 'href="/react/favicon.ico"');
    
    res.send(htmlContent);
});

// GET route for React app (for testing)
app.get('/react', (_, res) => {
    res.send(`
        <h1>React Chat App</h1>
        <p>This is the React version of the UIUC Course Chat.</p>
        <p>Status: Server is running</p>
        <p>Time: ${new Date().toISOString()}</p>
        <p><strong>Note:</strong> This should be accessed via Canvas LTI POST request.</p>
    `);
});

// Real streaming chat endpoint using proper SSE format
app.post('/api/chat/stream', (req, res) => {
    console.log('SSE streaming chat request received');
    
    // Set proper SSE headers FIRST
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control, Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
        'Content-Encoding': 'identity' // Prevent compression
    });
    
    // Send initial connection confirmation (proper SSE format)
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
    console.log('Sent connected message to client');
    
    // Handle client disconnect
    let clientDisconnected = false;
    req.on('close', () => {
        console.log('Client disconnected from stream');
        clientDisconnected = true;
    });

    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
        res.write(`data: ${JSON.stringify({ error: 'Invalid request body' })}\n\n`);
        res.end();
        return;
    }

    // Prepare API request with streaming enabled
    const requestBody = {
        ...req.body,
        api_key: API_KEY,
        stream: true // Enable streaming for real-time response
    };

    console.log('Streaming to UIUC API...');

    // Call UIUC Chat API with streaming
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(async response => {
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        console.log('Starting real-time streaming from UIUC API');
        
        // Process streaming response in real-time
        let accumulatedContent = '';
        
        // Handle the streaming response with Node.js streams
        response.body.on('data', (chunk) => {
            if (clientDisconnected) {
                console.log('Client disconnected, stopping stream processing');
                return;
            }
            
            const chunkText = chunk.toString('utf8');
            accumulatedContent += chunkText;
            
            // Send the chunk immediately to client
            res.write(`data: ${JSON.stringify({ 
                content: accumulatedContent, 
                chunk: chunkText,
                done: false 
            })}\n\n`);
            
            console.log('Streamed chunk:', chunkText.length, 'chars');
        });
        
        response.body.on('end', () => {
            if (!clientDisconnected) {
                // Send final message indicating completion
                res.write(`data: ${JSON.stringify({ 
                    content: accumulatedContent, 
                    done: true 
                })}\n\n`);
                
                console.log('Stream completed. Total content:', accumulatedContent.length, 'chars');
                res.end();
            }
        });
        
        response.body.on('error', (error) => {
            console.error('Stream error:', error);
            if (!clientDisconnected) {
                res.write(`data: ${JSON.stringify({ error: 'Stream error: ' + error.message })}\n\n`);
                res.end();
            }
        });
    })
    .catch(error => {
        console.error('Streaming API error:', error);
        if (!clientDisconnected) {
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            res.end();
        }
    });
});


// Chat endpoint (non-streaming fallback)
app.post('/proxy/chat', async (req, res) => {
    const startTime = Date.now();
    
    try {
        // Validate request body
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        // Add API key to request body
        const requestBody = {
            ...req.body,
            api_key: API_KEY
        };

        // Add timeout and signal for request cancellation
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        let response;
        try {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'UIUC-Canvas-LTI-Bot/1.0'
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal,
                timeout: 30000
            });
        } catch (fetchError) {
            clearTimeout(timeoutId);
            console.error('Fetch error:', fetchError.message);
            
            if (fetchError.name === 'AbortError') {
                return res.status(408).json({ error: 'Request timeout - API response took too long' });
            }
            
            return res.status(503).json({ error: 'Unable to connect to UIUC API. Please try again later.' });
        }

        clearTimeout(timeoutId);

        // Always try JSON first, fallback to text if it fails
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error('JSON parsing failed:', jsonError);
            console.error('Response status:', response.status);
            console.error('Response headers:', Object.fromEntries(response.headers.entries()));
            
            // Try to get response as text for better error reporting
            try {
                const textResponse = await response.text();
                console.error('Response body (text):', textResponse.substring(0, 500));
                data = { 
                    error: 'API returned non-JSON response', 
                    status: response.status,
                    statusText: response.statusText,
                    details: textResponse.substring(0, 200)
                };
            } catch (textError) {
                data = { 
                    error: 'Failed to parse API response', 
                    status: response.status,
                    statusText: response.statusText 
                };
            }
        }
        
        const duration = Date.now() - startTime;
        console.log(`API request completed in ${duration}ms with status ${response.status}`);
        
        // Forward the status code from UIUC API
        if (!response.ok) {
            return res.status(response.status).json(data);
        }
        
        res.json(data);
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`Critical proxy error after ${duration}ms:`, error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            error: 'Internal server error while processing chat request',
            timestamp: new Date().toISOString()
        });
    }
});

// Global error handlers to prevent crashes
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    console.error('Stack:', error.stack);
    // Don't exit - keep server running
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    console.error('Stack:', reason?.stack);
    // Don't exit - keep server running
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API URL: ${API_URL}`);
    console.log(`CORS Origins: ${corsOrigins}`);
});