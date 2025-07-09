// Utility functions for markdown detection and processing

export const detectMarkdown = (content: string): boolean => {
  if (!content || typeof content !== 'string') {
    return false;
  }

  // Check for common markdown patterns
  const markdownPatterns = [
    /^#{1,6}\s/m,           // Headers (# ## ### etc)
    /```[\s\S]*?```/,       // Code blocks
    /^\s*[-*+]\s/m,         // Unordered lists
    /^\s*\d+\.\s/m,         // Ordered lists
    /\*\*.*?\*\*/,          // Bold text
    /\*[^*]+\*/,            // Italic text (but not bold)
    /\[.*?\]\(.*?\)/,       // Links
    /^>\s/m,                // Blockquotes
    /\|.*\|.*\|/,           // Tables
    /`[^`]+`/,              // Inline code
    /^\s*---\s*$/m,         // Horizontal rules
  ];

  // If any pattern matches, treat as markdown
  return markdownPatterns.some(pattern => pattern.test(content));
};

// Decode HTML entities in URLs
export const decodeHtmlEntities = (text: string): string => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};