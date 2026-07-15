"use client";

import { useEffect, useState } from "react";

/**
 * MemoMind authenticated dashboard shell — Next.js + Tailwind, same
 * "Fern Breath" tokens as MemoMindLanding.tsx (see tailwind.config.snippet.ts).
 *
 * Stripped down from the original dashboard: nav, icon rail, and greeting
 * are intact. The conversation (messages, typing indicator, composer) has
 * been removed so this can serve as a clean base — e.g. for the age-gate
 * modal to render on top of, or for the conversation to be reintroduced
 * as its own piece later.
 */

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

// Original lines, written in Memo's own voice — not translations or
// quotations of any specific text or tradition. Rotates once per day.
const DAILY_LINES = [
  "Whatever today holds, you don't have to meet it all at once.",
  "Difficulty isn't proof something has gone wrong — sometimes it's just weather.",
  "You don't need to have this figured out yet to take one honest step.",
  "The people who test your patience are also teaching you something about it.",
  "Not every thought needs to be believed the moment it arrives.",
  "Small, steady attention is its own kind of strength.",
  "What feels urgent and what actually matters aren't always the same thing.",
];

function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getDailyLine(date: Date = new Date()): string {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000);
  return DAILY_LINES[dayOfYear % DAILY_LINES.length];
}

// --- Morning practice (Lojong 41) -----------------------------------------
//
// Day 1: show the full teaching once.
// Days 2 through NUDGE_WINDOW_DAYS: a small, dismissible daily nudge, so the
// practice has a real chance to become a habit rather than being taught once
// and forgotten. The user can turn this off at any point.
// After the window (or once turned off): falls back to the regular rotating
// daily reflection card — no separate prompt hangs around indefinitely.
//
// NOTE: this demo persists state in localStorage for simplicity. In
// production this should be tracked server-side against the user's account
// (first-use date, ack, nudge preference), the same way onboarding consent
// should be — a device-local flag isn't durable across devices or reinstalls.

const NUDGE_WINDOW_DAYS = 14;
const FIRST_SEEN_KEY = "memomind_first_seen_at";
const DAY1_ACK_KEY = "memomind_day1_practice_ack";
const NUDGE_ENABLED_KEY = "memomind_morning_nudge_enabled";

const MORNING_PRACTICE_TITLE = "Lojong Slogan 41 — Two Activities: One at the Beginning, One at the End";

const MORNING_PRACTICE_INTRO =
  "This slogan is about treating the start and close of your day as deliberate moments, not just the edges of your to-do list — beginning with intention, and ending by looking back on how the day went.";

const MORNING_PRACTICE_BODY = [
  "From the moment you wake up, your mind tends to start moving — the school run, an email to send, coffee, breakfast, the day's first can't-forget. For the next few days, just notice that. Notice what shows up first, without needing to do anything about it yet.",
  "After a few days of noticing, try something different: wake up, and stay quiet for a moment before anything else. Listen — the birds, the room, whatever's actually around you. Let yourself be there before the list starts.",
  "Once you feel a little settled, offer a small word of thanks. There's no script for this — thank the light for showing up, the plants outside, the people in your life, yourself for waking up again. Make it yours as you go.",
  "This works well done with children, too — a simple, steady way to begin the day together.",
];

type PracticePhase = "loading" | "day1" | "nudge" | "settled";

function usePracticePhase(): {
  phase: PracticePhase;
  acknowledgeDay1: () => void;
  disableNudge: () => void;
} {
  const [phase, setPhase] = useState<PracticePhase>("loading");

  useEffect(() => {
    const firstSeenRaw = window.localStorage.getItem(FIRST_SEEN_KEY);
    const day1Ack = window.localStorage.getItem(DAY1_ACK_KEY) === "true";
    const nudgeEnabled = window.localStorage.getItem(NUDGE_ENABLED_KEY) !== "false";

    if (!firstSeenRaw) {
      // First time this device has ever loaded the dashboard.
      window.localStorage.setItem(FIRST_SEEN_KEY, String(Date.now()));
      setPhase("day1");
      return;
    }

    if (!day1Ack) {
      // They've been here before but never acknowledged day 1 — keep
      // showing it rather than skipping ahead.
      setPhase("day1");
      return;
    }

    const daysSinceFirst = Math.floor((Date.now() - Number(firstSeenRaw)) / 86400000);
    if (nudgeEnabled && daysSinceFirst <= NUDGE_WINDOW_DAYS) {
      setPhase("nudge");
    } else {
      setPhase("settled");
    }
  }, []);

  const acknowledgeDay1 = () => {
    window.localStorage.setItem(DAY1_ACK_KEY, "true");
    setPhase("nudge");
  };

  const disableNudge = () => {
    window.localStorage.setItem(NUDGE_ENABLED_KEY, "false");
    setPhase("settled");
  };

  return { phase, acknowledgeDay1, disableNudge };
}

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
  const [profileOpen, setProfileOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { phase, acknowledgeDay1, disableNudge } = usePracticePhase();

  // getGreeting()/getDailyLine() depend on the current time, which can
  // legitimately differ between server render and client hydration (e.g.
  // if the render happens to straddle an hour boundary). Computing them
  // during render caused a hydration mismatch. Instead, render a stable
  // placeholder on first paint and fill in the real value client-side,
  // the same way usePracticePhase() already handles its own client-only
  // state.
  const [greeting, setGreeting] = useState<string | null>(null);
  const [dailyLine, setDailyLine] = useState<string | null>(null);

  useEffect(() => {
    setGreeting(getGreeting());
    setDailyLine(getDailyLine());
  }, []);

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

        {/* CONTENT — conversation removed */}
        <div className="flex-1 flex flex-col items-center overflow-hidden min-h-0">
          <div className="w-full max-w-[720px] flex-none pt-6 px-6">
            <h2 className="font-heading font-semibold text-[22px]">
              {greeting ?? "Welcome"}, {userName}.
            </h2>

            {phase === "day1" && (
              <div className="mt-4 border border-memo-connection-300 bg-memo-connection-100 rounded-[10px] px-5 py-4">
                <div className="text-[11px] tracking-wider uppercase text-memo-neutral-700 mb-1.5">
                  {MORNING_PRACTICE_TITLE}
                </div>
                <p className="text-[14px] leading-relaxed text-memo-neutral-700 mb-3">
                  {MORNING_PRACTICE_INTRO}
                </p>
                <div className="text-[13px] font-medium mb-1.5">A way to start your day</div>
                <div className="flex flex-col gap-2.5">
                  {MORNING_PRACTICE_BODY.map((paragraph, i) => (
                    <p key={i} className="text-[15px] leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={acknowledgeDay1}
                  className="mt-4 rounded-full border border-memo-connection-500 text-memo-connection-600 font-heading font-semibold text-[14px] px-5 py-2 hover:bg-memo-bg transition-colors"
                >
                  Got it
                </button>
              </div>
            )}

            {phase === "nudge" && (
              <div className="mt-4 border border-memo-divider rounded-[10px] px-4 py-3.5 bg-memo-surface">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[15px]">
                    Morning practice — a moment before the day starts?
                  </p>
                  <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="text-[13px] text-memo-connection-600 whitespace-nowrap hover:underline"
                  >
                    {expanded ? "Hide" : "Show me"}
                  </button>
                </div>
                {expanded && (
                  <div className="flex flex-col gap-2.5 mt-3 pt-3 border-t border-memo-divider">
                    {MORNING_PRACTICE_BODY.map((paragraph, i) => (
                      <p key={i} className="text-[14px] leading-relaxed text-memo-neutral-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={disableNudge}
                  className="text-[12px] text-memo-neutral-700 hover:text-memo-text underline underline-offset-4 decoration-memo-divider transition-colors mt-3"
                >
                  Turn off this reminder
                </button>
              </div>
            )}

            {phase === "settled" && (
              <div className="mt-4 border border-memo-divider rounded-[10px] px-4 py-3.5 bg-memo-surface">
                <div className="text-[11px] tracking-wider uppercase text-memo-neutral-700 mb-1">
                  Today&rsquo;s reflection
                </div>
                <p className="text-[15px] leading-relaxed italic">{dailyLine ?? "\u00A0"}</p>
              </div>
            )}
          </div>

          {/* Everything below this point — message list, typing indicator,
              composer — was removed. This is where the conversation, or
              anything else, gets reintroduced next. */}
        </div>
      </div>
    </div>
  );
}