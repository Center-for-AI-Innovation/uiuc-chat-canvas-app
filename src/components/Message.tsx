'use client';

import { Message as MessageType } from '@/types';

interface MessageProps {
  message: MessageType;
}

// Parse markdown links and render as styled links with overlay rectangles
const parseMarkdownLinks = (content: string): React.ReactNode[] => {
  if (!content || typeof content !== 'string') {
    return [content];
  }
  
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    
    // Add the link with overlay rectangle styling
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-100 text-blue-900 hover:bg-blue-200 rounded-md px-2 py-1 border border-blue-300 transition-colors duration-200 inline mr-px"
      >
        {match[1]}
      </a>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }
  
  // If no links were found, return original content
  if (parts.length === 0) {
    return [content];
  }
  
  return parts;
};

export default function Message({ message }: MessageProps) {
  const { content, isUser, timestamp, isStreaming } = message;

  return (
    <div className={`flex items-end space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 self-end ${
        isUser 
          ? 'bg-orange-200 text-orange-700' 
          : 'bg-blue-200 text-blue-700'
      }`}
        style={{marginBottom: '25px'}}>
        <span className="text-sm">
          {isUser ? '👤' : '🤖'}
        </span>
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-xs sm:max-w-md`}>
        <div className={`rounded-lg px-4 py-3 ${
          isUser 
            ? 'text-orange-800' 
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}
          style={isUser ? {backgroundColor: '#FFF3E0', borderColor: '#FFB366'} : {}}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {parseMarkdownLinks(content)}
            {/* Show typing cursor for streaming messages */}
            {isStreaming && !isUser && (
              <span className="inline-block w-2 h-4 bg-gray-600 ml-1 animate-pulse"></span>
            )}
          </p>
        </div>
        
        {/* Timestamp */}
        <span className="text-xs text-gray-500 mt-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}