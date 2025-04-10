"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content text-sm ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSanitize,
          rehypeHighlight,
        ]}
        components={{
          a: (props) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            />
          ),
          code: ({
            node,
            // @ts-ignore
            inline,
            className,
            children,
            ...props
          }) => {
            return inline ? (
              <code
                className="bg-gray-200 px-1 py-0.5 rounded font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            ) : (
              <div className="bg-gray-800 rounded-md overflow-hidden">
                <code
                  className="block overflow-x-auto p-3 text-white font-mono text-sm"
                  {...props}
                >
                  {children}
                </code>
              </div>
            )
          },
          pre: ({ children }) => (
            <div className="mt-2 mb-4">{children}</div>
          ),
          p: ({ children }) => (
            <p className="mb-2">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc ml-6 mb-3">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-6 mb-3">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="mb-1">{children}</li>
          ),
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-2 mt-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold mb-2 mt-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-md font-bold mb-2 mt-3">
              {children}
            </h3>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-3 py-1 italic my-2">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full border-collapse border border-gray-300">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 bg-gray-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}