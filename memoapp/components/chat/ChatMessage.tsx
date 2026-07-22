type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
};

export function ChatMessage({ role, content }: ChatMessageProps) {
  if (role === "user") {
    return (
      <li className="ms-auto flex max-w-lg gap-x-2 sm:gap-x-4">
        <div className="grow space-y-3 text-end">
          <div className="inline-flex flex-col justify-end">
            <div className="inline-block rounded-2xl bg-ink p-4 shadow-sm">
              <p className="text-sm leading-6 text-cream">{content}</p>
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="me-11 flex max-w-lg gap-x-2 sm:gap-x-4">
      <div>
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <p className="text-sm leading-6 text-ink">{content}</p>
        </div>
      </div>
    </li>
  );
}