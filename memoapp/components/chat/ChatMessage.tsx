type ChatMessageProps = {
  role: "assistant" | "user";
  content: string;
};

function MemoAvatar() {
  return (
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-memo-divider font-heading font-semibold text-memo-connection-700">
      M
    </div>
  );
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  if (role === "assistant") {
    return (
      <li className="flex items-start gap-3.5">
        <MemoAvatar />

        <p className="text-[17px] leading-relaxed text-memo-text">
          {content}
        </p>
      </li>
    );
  }

  return (
    <li className="flex justify-end">
      <div className="max-w-[80%] rounded-xl border border-memo-divider bg-memo-neutral-100 px-[18px] py-3.5 text-[17px] leading-relaxed text-memo-text">
        {content}
      </div>
    </li>
  );
}