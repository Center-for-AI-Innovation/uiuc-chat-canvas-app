'use client';

import { Message as MessageType } from '@/types';

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  const { content, isUser, timestamp, isStreaming } = message;

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-blue-600 text-white' 
          : 'bg-blue-100 text-blue-600'
      }`}>
        <span className="text-sm">
          {isUser ? '👤' : '🤖'}
        </span>
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-xs sm:max-w-md`}>
        <div className={`rounded-lg px-4 py-3 ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          <p className="text-sm whitespace-pre-wrap">
            {content}
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