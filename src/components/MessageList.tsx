'use client';

import { useEffect, useRef } from 'react';
import Message from './Message';
import { Message as MessageType } from '@/types';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8" style={{
        backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 165, 0, 0.05) 2px, transparent 2px),
                         radial-gradient(circle at 75px 75px, rgba(59, 130, 246, 0.05) 2px, transparent 2px)`,
        backgroundSize: '100px 100px'
      }}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Welcome to Illinois Chat</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            I&apos;m here to help you with course materials, assignments, lecture content, and any questions about your coursework.
          </p>
          <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700 font-medium mb-2">Try asking:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• &quot;What&apos;s due this week?&quot;</li>
              <li>• &quot;Explain today&apos;s lecture topic&quot;</li>
              <li>• &quot;Help with assignment guidelines&quot;</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD:react-app/src/components/MessageList.tsx
    <div className="h-full overflow-y-auto p-4" style={{
      backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 165, 0, 0.02) 1px, transparent 1px),
                       radial-gradient(circle at 75px 75px, rgba(59, 130, 246, 0.02) 1px, transparent 1px)`,
      backgroundSize: '100px 100px'
    }}>
      <div className="space-y-2">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-medium mb-1 text-blue-600">
                Illinois Assistant
              </span>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
=======
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      
      {/* Loading indicator - only show if no streaming message exists */}
      {isLoading && !messages.some(msg => msg.isStreaming) && (
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 text-sm">🤖</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 max-w-xs">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
>>>>>>> sync-with-rohan:src/components/MessageList.tsx
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}