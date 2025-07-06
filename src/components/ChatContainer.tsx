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
    <div className="bg-white rounded-lg shadow-lg border h-[600px] flex flex-col">
      {/* Welcome Message */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-orange-50">
        <p className="text-sm text-blue-800">
          👋 Welcome, {ltiContext.userName}! Ask me anything about {ltiContext.courseName}.
        </p>
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