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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{borderBottomColor: '#FF5F05'}}></div>
          <p className="text-gray-600">Loading Illinois Chat...</p>
        </div>
      </div>
    );
  }

  if (!ltiContext) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mb-3">
            Canvas Integration Required
          </h1>
          <p className="text-gray-600 mb-4">
            This AI assistant needs to be accessed through Canvas to load your course context.
          </p>
          <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700">
              Please launch this app from your Canvas course navigation menu.
            </p>
          </div>
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