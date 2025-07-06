# Illinois Chat - Canvas LTI Integration

AI-powered chat assistant for University of Illinois courses, integrated with Canvas LMS through LTI (Learning Tools Interoperability).

## Overview

This Next.js application provides students with an intelligent chat interface that can answer questions about course materials, assignments, lectures, and other course-related content. The app launches directly from Canvas courses and maintains context about the user and course.

## Features

- **Canvas LTI Integration**: Seamlessly launches from Canvas course navigation
- **Course Context Awareness**: Automatically extracts user and course information from Canvas
- **Streaming Chat Interface**: Real-time AI responses with typing indicators
- **Illinois Branding**: Authentic University of Illinois visual identity
- **Source Link Handling**: Clean display of document references with overlay styling
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

- **Frontend**: Next.js 15 with React 19 and TypeScript
- **Styling**: Tailwind CSS with custom Illinois branding
- **API Integration**: UIUC Chat API for AI responses
- **Deployment**: Ubuntu server with Cloudflare tunnel

## Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Arluigi/canvasbot.git
   cd canvasbot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```bash
   UIUC_API_KEY=your_api_key_here
   UIUC_API_URL=https://uiuc.chat/api/chat-api/chat
   PORT=3001
   NODE_ENV=development
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Canvas LTI Configuration

1. **Generate LTI Configuration**:
   The app includes `config-react.xml` for LTI tool registration

2. **Register in Canvas**:
   - Go to Canvas Admin → Settings → Apps
   - Add new app using the XML configuration
   - Set launch URL to your deployed application URL

3. **Course Integration**:
   - Enable the tool in course settings
   - Add to course navigation menu

## Deployment

### Production Server
- **Host**: Ubuntu 20.04 LTS
- **URL**: https://canvas.ncsa.ai
- **Runtime**: Node.js 18.20.6 with Next.js

### Build and Deploy
```bash
# Build for production
npm run build

# Start production server
npm run start
```

## API Routes

- **`/api/lti`**: Handles Canvas LTI launch requests and extracts context
- **`/api/chat`**: Processes chat messages and streams AI responses

## Project Structure

```
canvasbot/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── lti/route.ts      # LTI launch handler
│   │   │   └── chat/route.ts     # Chat API endpoint
│   │   ├── page.tsx              # Main chat interface
│   │   ├── layout.tsx            # App layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── ChatContainer.tsx     # Main chat container
│   │   ├── Message.tsx           # Message component with link parsing
│   │   ├── MessageList.tsx       # Message list display
│   │   └── MessageInput.tsx      # Message input form
│   ├── hooks/
│   │   └── useChat.ts            # Chat logic and state management
│   └── types/
│       └── index.ts              # TypeScript type definitions
├── public/
│   └── illinois-block-i.svg      # Official Illinois logo
├── config-react.xml              # LTI tool configuration
└── package.json                  # Dependencies and scripts
```

## Key Components

### Message Component
Features markdown link parsing with blue overlay rectangles for source references. Converts `[filename](url)` patterns into clickable styled links.

### Chat Hook
Manages chat state, handles streaming responses from the UIUC API, and maintains message history.

### LTI Integration
Extracts Canvas context (user, course) from LTI launch parameters and provides course-specific responses.

## Environment Variables

- `UIUC_API_KEY`: API key for UIUC Chat service
- `UIUC_API_URL`: Base URL for UIUC Chat API
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

## License

University of Illinois project for educational use.

## Support

For issues or questions, contact the development team or create an issue in the repository.