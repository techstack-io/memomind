"use client";

import { useEffect, useRef, useState } from "react";

/**
 * MemoMind authenticated dashboard — Next.js + Tailwind port of the "1a"
 * option (icon rail for future features, bubble message style) from the
 * dashboard mock. Same "Fern Breath" tokens as MemoMindLanding.tsx — see
 * tailwind.config.snippet.ts.
 */

type Message = { id: string; who: "user" | "memo"; text: string };

const INITIAL_MESSAGES: Message[] = [
  { id: "m1", who: "user", text: "Today felt like too much. I don't even know where to start." },
  {
    id: "m2",
    who: "memo",
    text: "That sounds like a lot to carry at once. If you had to name just one thing weighing on you most right now — what would it be?",
  },
  {
    id: "m3",
    who: "user",
    text: "Probably the Memologic launch. It's eaten every evening this week and I still feel behind.",
  },
  {
    id: "m4",
    who: "memo",
    text: "It makes sense you're tired — you've been giving it everything you have. When you picture tomorrow evening, what would actually feel like relief?",
  },
  {
    id: "m5",
    who: "user",
    text: "Honestly? Just going for a walk without my phone. I keep meaning to and never do.",
  },
];

const FOLLOW_UP =
  "That's worth protecting, even for twenty minutes. I noticed something similar after your family weekend — you said it reset you completely.";

const CANNED_REPLIES = [
  "Thank you for sharing that. What does that bring up for you?",
  "That sounds meaningful — tell me more whenever you're ready.",
  "I hear you. Let's sit with that for a moment before moving on.",
];

const RAIL_ITEMS = [
  {
    label: "Memories",
    icon: (
      <>
        <path d="M12 2 2 7l10 5 10-5-10-5z" />
        <path d="M2 12l10 5 10-5" />
        <path d="M2 17l10 5 10-5" />
      </>
    ),
  },
  {
    label: "Reflections",
    icon: (
      <>
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <line x1="16" y1="8" x2="2" y2="22" />
        <line x1="17.5" y1="15" x2="9" y2="15" />
      </>
    ),
  },
  {
    label: "Goals",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
  },
  {
    label: "Insights",
    icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  },
];

function MemoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-memo-connection-600">
      <circle cx="8" cy="16" r="3" />
      <circle cx="16" cy="8" r="3" />
      <line x1="10.2" y1="13.8" x2="13.8" y2="10.2" />
    </svg>
  );
}

export default function MemoMindDashboard({ userName = "Dan" }: { userName?: string }) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(true);
  const [input, setInput] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const replyIndex = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setMessages((m) => [...m, { id: "m6", who: "memo", text: FOLLOW_UP }]);
      setIsTyping(false);
    }, 1600);
    timers.current.push(t);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), who: "user", text: value }]);
    setInput("");
    setIsTyping(true);
    const reply = CANNED_REPLIES[replyIndex.current % CANNED_REPLIES.length];
    replyIndex.current += 1;
    const t = setTimeout(() => {
      setMessages((m) => [...m, { id: crypto.randomUUID(), who: "memo", text: reply }]);
      setIsTyping(false);
    }, 1400);
    timers.current.push(t);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="h-screen flex bg-memo-bg text-memo-text font-body">
      {/* ICON RAIL — future features */}
      <div className="w-[84px] flex-none flex flex-col items-center py-5 border-r border-memo-divider bg-memo-surface">
        <div className="mb-7">
          <MemoMark size={24} />
        </div>
        {RAIL_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex flex-col items-center gap-1.5 w-full py-2.5 text-memo-neutral-700 hover:bg-memo-connection-100 transition-colors"
            title={`${item.label} — coming soon`}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              {item.icon}
            </svg>
            <span className="text-[9px] tracking-wider uppercase">{item.label}</span>
          </button>
        ))}
        <div className="flex-1" />
        <button
          type="button"
          className="flex flex-col items-center gap-1.5 w-full py-2.5 text-memo-neutral-700 hover:bg-memo-connection-100 transition-colors"
          title="Settings"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <span className="text-[9px] tracking-wider uppercase">Settings</span>
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* NAV */}
        <div className="h-16 flex-none flex items-center justify-between px-8 border-b border-memo-divider">
          <div className="font-heading font-semibold text-xl">MemoMind</div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 p-1"
            >
              <div className="w-8 h-8 rounded-full border border-memo-divider bg-memo-surface flex items-center justify-center font-heading font-semibold text-[13px]">
                {userName[0]}
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-memo-neutral-700">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-11 w-[200px] bg-memo-bg border border-memo-divider rounded-md shadow-md p-1.5 z-10">
                <div className="px-3 py-2 text-sm rounded hover:bg-memo-connection-100 cursor-pointer">Settings</div>
                <div className="h-px bg-memo-divider my-1" />
                <div className="px-3 py-2 text-sm rounded hover:bg-memo-connection-100 cursor-pointer">Sign out</div>
              </div>
            )}
          </div>
        </div>

        {/* CONVERSATION */}
        <div className="flex-1 flex flex-col items-center overflow-hidden min-h-0">
          <div className="w-full max-w-[720px] flex-none pt-6 px-6">
            <h2 className="font-heading font-semibold text-[22px]">Good evening, {userName}.</h2>
            <div className="text-sm text-memo-neutral-700 mt-1">Here&rsquo;s where we left off.</div>
          </div>

          <div ref={scrollRef} className="flex-1 w-full max-w-[720px] overflow-y-auto px-6 py-5 flex flex-col gap-[18px] min-h-0">
            {messages.map((m) => {
              const isUser = m.who === "user";
              return (
                <div key={m.id} className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={isUser ? "order-2 flex-none" : "order-none flex-none"}>
                    {isUser ? (
                      <div className="w-[26px] h-[26px] rounded-full border border-memo-divider bg-memo-surface flex items-center justify-center font-heading font-semibold text-[11px]">
                        {userName[0]}
                      </div>
                    ) : (
                      <MemoMark size={26} />
                    )}
                  </div>
                  <div
                    className={`order-1 max-w-[64%] text-[15px] leading-relaxed px-4 py-3 rounded-[10px] border ${
                      isUser
                        ? "border-memo-divider bg-memo-surface"
                        : "border-memo-connection-300 bg-memo-connection-100"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2.5">
                <MemoMark size={26} />
                <div className="flex items-center gap-1.5 text-sm text-memo-neutral-700">
                  Memo is reflecting
                  <span className="inline-flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-memo-neutral-700 animate-pulse" />
                    <span className="w-1 h-1 rounded-full bg-memo-neutral-700 animate-pulse [animation-delay:150ms]" />
                    <span className="w-1 h-1 rounded-full bg-memo-neutral-700 animate-pulse [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* COMPOSER */}
          <div className="w-full max-w-[720px] flex-none px-6 pt-3 pb-8">
            <div className="flex gap-2 flex-wrap mb-3">
              {["Tell me more", "I'd rather talk about something else", "What patterns have you noticed?"].map(
                (chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setInput(chip)}
                    className="text-xs border border-memo-divider rounded-full px-3.5 py-1.5 hover:bg-memo-connection-100 transition-colors"
                  >
                    {chip}
                  </button>
                )
              )}
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-1.5 border border-memo-divider rounded-full px-2 py-1.5 bg-memo-surface"
            >
              <button type="button" aria-label="Attach" className="p-2 text-memo-neutral-700">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <button type="button" aria-label="Voice" className="p-2 text-memo-neutral-700">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                  <path d="M19 11v1a7 7 0 0 1-14 0v-1" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Memo…"
                className="flex-1 bg-transparent outline-none text-sm px-1 py-2"
              />
              <button
                type="submit"
                aria-label="Send"
                className="w-[34px] h-[34px] flex-none rounded-full border border-memo-connection-500 text-memo-connection-600 flex items-center justify-center hover:bg-memo-connection-100 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
