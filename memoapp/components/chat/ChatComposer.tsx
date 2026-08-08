"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ArrowUp } from "lucide-react";

type ChatComposerProps = {
  onSend: (content: string) => void;
  focusRequest?: number;
};

export function ChatComposer({
  onSend,
  focusRequest = 0,
}: ChatComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (focusRequest === 0) return;

    textareaRef.current?.focus();
  }, [focusRequest]);

  function submit() {
    const trimmed = value.trim();

    if (!trimmed) return;

    onSend(trimmed);
    setValue("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative rounded-2xl border border-memo-divider bg-memo-background shadow-[0_10px_30px_rgba(42,36,31,0.04)] transition-colors focus-within:border-memo-connection-300">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="Share what’s present..."
          aria-label="Write a reflection"
          className="block min-h-16 w-full resize-none bg-transparent px-3 py-2 pr-14 text-[15px] leading-relaxed text-memo-text outline-none placeholder:text-memo-neutral-500"
        />

        <button
          type="submit"
          disabled={!value.trim()}
          aria-label="Send reflection"
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-memo-text text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-3 px-1 text-xs text-memo-neutral-500">
        Press{" "}
        <kbd className="rounded border border-memo-divider bg-memo-surface px-1.5 py-0.5 text-[10px]">
          Enter
        </kbd>{" "}
        to send and{" "}
        <kbd className="rounded border border-memo-divider bg-memo-surface px-1.5 py-0.5 text-[10px]">
          Shift + Enter
        </kbd>{" "}
        for a new line.
      </p>
    </form>
  );
}