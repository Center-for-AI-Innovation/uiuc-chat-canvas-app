'use client';

import { useEffect, useRef } from 'react';
import Message from './Message';
import { Message as MessageType } from '@/types';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
  onSendMessage?: (message: string) => void;
}

export default function MessageList({ messages, isLoading, onSendMessage }: MessageListProps) {
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
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Welcome to Illinois Chat</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            I&apos;m here to help you with course materials, assignments, lecture content, and any questions about your coursework.
          </p>
          <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-gray-300">
            <p className="text-sm text-gray-700 font-medium mb-3">Try asking:</p>
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => onSendMessage?.("What's due this week?")}
                className="bg-blue-100 text-blue-900 hover:bg-blue-200 rounded-md px-1.5 py-0.5 border border-blue-300 transition-colors duration-200 inline-block text-sm"
              >
                📅 What&apos;s due this week?
              </button>
              <button
                onClick={() => onSendMessage?.("Explain today's lecture topic")}
                className="bg-blue-100 text-blue-900 hover:bg-blue-200 rounded-md px-1.5 py-0.5 border border-blue-300 transition-colors duration-200 inline-block text-sm"
              >
                📚 Explain today&apos;s lecture topic
              </button>
              <button
                onClick={() => onSendMessage?.("Help with assignment guidelines")}
                className="bg-blue-100 text-blue-900 hover:bg-blue-200 rounded-md px-1.5 py-0.5 border border-blue-300 transition-colors duration-200 inline-block text-sm"
              >
                📝 Help with assignment guidelines
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
            </div>
          </div>
        </div>
      )}
        
      <div ref={messagesEndRef} />
    </div>
  );
}