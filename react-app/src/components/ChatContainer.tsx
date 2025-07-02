'use client';

import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { LTIContext } from '@/types';
import { useChat } from '@/hooks/useChat';

interface ChatContainerProps {
  ltiContext: LTIContext;
}

export default function ChatContainer({ ltiContext }: ChatContainerProps) {
  const { messages, isLoading, error, sendMessage } = useChat();

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-[600px] flex flex-col overflow-hidden">
      {/* Header with UIUC Branding */}
      <div className="bg-gradient-to-r from-orange-500 to-blue-600 p-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-lg">Illinois Chat</h1>
            <p className="text-sm text-orange-100">
              Welcome, {ltiContext.userName} • {ltiContext.courseName}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border-t border-red-200">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700 font-medium">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t">
        <MessageInput 
          onSendMessage={sendMessage} 
          isLoading={isLoading}
          placeholder="Ask me about assignments, lectures, course materials..."
        />
      </div>
    </div>
  );
}