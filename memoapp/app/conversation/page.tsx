"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

import AppSidebar from "@/components/layout/AppSidebar";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatMessage } from "@/components/chat/ChatMessage";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  eyebrow?: string;
};

type Reflection = {
  id: string;
  title: string;
  group: "Today" | "Yesterday" | "Last Week" | "Older";
};

const REFLECTIONS: Reflection[] = [
  {
    id: "letting-go-of-urgency",
    title: "Letting go of urgency",
    group: "Today",
  },
  {
    id: "morning-restlessness",
    title: "Morning restlessness",
    group: "Yesterday",
  },
  {
    id: "comparing-myself",
    title: "Comparing myself to others",
    group: "Last Week",
  },
  {
    id: "foundations-slogan-three",
    title: "Foundations: Slogan 3",
    group: "Last Week",
  },
  {
    id: "difficulty-resting",
    title: "Difficulty allowing myself to rest",
    group: "Older",
  },
];

const GROUPS = ["Today", "Yesterday", "Last Week", "Older"] as const;

export default function ConversationPage() {
  const [query, setQuery] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      eyebrow: "A reflection with Memo",
      content: "Good to see you again. What’s present for you today?",
    },
  ]);

  const filteredReflections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return REFLECTIONS;
    }

    return REFLECTIONS.filter((reflection) =>
      reflection.title.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

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
    <main className="mx-auto flex w-full max-w-[1600px] gap-6 px-6 pb-6">
      <AppSidebar />

      <section className="flex min-h-[calc(100vh-7rem)] min-w-0 flex-1 overflow-hidden rounded-3xl border border-memo-divider bg-memo-surface">
        <aside className="hidden w-72 shrink-0 flex-col border-r border-memo-divider lg:flex">
          <div className="p-4">
            <Link
              href="/conversation"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-memo-connection-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-memo-connection-700"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New Reflection
            </Link>

            <label className="mt-4 flex items-center gap-2 rounded-xl border border-memo-divider bg-memo-background px-3 py-2.5">
              <Search
                className="h-4 w-4 shrink-0 text-memo-neutral-500"
                aria-hidden="true"
              />

              <span className="sr-only">Search reflections</span>

              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search reflections"
                className="min-w-0 flex-1 bg-transparent text-sm text-memo-text outline-none placeholder:text-memo-neutral-500"
              />
            </label>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-5">
            {GROUPS.map((group) => {
              const reflections = filteredReflections.filter(
                (reflection) => reflection.group === group,
              );

              if (reflections.length === 0) {
                return null;
              }

              return (
                <section key={group} className="mt-5 first:mt-1">
                  <h2 className="px-3 text-xs font-medium uppercase tracking-[0.12em] text-memo-neutral-500">
                    {group}
                  </h2>

                  <div className="mt-1 space-y-0.5">
                    {reflections.map((reflection) => (
                      <Link
                        key={reflection.id}
                        href={`/conversation/${reflection.id}`}
                        className="block truncate rounded-lg px-3 py-2 text-sm text-memo-neutral-700 transition-colors hover:bg-memo-neutral-100 hover:text-memo-text"
                      >
                        {reflection.title}
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}

            {filteredReflections.length === 0 && (
              <p className="px-3 py-8 text-sm text-memo-neutral-500">
                No reflections found.
              </p>
            )}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-memo-background">
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
        </div>
      </section>
    </main>
  );
}
