"use client";

import { useAgentCommunication } from "@/hooks/useAgentComunication";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef } from "react";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-none text-gray-100">{content}</div>
  );
};

export default function SuiteIA() {
  const {
    selectedAgent,
    agents,
    messages,
    partial,
    input,
    setInput,
    handleAgentChange,
    sendMessage,
  } = useAgentCommunication();

  const handleSubmit = () => {
    if (!input.trim()) return;
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) sendMessage(input);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [selectedAgent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, partial]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <main className="relative z-10 min-h-screen p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/25">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                SuiteIA
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Unlock the power of specialized AI agents designed for your unique
              challenges
            </p>
          </div>

          {/* Agent Selection */}
          <div className="flex gap-4 mb-8 flex-wrap justify-center">
            {agents.map((agent) => {
              const IconComponent = agent.icon;
              const isSelected = selectedAgent.id === agent.id;

              return (
                <button
                  key={agent.id}
                  onClick={() => handleAgentChange(agent.id)}
                  className={`group relative p-4 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    isSelected
                      ? "bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border-purple-400/50 shadow-lg shadow-purple-500/25"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  } backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg"
                          : "bg-white/10 group-hover:bg-white/20"
                      }`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-medium">{agent.name}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Chat Interface */}
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl shadow-black/20 overflow-hidden">
            {/* Chat Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-600/10 to-cyan-600/10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg">
                  <selectedAgent.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedAgent.name}
                  </h2>
                  <p className="text-gray-300 text-lg">
                    {selectedAgent.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages
                .filter((msg) => msg.role !== "system") // Filter out system messages from display
                .map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white ml-12 shadow-lg shadow-purple-500/25"
                          : "bg-white/10 text-gray-100 backdrop-blur-sm border border-white/10"
                      } transition-all duration-300 hover:shadow-lg`}
                    >
                      {msg.role === "assistant" ? (
                        <MarkdownRenderer content={msg.content} />
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

              {partial && (
                <div className="flex gap-4 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg animate-pulse">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl p-4 bg-white/10 text-gray-300 backdrop-blur-sm border border-white/10">
                    <MarkdownRenderer content={partial} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/10 bg-gradient-to-r from-purple-600/5 to-cyan-600/5">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="w-full p-4 pr-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-300 hover:bg-white/15"
                    rows={1}
                    style={{ minHeight: "56px", maxHeight: "120px" }}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className="px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              Powered by SuiteAI • Built for the future
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #06b6d4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #0891b2);
        }
      `}</style>
    </div>
  );
}
