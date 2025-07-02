# Canvas LTI Chatbot - Project Summary

## 🎯 Project Overview

This is a Canvas LTI (Learning Tools Interoperability) chatbot that acts as a proxy between Canvas and the UIUC Chat API. The system provides two chat interfaces:

1. **Legacy HTML Version** (`/` route) - Simple, stable, non-streaming
2. **Modern React Version** (`/react` route) - Advanced UI with streaming capabilities

**Production URL**: https://canvas.ncsa.ai
**Remote Server**: ssh -i uiuc-chat-dev.pem ubuntu@141.142.216.30
**Port**: 3010 (via Cloudflare tunnel)

## 🏗️ Architecture

```
Canvas LTI Launch → Your Proxy Server → UIUC Chat API
                                    ↓
                            HTML or React Interface
```

### Key Components:

1. **Proxy Server** (`proxy-server/server.js`) - Node.js/Express backend
2. **React App** (`react-app/`) - Next.js frontend with streaming
3. **LTI Configs** (`config.xml`, `config-react.xml`) - Canvas integration
4. **Built React Files** (`react-app/out/`) - Static files served by proxy

## 📁 Repository Structure

```
canvasbot/
├── proxy-server/              # Backend Node.js server
│   ├── server.js             # Main server logic
│   └── package.json          # Server dependencies
├── react-app/                # Modern React UI
│   ├── src/                  # React source code
│   │   ├── hooks/useChat.ts  # Streaming chat logic
│   │   ├── components/       # UI components
│   │   └── types/           # TypeScript definitions
│   └── out/                 # Built static files (served by proxy)
├── config.xml               # LTI configuration (HTML version)
├── config-react.xml         # LTI configuration (React version)
├── .env.example            # Environment configuration template
└── .gitignore              # Git ignore file (excludes .pem, node_modules, etc.)
```

## 🔧 What We Accomplished

### ✅ **Completed Tasks:**

1. **Fixed Architecture Issues**
   - Converted proxy-server from problematic submodule to regular directory
   - Eliminated disconnected inline React code in server.js
   - Now serves properly built Next.js React app

2. **Security Improvements**
   - Removed exposed API key from code
   - Added `.env.example` for configuration guidance
   - Updated `.gitignore` to exclude sensitive files

3. **Streaming Implementation**
   - Built working SSE (Server-Sent Events) endpoint at `/api/chat/stream`
   - Added proper streaming client in React app using `fetchEventSource`
   - Implemented throttling for UIUC's 760+ fast chunks
   - Added proper error handling and connection management

4. **Canvas LTI Integration**
   - Working LTI launches for both HTML and React versions
   - Dynamic user context injection (`courseId`, `userId`, `userName`)
   - Proper CORS configuration for Canvas iframe environment

5. **Deployment Setup**
   - Clean repository structure ready for collaboration
   - Removed backup files and sensitive data
   - Pushed to GitHub for mentor review

### 🚧 **Current Issue - Streaming Not Working**

**Problem**: Streaming connects successfully but React frontend receives empty messages.

**Evidence from logs**:
```
Starting message send: hello
Starting fetchEventSource...
Stream opened: 200 
Received SSE message: {"type":"connected"}
SSE connection closed
fetchEventSource completed
```

**Server logs show**:
```
SSE streaming chat request received
Streaming to UIUC API...
Received response from UIUC API
API response text length: 190
Sent complete response to client
```

**Analysis**: Server receives and processes the response correctly, but client doesn't receive the actual content.

## 🛠️ Technical Implementation Details

### **Server-Side Streaming** (`/api/chat/stream`)

```javascript
// Set SSE headers
res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
});

// Send confirmation
res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

// Forward to UIUC API and stream response
const responseText = await response.text();
res.write(`data: ${JSON.stringify({ content: responseText, done: true })}\n\n`);
```

### **Client-Side Streaming** (`useChat.ts`)

```javascript
await fetchEventSource('/api/chat/stream', {
    method: 'POST',
    body: JSON.stringify(apiRequest),
    
    onmessage(event) {
        const data = JSON.parse(event.data);
        if (data.content) {
            setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId 
                    ? { ...msg, content: data.content, isStreaming: !data.done }
                    : msg
            ));
        }
    }
});
```

### **Environment Configuration**

Required environment variables (create `.env` file):
```
UIUC_API_KEY=your-actual-api-key-here
UIUC_API_URL=https://uiuc.chat/api/chat-api/chat
PORT=3010
NODE_ENV=production
CORS_ORIGINS=/.*.instructure.com/,/.*.canvas..*$/
```

## 🚀 Deployment Instructions

### **Deploy to Remote Server:**

```bash
# 1. Deploy server code
scp -i uiuc-chat-dev.pem proxy-server/server.js ubuntu@141.142.216.30:/home/ubuntu/canvasbot/proxy-server/

# 2. Deploy React app (if changed)
scp -r -i uiuc-chat-dev.pem react-app/out ubuntu@141.142.216.30:/home/ubuntu/canvasbot/react-app/

# 3. Restart server
ssh -i uiuc-chat-dev.pem ubuntu@141.142.216.30 'pkill -f "node server.js"; cd canvasbot/proxy-server && source ~/.nvm/nvm.sh && nvm use 18 && node server.js &'
```

### **Local Development:**

```bash
# Install dependencies
cd proxy-server
npm install

# Start server
node server.js

# For React development
cd react-app
npm install
npm run dev        # Development server
npm run build      # Build for production
```

### **Build React App:**

```bash
cd react-app
npm run build      # Creates react-app/out/ directory
```

## 🔍 Debugging Steps for Streaming Issue

### **Server-Side Debugging:**
1. Check server logs for API response length
2. Verify SSE message format with proper `data:` prefix and `\n\n` termination
3. Test `/api/chat/stream` endpoint directly with curl

### **Client-Side Debugging:**
1. Check browser Network tab for SSE connection
2. Verify `onmessage` handler receives all events
3. Check React state updates in browser dev tools

### **Potential Solutions to Try:**
1. **Fix SSE Format**: Ensure proper `data: {content}\n\n` format
2. **Add Real Streaming**: Currently waits for complete response, should stream chunks
3. **Connection Keep-Alive**: May need to send periodic heartbeat messages
4. **Canvas iframe Issues**: Test outside Canvas to isolate iframe problems

## 📋 Next Steps

### **Immediate Priority (Fix Streaming):**
1. Debug why client doesn't receive content messages
2. Test streaming outside Canvas iframe environment
3. Implement true real-time streaming (not wait-for-complete)
4. Add visual streaming indicators (typing cursors)

### **Future Enhancements:**
1. Add conversation history persistence
2. Implement proper error recovery
3. Add file upload support
4. Optimize for mobile Canvas app
5. Add admin dashboard for monitoring

## 🔗 Important URLs

- **Production React**: https://canvas.ncsa.ai/react
- **Production HTML**: https://canvas.ncsa.ai/
- **Health Check**: https://canvas.ncsa.ai/health
- **GitHub Repo**: https://github.com/Center-for-AI-Innovation/uiuc-chat-canvas-app

## 🔑 API Configuration

- **UIUC Chat API**: https://uiuc.chat/api/chat-api/chat
- **Course**: BADM-350-Summer-2025
- **Model**: Qwen/Qwen2.5-VL-72B-Instruct
- **API Key**: Set via UIUC_API_KEY environment variable

## 👥 Development Notes

- **Main Branch**: `main`
- **Canvas LTI URLs**: Configured in XML files to point to https://canvas.ncsa.ai
- **CORS**: Configured for `.instructure.com` and `.canvas.*` domains
- **Node Version**: 18.20.6 (on remote server)

## 🐛 Known Issues

1. **Streaming Empty Messages**: Client receives connection but not content
2. **Bash Tool Issues**: Local development tools had shell environment problems
3. **Submodule Cleanup**: Successfully resolved proxy-server submodule issues

---

*Last Updated: June 22, 2025*
*Status: Streaming implementation needs debugging*