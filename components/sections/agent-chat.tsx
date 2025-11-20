"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAgentStore } from "@/components/state/agent-store";
import { cn } from "@/lib/utils";
import { Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const AgentChat = () => {
  const { messages, addMessage, isProcessing, setProcessing, setSection } =
    useAgentStore();
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const sendPrompt = async (value: string) => {
    if (!value.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: value.trim(),
      createdAt: new Date().toISOString()
    };

    addMessage(userMessage);
    setInput("");
    setProcessing(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: value
        })
      });

      if (!response.ok) {
        throw new Error("Failed to reach agent");
      }

      const data = await response.json();

      addMessage({
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        createdAt: new Date().toISOString()
      });

      if (data.autoNavigate) {
        setSection(data.autoNavigate);
      }
    } catch (error) {
      console.error(error);
      addMessage({
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "I encountered an error while reasoning about that request. Please confirm your network connection and API keys, then try again.",
        createdAt: new Date().toISOString()
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendPrompt(input);
  };

  return (
    <div className="flex h-[70vh] flex-col gap-4">
      <div
        ref={containerRef}
        className="flex-1 space-y-4 overflow-y-auto pr-2"
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "max-w-3xl rounded-3xl border px-6 py-4 text-sm shadow",
              message.role === "assistant"
                ? "border-white/10 bg-white/10 text-slate-100"
                : "ml-auto border-accent/20 bg-accent/10 text-cyan-100"
            )}
          >
            <ReactMarkdown
              className="prose prose-invert max-w-none text-slate-100 prose-a:text-cyan-300"
              components={{
                li: ({ children }) => (
                  <li className="text-slate-200">{children}</li>
                )
              }}
            >
              {message.content}
            </ReactMarkdown>
          </motion.div>
        ))}
        {isProcessing && (
          <motion.div
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="h-3 w-3 animate-spin text-cyan-300" />
            Agentic cognition in progress…
          </motion.div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-inner"
      >
        <input
          className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
          placeholder="Give the agent a mission — e.g. “Develop a 30-day content ramp for a tech gadget reviewer.”"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button
          type="submit"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/80 text-slate-900 transition hover:bg-accent"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
};
