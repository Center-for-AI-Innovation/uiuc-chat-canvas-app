// TypeScript interfaces for the Canvas Chat App

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface LTIContext {
  courseId: string;
  userId: string;
  userName: string;
  courseName?: string;
}

export interface ChatAPIRequest {
  model: string;
  messages: APIMessage[];
  course_name: string;
  stream: boolean;
  temperature: number;
  retrieval_only: boolean;
}

export interface APIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatAPIResponse {
  message: string;
  contexts?: unknown[];
  error?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  ltiContext: LTIContext | null;
}