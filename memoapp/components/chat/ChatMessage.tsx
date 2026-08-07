"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { BookOpen, ArrowUpRight } from "lucide-react";

type ChatMessageProps = {
  role: "assistant" | "user";
  content: string;
  eyebrow?: string;
  furtherReading?: {
    id: string;
    title: string;
    slogan_number: number | null;
  };
};

const ease = [0.22, 1, 0.36, 1] as const;

export function ChatMessage({
  role,
  content,
  eyebrow,
  furtherReading,
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
        <div className="max-w-2xl rounded-2xl bg-memo-neutral-100 px-4 py-3 text-[15px] leading-relaxed text-memo-text">
          {content}
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
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-memo-secondary-100 text-[13px] font-medium text-memo-secondary-600">
        a
      </div>

      <article className="max-w-2xl border-l border-memo-secondary-300/70 pl-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-memo-neutral-500">
          {eyebrow ?? "Ana"}
        </p>

        <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-memo-text">
          {content}
        </p>

        {furtherReading && (
          <div className="mt-5 pt-1">
            <div className="mb-1 flex items-center gap-1.5">
              <BookOpen className="h-4.5 w-4.5 text-memo-secondary-500" />

              <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-memo-secondary-500">
                Lojong
                {furtherReading.slogan_number !== null
                  ? ` · ${furtherReading.slogan_number}`
                  : ""}
              </span>
            </div>

            <p className="font-heading text-[16px] leading-snug text-memo-text">
              {furtherReading.title}
            </p>

            <Link
              href={`/library/${furtherReading.id}`}
              className="group mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-memo-secondary-500"
            >
              Explore the teaching

              <ArrowUpRight
                className="
                  h-3.5 w-3.5
                  transition-transform
                  duration-200
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </Link>
          </div>
        )}
      </article>
    </motion.div>
  );
}