export function ChatHeader() {
  return (
    <header className="max-w-3xl">
      <p className="text-sm uppercase tracking-[0.22em] text-memo-connection-600">
        Conversation with Memo
      </p>

      <h1 className="mt-4 font-heading text-5xl leading-[1.05] tracking-[-0.035em] text-slate-700">
        Good afternoon.{" "}
        <span className="text-memo-connection-600 italic">
          What's present for you?
        </span>
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-relaxed text-memo-neutral-700">
        Speak as you naturally would. Memo listens first, and only offers a
        teaching when it genuinely serves the conversation.
      </p>
    </header>
  );
}