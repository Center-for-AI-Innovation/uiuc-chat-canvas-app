'use client';

import { Message as MessageType } from '@/types';

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  const { content, isUser, timestamp, isStreaming } = message;

  return (
    <div className={`flex items-start space-x-3 mb-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
        isUser 
          ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' 
          : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
      }`}>
        {isUser ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-xs sm:max-w-md lg:max-w-lg`}>
        {/* Message Label */}
        <span className={`text-xs font-medium mb-1 ${
          isUser ? 'text-orange-600' : 'text-blue-600'
        }`}>
          {isUser ? 'You' : 'UIUC Assistant'}
        </span>
        
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isUser 
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md' 
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
        }`}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {content}
            {/* Show typing cursor for streaming messages */}
            {isStreaming && !isUser && (
              <span className="inline-block w-0.5 h-4 bg-blue-500 ml-1 animate-pulse"></span>
            )}
          </p>
        </div>
        
        {/* Timestamp */}
        <span className="text-xs text-gray-400 mt-1 px-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}