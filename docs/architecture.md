# Architecture Documentation

## System Overview

```
Canvas LTI → Cloudflare Tunnel → Next.js App (localhost:3001)
                                     ↓
                            Single Application:
                            - Server-side rendering
                            - API routes (/api/lti/, /api/chat)
                            - Integrated streaming
                            - Illinois branding
```

## Request Flow

### LTI Launch Flow
1. **Canvas POST** → Student clicks "Illinois Chat" in course navigation
2. **LTI Launch** → Canvas POSTs user/course data to `/api/lti/`
3. **Data Extraction** → Server extracts user info from Canvas LTI parameters
4. **Redirect** → Server redirects to `/?lti=true&courseId=...&userName=...`
5. **App Load** → Main page loads with personalized context
6. **Context Processing** → JavaScript extracts LTI data from URL parameters
7. **UI Update** → Header shows personalized welcome message
8. **Chat Ready** → User can interact with AI assistant

### Chat API Flow
1. **User Input** → Message entered in chat interface
2. **API Call** → POST to `/api/chat` with user context
3. **UIUC API** → Forward to `https://uiuc.chat/api/chat-api/chat`
4. **Streaming Response** → Server-Sent Events stream chunks back
5. **Link Parsing** → Convert markdown links to blue overlay rectangles
6. **UI Update** → Display messages with proper formatting

## Key Components

### API Routes
- `/api/lti/route.ts` - Handles Canvas LTI launches, extracts user context
- `/api/chat/route.ts` - Proxies chat requests to UIUC API with streaming

### Frontend Components
- `ChatContainer.tsx` - Main chat wrapper with welcome message
- `Message.tsx` - Individual message display with link parsing
- `MessageInput.tsx` - Chat input form with Illinois styling
- `page.tsx` - Main page with LTI context handling

### State Management
- `useChat.ts` - Chat state, message history, streaming logic
- URL parameters for LTI context (courseId, userId, userName)

## Data Flow

### User Context
```typescript
interface LTIContext {
  courseId: string;    // Canvas course ID
  userId: string;      // Canvas user ID  
  userName: string;    // User's display name
  courseName: string;  // Course title
}
```

### Message Processing
```typescript
// Input: "[filename.pdf](https://s3-url...)"
// Output: <a href="decoded-url" className="blue-overlay">filename.pdf</a>
```

## Environment Variables
- `UIUC_API_KEY` - Authentication for UIUC chat API
- `UIUC_API_URL` - Endpoint for UIUC chat service
- `PORT` - Application port (3001 in production)

## Deployment Infrastructure
- **Server**: Ubuntu 20.04 LTS at 141.142.216.30
- **Domain**: https://canvas.ncsa.ai (Cloudflare tunnel)
- **Process**: Manual start/stop with background logging
- **Files**: `/home/ubuntu/canvasbot/`