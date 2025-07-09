'use client';

import { Message as MessageType } from '@/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { detectMarkdown, decodeHtmlEntities } from '@/utils/markdown';

interface MessageProps {
  message: MessageType;
}

// Parse markdown links and render as styled links with overlay rectangles
const parseMarkdownLinks = (content: string): React.ReactNode[] => {
  if (!content || typeof content !== 'string') {
    return [content];
  }
  
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    
    // Decode HTML entities in the URL
    const decodedUrl = decodeHtmlEntities(match[2]);
    
    // Add the link with overlay rectangle styling
    const linkText = match[1];
    const truncatedLinkText = truncateText(linkText);
    
    parts.push(
      <a
        key={match.index}
        href={decodedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-100 text-blue-900 hover:bg-blue-200 rounded-md px-2 py-0.5 border border-blue-300 transition-colors duration-200 inline mr-px"
        title={linkText} // Show full text on hover
      >
        {truncatedLinkText}
      </a>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }
  
  // If no links were found, return original content
  if (parts.length === 0) {
    return [content];
  }
  
  return parts;
};

// Helper function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number = 30): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

// Custom components for markdown rendering
const markdownComponents = {
  // Custom link renderer to maintain S3 URL blue overlay styling
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    const decodedUrl = href ? decodeHtmlEntities(href) : '#';
    const childText = typeof children === 'string' ? children : String(children);
    const truncatedText = truncateText(childText);
    
    return (
      <a
        href={decodedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-100 text-blue-900 hover:bg-blue-200 rounded-md px-2 py-0.5 border border-blue-300 transition-colors duration-200 inline mr-px"
        title={childText} // Show full text on hover
      >
        {truncatedText}
      </a>
    );
  },
  // Style other markdown elements
  h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-xl font-bold mb-2 mt-3">{children}</h1>,
  h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-lg font-semibold mb-2 mt-3">{children}</h2>,
  h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-base font-semibold mb-1 mt-2">{children}</h3>,
  p: ({ children }: { children?: React.ReactNode }) => <p className="mb-2 leading-relaxed">{children}</p>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc mb-2 ml-4">{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal mb-2 ml-4">{children}</ol>,
  li: ({ children }: { children?: React.ReactNode }) => <li className="mb-1 pl-2">{children}</li>,
  code: ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    const isInline = !className;
    return isInline ? (
      <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm">{children}</code>
    ) : (
      <code className="block bg-gray-100 text-gray-800 p-3 rounded-md overflow-x-auto my-2 text-sm">{children}</code>
    );
  },
  pre: ({ children }: { children?: React.ReactNode }) => <pre className="overflow-x-auto">{children}</pre>,
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-700">{children}</blockquote>
  ),
  hr: () => <hr className="my-4 border-gray-300" />,
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto my-2">
      <table className="min-w-full border-collapse border border-gray-300">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="border border-gray-300 px-3 py-2 bg-gray-100 font-semibold text-left">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="border border-gray-300 px-3 py-2">{children}</td>
  ),
};

export default function Message({ message }: MessageProps) {
  const { content, isUser, timestamp } = message;
  const isMarkdown = detectMarkdown(content);

  return (
    <div className={`flex items-end space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 self-end ${
        isUser 
          ? 'bg-orange-200 text-orange-700' 
          : 'bg-blue-200 text-blue-700'
      }`}
        style={{marginBottom: '25px'}}>
        <span className="text-sm">
          {isUser ? '👤' : '🤖'}
        </span>
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-xs sm:max-w-md`}>
        <div className={`rounded-lg px-4 py-3 ${
          isUser 
            ? 'text-orange-800' 
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}
          style={isUser ? {backgroundColor: '#FFF3E0', borderColor: '#FFB366'} : {}}>
          <div className="text-sm leading-relaxed">
            {isMarkdown ? (
              <div className="prose-sm">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap leading-relaxed">
                {parseMarkdownLinks(content)}
              </p>
            )}
          </div>
        </div>
        
        {/* Timestamp */}
        <span className="text-xs text-gray-500 mt-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}