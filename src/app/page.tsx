'use client';

import { useState, useEffect } from 'react';
import ChatContainer from '@/components/ChatContainer';
import { LTIContext } from '@/types';

export default function ChatPage() {
  const [ltiContext, setLTIContext] = useState<LTIContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get LTI context from window object (injected by server)
    const windowWithLTI = window as Window & { LTI_CONTEXT?: LTIContext };
    if (typeof window !== 'undefined' && windowWithLTI.LTI_CONTEXT) {
      setLTIContext(windowWithLTI.LTI_CONTEXT);
      setIsLoading(false);
    } else {
      // Fallback for development
      const fallbackContext: LTIContext = {
        courseId: 'BADM-350-Summer-2025',
        userId: 'dev-user',
        userName: 'Development User',
        courseName: 'BADM 350: IT for Networked Organizations'
      };
      setLTIContext(fallbackContext);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{borderBottomColor: '#FF5F05'}}></div>
          <p className="text-gray-600">Loading Illinois Chat...</p>
        </div>
      </div>
    );
  }

  if (!ltiContext) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to load course context
          </h1>
          <p className="text-gray-600">
            Please access this app through Canvas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="shadow-lg" style={{backgroundColor: '#13294B'}}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-12">
              <img 
                src="/illinois-block-i.svg" 
                alt="Illinois Block I" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Illinois Chat
              </h1>
              <p className="text-sm text-blue-200">
                {ltiContext.courseName} • Welcome, {ltiContext.userName}
              </p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto p-4">
        <ChatContainer ltiContext={ltiContext} />
      </main>
    </div>
  );
}