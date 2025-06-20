// components/MarkdownRenderer.tsx

'use client'

import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { useState } from 'react'
import 'highlight.js/styles/github-dark.css'
import type { ComponentPropsWithoutRef } from 'react'

export default function MarkdownRenderer({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="text-sm leading-snug [&_p]:my-0 [&_pre]:my-2 [&_ul]:my-0 [&_li]:my-0 [&_code]:text-sm">
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          code: ({
            inline,
            className,
            children,
            ...props
          }: ComponentPropsWithoutRef<'code'> & {
            inline?: boolean
          }) => {
            const handleCopy = async () => {
              await navigator.clipboard.writeText(String(children))
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            }

            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }

            return (
              <div className="relative group">
                <pre className={className} {...props}>
                  <code>{children}</code>
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 text-xs bg-muted px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
