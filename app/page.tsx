// app/thomas/page.tsx

'use client'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useAgentCommunication } from '@/hooks/useAgentComunication'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { useRef, useEffect } from 'react'

export default function SuiteIA() {
  const {
    agents,
    selectedAgent,
    handleAgentChange,
    messages,
    partial,
    input,
    setInput,
    sendMessage,
  } = useAgentCommunication()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) sendMessage(input)
    }
  }

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [selectedAgent])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, partial])

  return (
    <main className="min-h-screen p-6 bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">SuiteIA</h1>
        <p className="text-muted-foreground mb-8">
          Interact with AI agents for different purposes
        </p>

        <div className="flex gap-4 mb-6">
          {agents.map((agent) => (
            <Button
              key={agent.id}
              variant={selectedAgent.id === agent.id ? 'default' : 'outline'}
              onClick={() => handleAgentChange(agent.id)}
            >
              {agent.name}
            </Button>
          ))}
        </div>

        <section className="border p-4 rounded-xl bg-card shadow mb-4">
          <h2 className="text-2xl font-semibold mb-2">{selectedAgent.name}</h2>
          <p className="text-muted-foreground mb-4">
            {selectedAgent.description}
          </p>

          <div className="space-y-2 max-h-80 overflow-auto text-sm">
            {messages.map((msg, i) => (
              <div key={i} className="whitespace-pre-wrap">
                {msg.role === 'user'
                  ? `👤 ${msg.content}`
                  : msg.role === 'assistant' && (
                      <div className="mt-2">
                        🤖
                        <div className="mt-1">
                          <MarkdownRenderer content={msg.content} />
                        </div>
                      </div>
                    )}
              </div>
            ))}
            {partial && (
              <div className="whitespace-pre-wrap text-muted-foreground">
                🤖 {partial}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question or prompt..."
            />
            <Button type="submit">Send</Button>
          </form>
        </section>
      </div>
    </main>
  )
}
