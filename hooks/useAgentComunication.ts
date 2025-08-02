import agents from "@/lib/agents";
import type { Message } from "@/types";
import { useState } from "react";

export function useAgentCommunication() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: agents[0].context },
  ]);
  const [partial, setPartial] = useState("");
  const [input, setInput] = useState("");

  const handleAgentChange = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;
    setSelectedAgent(agent);
    setMessages([
      {
        role: "system",
        content: "always answer briefly and concisely, do not extend too much",
      },
      { role: "system", content: agent.context },
    ]);
    setPartial("");
    setInput("");
  };

  const sendMessage = async (message: string) => {
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: message },
    ];

    setMessages(newMessages);
    setPartial("");
    setInput("");

    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    console.log(res);

    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value);
      setPartial(accumulated);
    }

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: accumulated },
    ]);
    setPartial("");
  };

  return {
    selectedAgent,
    agents,
    messages,
    partial,
    input,
    setInput,
    handleAgentChange,
    sendMessage,
  };
}
