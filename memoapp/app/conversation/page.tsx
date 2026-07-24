"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";

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
  { id: "letting-go-of-urgency", title: "Letting go of urgency", group: "Today" },
  { id: "morning-restlessness", title: "Morning restlessness", group: "Yesterday" },
  { id: "comparing-myself", title: "Comparing myself to others", group: "Last Week" },
  { id: "foundations-slogan-three", title: "Foundations: Slogan 3", group: "Last Week" },
  { id: "difficulty-resting", title: "Difficulty allowing myself to rest", group: "Older" },
];

const GROUPS = ["Today", "Yesterday", "Last Week", "Older"] as const;

const calmEase = [0.22, 1, 0.36, 1] as const;

const pageContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: calmEase,
      delayChildren: 0.12,
      staggerChildren: 0.12,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: calmEase,
    },
  },
};

const sidebarContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.08,
    },
  },
};

const sidebarItem: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.55,
      ease: calmEase,
    },
  },
};

const messageAnimation = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6 },
};

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

  const shouldReduceMotion = useReducedMotion();
  const initialState = shouldReduceMotion ? "visible" : "hidden";

  const filteredReflections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return REFLECTIONS;

    return REFLECTIONS.filter((reflection) =>
      reflection.title.toLowerCase().includes(normalizedQuery)
    );
  }, [query]);

  function handleSend(content: string) {
    const trimmed = content.trim();
    if (!trimmed) return;

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
    <motion.main
      variants={pageContainer}
      initial={initialState}
      animate="visible"
      className="mx-auto flex w-full max-w-[1600px] gap-6 px-6 pb-6"
    >
      <motion.div variants={fadeUp}>
        <AppSidebar />
      </motion.div>

      <motion.section
        variants={fadeUp}
        className="flex min-h-[calc(100vh-7rem)] min-w-0 flex-1 overflow-hidden rounded-3xl border border-memo-divider bg-memo-surface shadow-[0_18px_50px_rgba(42,36,31,0.05)]"
      >
        <motion.aside
          variants={sidebarContainer}
          initial={initialState}
          animate="visible"
          className="hidden w-72 shrink-0 flex-col border-r border-memo-divider lg:flex"
        >
          <motion.div variants={sidebarItem} className="p-4 pt-6">
            <motion.div
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { y: -2, boxShadow: "0 10px 24px rgba(42, 36, 31, 0.12)" }
              }
              whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
              transition={{ duration: 0.2, ease: calmEase }}
              className="rounded-xl"
            >
              <Link
                href="/conversation"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-memo-connection-600 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-memo-connection-700"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                New Reflection
              </Link>
            </motion.div>

            <label className="mt-4 flex items-center gap-2 rounded-xl border border-memo-divider bg-memo-background px-3 py-2.5 transition-colors focus-within:border-memo-connection-300">
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
          </motion.div>

          <motion.div
            variants={sidebarContainer}
            className="min-h-0 flex-1 overflow-y-auto px-3 pb-5"
          >
            {GROUPS.map((group) => {
              const reflections = filteredReflections.filter(
                (reflection) => reflection.group === group
              );

              if (reflections.length === 0) return null;

              return (
                <motion.section
                  key={group}
                  variants={sidebarItem}
                  className="mt-5 first:mt-1"
                >
                  <h2 className="px-3 text-xs font-medium uppercase tracking-[0.12em] text-memo-neutral-500">
                    {group}
                  </h2>

                  <div className="mt-1 space-y-0.5">
                    {reflections.map((reflection) => (
                      <Link
                        key={reflection.id}
                        href={`/conversation/${reflection.id}`}
                        className="block truncate rounded-lg px-3 py-2 text-sm text-memo-neutral-700 transition-colors duration-200 hover:bg-memo-neutral-100 hover:text-memo-text"
                      >
                        {reflection.title}
                      </Link>
                    ))}
                  </div>
                </motion.section>
              );
            })}

            {filteredReflections.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-3 py-8 text-sm text-memo-neutral-500"
              >
                No reflections found.
              </motion.p>
            )}
          </motion.div>
        </motion.aside>

        <div className="flex min-w-0 flex-1 flex-col bg-memo-background">
          <motion.header
            variants={fadeUp}
            className="border-b border-memo-divider/70 px-6 py-5 sm:px-8"
          >
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-memo-neutral-500">
              New Reflection
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-memo-text">
              A conversation with Memo
            </h1>
          </motion.header>

          <div className="min-h-0 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 pt-10 pb-4 sm:px-10 sm:pt-14 sm:pb-6">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={
                      shouldReduceMotion ? false : messageAnimation.initial
                    }
                    animate={messageAnimation.animate}
                    exit={messageAnimation.exit}
                    transition={{
                      duration: 0.65,
                      delay:
                        message.id === "welcome" && !shouldReduceMotion
                          ? 0.55
                          : index === messages.length - 1
                          ? 0.05
                          : 0,
                      ease: calmEase,
                    }}
                  >
                    <ChatMessage
                      role={message.role}
                      content={message.content}
                      eyebrow={message.eyebrow}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            variants={fadeUp}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.5,
            }}
            className="bg-memo-surface/90 px-5 py-6 backdrop-blur sm:px-8"
          >
            <div className="mx-auto w-full max-w-3xl">
              <ChatComposer onSend={handleSend} />
            </div>
          </motion.div>
        </div>
      </motion.section>
    </motion.main>
  );
}