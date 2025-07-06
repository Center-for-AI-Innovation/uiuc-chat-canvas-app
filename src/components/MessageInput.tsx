'use client';

import { useState, KeyboardEvent } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export default function MessageInput({ 
  onSendMessage, 
  isLoading, 
  placeholder = "Type your message..." 
}: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-start space-x-3">
        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            style={{
              minHeight: '48px',
              maxHeight: '120px',
              '--tw-ring-color': '#FF5F05'
            } as React.CSSProperties}
          />
          {/* Character indicator for long messages */}
          {message.length > 100 && (
            <span className="absolute bottom-2 right-14 text-xs text-gray-400">
              {message.length}
            </span>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className="px-6 py-3 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          style={{
            backgroundColor: '#FF5F05',
            borderColor: '#FF5F05'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e55404'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF5F05'}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Sending...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Send</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>
      </div>
      
      {/* Helpful hint */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-gray-500">
          Press Enter to send • Shift+Enter for new line
        </p>
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Secure & Private</span>
        </div>
      </div>
    </div>
  );
}