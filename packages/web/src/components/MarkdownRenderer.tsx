"use client";

import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  onCopy?: () => void;
  copied?: boolean;
}

export default function MarkdownRenderer({ content, onCopy, copied }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h1 className="text-2xl font-bold text-accent">
                {children}
              </h1>
              {onCopy && (
                <button
                  onClick={onCopy}
                  className="text-sm border border-border px-3 py-1.5 rounded hover:bg-bg-hover transition-colors shrink-0 ml-4"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-accent mt-8 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-accent mt-6 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-text leading-relaxed mb-4">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-text mb-4 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-text mb-4 space-y-1">
              {children}
            </ol>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className="block bg-bg-input border border-border rounded p-4 text-sm text-text overflow-x-auto mb-4">
                  {children}
                </code>
              );
            }
            return (
              <code className="bg-bg-input text-accent px-1.5 py-0.5 rounded text-sm">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <pre className="mb-4">{children}</pre>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent pl-4 text-text-muted italic mb-4">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="border-border my-6" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
