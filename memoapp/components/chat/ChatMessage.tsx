"use client";

import { motion, useReducedMotion } from "motion/react";

type ChatMessageProps = {
  role: "assistant" | "user";
  content: string;
  eyebrow?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function ChatMessage({
  role,
  content,
  eyebrow,
}: ChatMessageProps) {
  const reduceMotion = useReducedMotion();

  const initial = reduceMotion
    ? false
    : {
        opacity: 0,
        y: 10,
      };

  const animate = {
    opacity: 1,
    y: 0,
  };

  if (role === "user") {
    return (
      <motion.div
        initial={initial}
        animate={animate}
        transition={{
          duration: 0.4,
          ease,
        }}
        className="flex justify-end"
      >
        <div className="max-w-[82%] rounded-2xl rounded-tr-sm border border-memo-divider bg-memo-surface-raised px-5 py-3.5 shadow-[0_1px_0_rgba(0,0,0,0.02)] md:max-w-[72%]">
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-memo-text">
            {content}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{
        duration: 0.5,
        ease,
      }}
      className="flex gap-4"
    >
      <div
        aria-hidden="true"
        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-memo-divider bg-memo-surface-raised"
      >
        <span className="font-serif text-base leading-none text-memo-secondary-500">
          a
        </span>
      </div>

      <article className="max-w-2xl border-l border-memo-secondary-300/70 pl-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-memo-neutral-500">
          {eyebrow ?? "Ana"}
        </p>

        <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-memo-text">
          {content}
        </p>
      </article>
    </motion.div>
  );
}
