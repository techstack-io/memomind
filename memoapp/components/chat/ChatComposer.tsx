"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

type ChatComposerProps = {
  onSend: (content: string) => void;
};

export function ChatComposer({ onSend }: ChatComposerProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = value.trim();

    if (!trimmed) return;

    onSend(trimmed);
    setValue("");
  }

  function handlePromptClick(prompt: string) {
    setValue(prompt);
  }

  return (
    <div className="space-y-8">
      <div className="mb-8 mt-20 border-t border-memo-divider/60" />
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 rounded-xl border border-memo-divider bg-memo-background px-4 py-3">
            <input
              type="text"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Share what’s present..."
              className="h-11 flex-1 bg-transparent text-[16px] text-memo-text outline-none placeholder:text-memo-neutral-700"
            />

            <button
              type="submit"
              disabled={!value.trim()}
              aria-label="Send reflection"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25221f] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ArrowRight size={20} strokeWidth={2} />
            </button>
          </div>
        </form>
    </div>
  );
}