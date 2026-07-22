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
      content: "Hello. I'm Memo. When you're ready, let's chat.",
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
    <section className="mx-auto w-full max-w-3xl">
      <ul className="space-y-5">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}
      </ul>

      <div className="mt-6">
        <ChatComposer onSend={handleSend} />
      </div>
    </section>
  );
}