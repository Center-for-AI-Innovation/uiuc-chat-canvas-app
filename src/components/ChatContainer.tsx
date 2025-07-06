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
        <div className="px-4 py-2 bg-red-50 border-t">
          <p className="text-sm text-red-600">
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t">
        <MessageInput 
          onSendMessage={sendMessage} 
          isLoading={isLoading}
          placeholder="Ask about assignments, course content, deadlines..."
        />
      </div>
    </div>
  );
}