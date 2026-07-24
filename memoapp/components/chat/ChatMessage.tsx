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
        y: 12,
        scale: 0.985,
      };

  const animate = {
    opacity: 1,
    y: 0,
    scale: 1,
  };

  if (role === "user") {
    return (
      <motion.li
        initial={initial}
        animate={animate}
        transition={{
          duration: 0.45,
          ease,
        }}
        className="flex justify-end"
      >
        <div className="max-w-[82%] rounded-[18px] bg-[#29241f] px-5 py-4 text-[16px] leading-7 text-white shadow-sm md:max-w-[72%]">
          {content}
        </div>
      </motion.li>
    );
  }

  return (
    <motion.li
      initial={initial}
      animate={animate}
      transition={{
        duration: 0.6,
        ease,
      }}
      className="flex justify-start"
    >
      <article className="w-full max-w-[640px] rounded-[18px] border border-memo-divider bg-memo-background px-5 py-5 md:px-6">
        {eyebrow && (
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-memo-connection-700">
            {eyebrow}
          </p>
        )}

        <p className="text-[16px] leading-7 text-memo-neutral-700">
          {content}
        </p>
      </article>
    </motion.li>
  );
}