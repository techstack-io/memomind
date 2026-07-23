"use client";

import { useState } from "react";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatMessage } from "@/components/chat/ChatMessage";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  eyebrow?: string;
};

export default function Conversation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      eyebrow: "A reflection with Memo",
      content: "Good to see you again. What's present for you today?",
    },
  ]);

  function handleSend(content: string) {
    const trimmed = content.trim();

    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
      },
    ]);
  }

  return (
    <section className="min-h-[calc(100vh-3rem)] bg-memo-background">
      <header className="border-b border-memo-divider px-6 py-5 md:px-10">
        <div className="mx-auto max-w-[820px]">
          <h1 className="font-heading text-[22px] font-semibold text-memo-text">
            New reflection
          </h1>
  
          <p className="mt-1 text-[13px] text-memo-neutral-700">
            with Memo · today
          </p>
        </div>
      </header>
  
      <div className="overflow-y-auto">
        <ul className="mx-auto flex max-w-[820px] flex-col gap-5 px-6 py-8 md:px-10">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              eyebrow={message.eyebrow}
            />
          ))}
        </ul>
      </div>
  
      <div className="bg-memo-background px-6 pb-6 md:px-10">
        <div className="mx-auto max-w-[820px]">
          <ChatComposer onSend={handleSend} />
        </div>
      </div>
    </section>
  );
}