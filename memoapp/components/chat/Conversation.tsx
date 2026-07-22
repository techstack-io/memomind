"use client";

import { useState } from "react";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatMessage } from "@/components/chat/ChatMessage";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

export default function Conversation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
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
    <section className="flex min-h-[calc(100vh-3rem)] flex-col">
      <header className="flex items-center justify-between border-b border-memo-divider px-8 py-4">
        <div>
          <h1 className="font-heading text-xl font-semibold text-memo-text">
            New reflection
          </h1>

          <p className="text-[13px] text-memo-neutral-700">
            with Memo · today
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto py-9">
        <ul className="mx-auto flex max-w-[720px] flex-col gap-7 px-8">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))}
        </ul>
      </div>

      <div className="shrink-0 px-8 pb-7 pt-5">
        <div className="mx-auto max-w-[720px]">
          <ChatComposer onSend={handleSend} />
        </div>
      </div>
    </section>
  );
}