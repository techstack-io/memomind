"use client";

import { useState } from "react";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ReflectionSidebar } from "@/components/conversation/ReflectionSidebar";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  eyebrow?: string;
};

export default function ConversationPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      eyebrow: "A reflection with Memo",
      content: "Good to see you again. What’s present for you today?",
    },
  ]);

  function handleSend(content: string) {
    const trimmed = content.trim();

    if (!trimmed) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
      },
    ]);
  }

  return (
    <div className="flex min-h-[calc(100vh-3rem)] min-w-0 flex-1 overflow-hidden rounded-3xl border border-memo-divider bg-memo-surface">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row">
        <ReflectionSidebar />

        <main className="flex min-h-[650px] min-w-0 flex-1 flex-col bg-memo-background">
          <header className="border-b border-memo-divider/70 px-6 py-5 sm:px-8">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-memo-neutral-500">
              New Reflection
            </p>

            <h1 className="mt-1 text-xl font-semibold tracking-tight text-memo-text">
              A conversation with Memo
            </h1>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10 sm:px-10 sm:py-14">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  eyebrow={message.eyebrow}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-memo-divider/70 bg-memo-surface/90 px-5 py-5 backdrop-blur sm:px-8">
            <div className="mx-auto w-full max-w-3xl">
              <ChatComposer onSend={handleSend} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
