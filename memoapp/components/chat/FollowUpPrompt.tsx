"use client";

import { PenLine, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type FollowUpPromptProps = {
  question: string;
  onRespond: () => void;
  onSkip: () => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function FollowUpPrompt({
  question,
  onRespond,
  onSkip,
}: FollowUpPromptProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease, delay: 0.08 }}
      className="ml-13 mt-4 rounded-2xl border border-memo-divider bg-memo-surface px-4 py-4 shadow-[0_10px_26px_rgba(42,36,31,0.035)] sm:px-5"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F8EBDD]">
          <Sparkles className="h-4 w-4 text-[#A66A3F]" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] leading-relaxed text-memo-text">
            {question}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onRespond}
              className="inline-flex items-center gap-2 rounded-xl bg-memo-connection-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-memo-connection-700"
            >
              <PenLine className="h-4 w-4" aria-hidden="true" />
              Respond
            </button>

            <button
              type="button"
              onClick={onSkip}
              className="rounded-xl border border-memo-divider bg-memo-background px-4 py-2.5 text-sm font-medium text-memo-neutral-700 transition-colors duration-200 hover:bg-memo-neutral-100 hover:text-memo-text"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
