import { ArrowUp } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

export function ChatComposer({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState("");

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-border/60 pt-5">
      <div className="relative rounded-2xl border border-border bg-card p-2 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-shadow focus-within:shadow-[0_1px_0_rgba(0,0,0,0.02),0_0_0_3px_oklch(0.62_0.16_35/0.12)]">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder="Share what's on your mind…"
          className="block w-full resize-none bg-transparent px-3 py-2 pr-14 text-[15px] leading-relaxed text-ink placeholder:text-muted-foreground/70 focus:outline-none"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!value.trim()}
          aria-label="Send message"
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream transition-opacity hover:opacity-90 disabled:opacity-30"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-3 px-1 text-xs text-muted-foreground">
        Memo listens slowly. Press <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-sans text-[10px]">Enter</kbd> to send, <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-sans text-[10px]">Shift + Enter</kbd> for a new line.
      </p>
    </div>
  );
}
