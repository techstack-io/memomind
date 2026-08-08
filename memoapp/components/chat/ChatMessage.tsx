"use client";

import Link from "next/link";
import Image from "next/image";
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
        <div className="mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-full border border-memo-secondary-300/40 shadow-sm">
          <Image
            src="/avatars/ana.jpg"
            alt="Ana"
            width={40}
            height={40}
            className="h-full w-full object-cover"
            priority
          />
        </div>

      <article className="max-w-2xl border-l border-memo-secondary-300/70 pl-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-memo-neutral-500">
          {eyebrow ?? "Ana"}
        </p>

        <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-memo-text">
          {content}
        </p>

        {furtherReading && (
          <div className="mt-6 max-w-[540px] rounded-2xl border border-memo-secondary-300/40 bg-memo-secondary-100/30 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-memo-secondary-100">
                <BookOpen
                  className="h-4 w-4 text-memo-secondary-600"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-memo-secondary-600">
                  A practice for this moment
                </p>

                <p className="mt-2 font-heading text-[17px] leading-snug text-memo-text">
                  {furtherReading.title}
                </p>

                {furtherReading.slogan_number !== null && (
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-memo-neutral-500">
                    Lojong · {furtherReading.slogan_number}
                  </p>
                )}

                <Link
                  href={`/library/${furtherReading.id}`}
                  className="group mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-memo-secondary-600"
                >
                  Explore the teaching

                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        )}
      </article>
    </motion.div>
  );
}