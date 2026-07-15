"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";

import { ScanSearch } from "lucide-react";

/**
 * MemoMind landing page — Next.js + Tailwind port of the "Classical" design
 * system HTML prototype. Drop this component into any App Router page.
 *
 * Requires the `memo` color tokens + `font-heading`/`font-body` families to
 * be added to tailwind.config (see tailwind.config.snippet.ts) and the
 * Cormorant Garamond / Lora fonts to be loaded (see README.md).
 */

type NodeDef = {
  id: string;
  type: string;
  label: string;
  left: number;
  top: number;
};

type EdgeDef = {
  id: string;
  from: number;
  to: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  accent?: boolean;
};

const NODES: NodeDef[] = [
  { id: "dan", type: "Person", label: "Dan", left: 6.25, top: 47.2 },
  { id: "memologic", type: "Project", label: "Memologic", left: 26.6, top: 19.4 },
  { id: "goal", type: "Goal", label: "Launch Memologic", left: 51.6, top: 9.7 },
  { id: "workload", type: "Cause", label: "Product dev workload", left: 51.6, top: 41.7 },
  { id: "stress", type: "Emotion", label: "Stress", left: 75, top: 25 },
  { id: "family", type: "Activity", label: "Family weekend", left: 31.3, top: 75 },
  { id: "reduced", type: "Effect", label: "Reduced stress", left: 75, top: 70.8 },
];

const EDGES: EdgeDef[] = [
  { id: "e1", from: 0, to: 1, x1: 40, y1: 170, x2: 170, y2: 70 },
  { id: "e2", from: 1, to: 2, x1: 170, y1: 70, x2: 330, y2: 35 },
  { id: "e3", from: 1, to: 3, x1: 170, y1: 70, x2: 330, y2: 150 },
  { id: "e4", from: 3, to: 4, x1: 330, y1: 150, x2: 480, y2: 90 },
  { id: "e5", from: 0, to: 5, x1: 40, y1: 170, x2: 200, y2: 270 },
  { id: "e6", from: 5, to: 6, x1: 200, y1: 270, x2: 480, y2: 255 },
  { id: "e7", from: 4, to: 6, x1: 480, y1: 90, x2: 480, y2: 255, accent: true },
];

export default function MemoMindLanding({
  ctaLabel = "Join the waitlist",
  demoSpeedMs = 650,
}: {
  ctaLabel?: string;
  demoSpeedMs?: number;
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [insightReady, setInsightReady] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const startDemo = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStep(0);
    setDone(false);
    setInsightReady(false);
    NODES.forEach((_, i) => {
      const t = setTimeout(() => {
        setStep(i + 1);
        if (i + 1 === NODES.length) setDone(true);
      }, 900 + i * demoSpeedMs);
      timers.current.push(t);
    });
    const insightTimer = setTimeout(() => {
      setInsightReady(true);
    }, 900 + NODES.length * demoSpeedMs + 500);
    timers.current.push(insightTimer);
  };

  useEffect(() => {
    startDemo();
    return () => {
      timers.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-memo-bg text-memo-text font-body">
      {/* NAV */}
      <nav className="sticky top-0 z-20 flex items-center gap-8 px-12 py-4 bg-memo-bg/90 backdrop-blur-sm border-b border-memo-divider">
      <div className="mr-auto flex items-center gap-2">
        <Image
          src="/memomind-logo@72x.svg"
          alt="MemoMind"
          width={56}
          height={56}
          priority
        />

        <div className="flex items-baseline gap-2">
          <span className="font-heading text-2xl font-medium">
            MemoMind
          </span>

          <span className="
            text-[10px]
            font-normal
            uppercase
            tracking-[0.22em]
            text-memo-neutral-700/80
          ">
            Beta
          </span>
        </div>
      </div>
        <a href="#demo" className="text-sm hover:text-memo-connection-600 transition-colors">
          See it work
        </a>
        <a href="#privacy" className="text-sm hover:text-memo-connection-600 transition-colors">
          Privacy
        </a>
        <a href="#how" className="text-sm hover:text-memo-connection-600 transition-colors">
          How it works
        </a>
        <a href="#capabilities" className="text-sm hover:text-memo-connection-600 transition-colors">
          Capabilities
        </a>
        <a
          href="#waitlist"
          className="inline-flex items-center rounded font-heading font-semibold text-[13px] text-memo-connection-600 border border-memo-connection-500 px-4 py-2 hover:bg-memo-connection-500/10 transition-colors"
        >
          Join the waitlist
        </a>
      </nav>

      {/* HERO + LIVE EXTRACTION DEMO */}
      <section id="demo" className="flex flex-col items-center text-center px-6 pt-22 pb-10">
        <div className="text-xs tracking-widest uppercase text-memo-neutral-700 mb-4">
          Your life map
        </div>
        <h1 className="font-heading font-normal text-[48px] leading-[1.08] max-w-3xl mt-1.5">
          Meet <span className="text-memo-connection-600 italic">Memo</span>, your reflective companion.
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-memo-text/70 mt-6">
        Inspired by Lojong, MemoMind uses daily reflection to discover what matters most.

        </p>

        <div className="flex gap-3.5 mt-8">
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 rounded font-heading font-semibold text-[15px] text-memo-connection-600 border border-memo-connection-500 px-6 py-3 hover:bg-memo-connection-500/10 transition-colors"
          >
            {ctaLabel}
          </a>
          <a
            href="#how"
            className="inline-flex items-center rounded font-heading font-semibold text-[15px] border border-memo-divider px-6 py-3 hover:bg-memo-text/[0.06] transition-colors"
          >
            See how it works
          </a>
        </div>

        {/* Demo card */}
        <div className="mt-16 w-full max-w-[920px] text-left rounded-lg border border-memo-divider bg-memo-surface shadow-md p-8 box-border">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="text-[10px] tracking-widest uppercase text-memo-neutral-700 mb-1">
                Example
              </div>
              <h3 className="font-heading font-semibold text-xl">
                A real reflection, turned into understanding
              </h3>
            </div>
            <button
              onClick={startDemo}
              className="flex-none inline-flex items-center gap-1.5 rounded font-heading font-semibold text-[13px] border border-memo-divider px-3.5 py-2 hover:bg-memo-text/[0.07] transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Replay
            </button>
          </div>

          {/* chat bubble */}
          <div className="flex gap-3 items-start rounded border border-memo-divider p-4 bg-memo-bg">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-none mt-0.5 text-memo-neutral-700"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <div>
              <div className="text-[11px] text-memo-text/55 mb-1">Dan, Tuesday evening</div>
              <p className="text-[15px] leading-relaxed m-0">
                &ldquo;The Memologic launch has been eating all my time this week — I&rsquo;m
                feeling pretty stressed. Took the weekend off for a family trip though, and it
                really helped me reset.&rdquo;
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 my-4 text-memo-text/55 text-xs">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
            <span>Memo organizes what matters</span>
            <span className="flex-1 h-px bg-memo-divider" />
            {!insightReady ? (
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-memo-connection-500 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-memo-connection-500 animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-memo-connection-500 animate-pulse [animation-delay:300ms]" />
              </span>
            ) : (
              <span className="text-memo-connection-600">Insight ready</span>
            )}
          </div>

          {/* graph canvas */}
          <div className="relative w-full aspect-[640/360] rounded border border-memo-divider bg-memo-bg overflow-hidden">
            <svg
              viewBox="0 0 640 360"
              width="100%"
              height="100%"
              className="absolute inset-0"
              preserveAspectRatio="none"
            >
              {EDGES.map((edge) => {
                const visible = step > Math.max(edge.from, edge.to);
                const len = Math.hypot(edge.x2 - edge.x1, edge.y2 - edge.y1);
                return (
                  <line
                    key={edge.id}
                    x1={edge.x1}
                    y1={edge.y1}
                    x2={edge.x2}
                    y2={edge.y2}
                    stroke={edge.accent ? "#6B8E73" : "#B8C4BB"}
                    strokeWidth={1.5}
                    style={{
                      strokeDasharray: len,
                      strokeDashoffset: visible ? 0 : len,
                      opacity: visible ? 1 : 0,
                      transition: "stroke-dashoffset 0.6s ease, opacity 0.3s ease",
                    }}
                  />
                );
              })}
            </svg>
            {NODES.map((node, i) => {
              const visible = step > i;
              return (
                <div
                  key={node.id}
                  style={{
                    position: "absolute",
                    left: node.left + "%",
                    top: node.top + "%",
                    transform: `translate(-50%,-50%) scale(${visible ? 1 : 0.85})`,
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                    pointerEvents: "none",
                  }}
                >
                  <div className="rounded border border-memo-divider bg-memo-surface shadow-sm px-3 py-2 whitespace-nowrap">
                    <div className="text-[9px] tracking-wider uppercase text-memo-neutral-700">
                      {node.type}
                    </div>
                    <div className="font-heading font-semibold text-sm leading-tight">
                      {node.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* insight */}
          {insightReady && (
            <div className="mt-5 flex gap-3 items-start rounded border border-memo-connection-300 bg-memo-connection-100 p-4 animate-[fadeUp_0.5s_ease]">
              <ScanSearch
                className="h-[18px] w-[18px] flex-none mt-0.5 text-memo-connection-600"
              />
              <div>
                <div className="text-[10px] tracking-widest uppercase text-memo-connection-600 mb-1">
                  Memo notices
                </div>
                <p className="text-[15px] leading-relaxed m-0">
                Your biggest source of stress this week
                was launching Memologic—taking a
                family weekend brought it back down.
                </p>
              </div>
            </div>
          )}

          {/* structured record */}
          <div className="mt-5">
            <div className="text-[10px] tracking-widest uppercase text-memo-neutral-700 mb-2.5">
              Structured, reviewable record
            </div>
            <div className="flex flex-wrap gap-2">
              {NODES.map((node, i) => {
                const visible = step > i;
                return (
                  <div
                    key={node.id}
                    className="inline-flex items-center text-xs rounded border border-memo-divider bg-memo-bg px-2.5 py-1.5"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(4px)",
                      transition: "opacity 0.4s ease, transform 0.4s ease",
                    }}
                  >
                    <span className="font-semibold text-memo-neutral-700">{node.type}</span>
                    <span className="text-memo-text/60">&nbsp;&middot;&nbsp;{node.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section id="privacy" className="py-22 px-6">
        <div className="max-w-[760px] mx-auto text-center">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-5 text-memo-neutral-700"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <div className="text-xs tracking-widest uppercase text-memo-neutral-700 mb-3">
            Privacy &amp; data ownership
          </div>
          <h2 className="font-heading font-semibold text-[34px] mb-4">
            Your graph belongs to you.
          </h2>
          <p className="text-base leading-loose text-memo-text/70 max-w-xl mx-auto mb-9">
            MemoMind is a personal organization and reflection tool — not a medical or
            mental-health service, and Memo doesn&rsquo;t offer clinical advice. You can review,
            correct, export, or permanently delete any part of your graph at any time.
          </p>
          <div className="flex gap-8 justify-center flex-wrap text-left">
            {[
              "Every extraction is reviewable before it's kept",
              "Export your full graph whenever you want",
              "Delete any record, or your whole account, permanently",
            ].map((t) => (
              <div key={t} className="flex gap-2.5 items-start max-w-[220px]">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-none mt-0.5 text-memo-neutral-700"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="text-sm leading-snug">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        className="max-w-[1080px] w-full mx-auto px-6 py-22 box-border border-t border-memo-divider"
      >
        <div className="text-center mb-14">
          <div className="text-xs tracking-widest uppercase text-memo-neutral-700 mb-3">
            How it works
          </div>
          <h2 className="font-heading font-semibold text-4xl">
            Not a transcript. A model of your life.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "Step 1",
              title: "You talk to Memo",
              body: "Reflect on your day, think out loud about a goal, or just check in. The chat is only the front door.",
              icon: (
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              ),
            },
            {
              step: "Step 2",
              title: "Memo organizes what matters",
              body: "People, projects, goals, feelings, causes and effects are pulled apart and understood — not left as one long transcript.",
              icon: (
                <>
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </>
              ),
            },
            {
              step: "Step 3",
              title: "Your map grows",
              body: "Every conversation adds to one evolving picture of your life — reviewable, editable, always yours.",
              icon: (
                <>
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </>
              ),
            },
          ].map((card) => (
            <div
              key={card.step}
              className="rounded border border-memo-divider bg-memo-surface p-7"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-4 text-memo-neutral-700"
              >
                {card.icon}
              </svg>
              <div className="text-[10px] tracking-widest uppercase text-memo-neutral-700 mb-1.5">
                {card.step}
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{card.title}</h3>
              <p className="text-sm leading-relaxed text-memo-text/70 m-0">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section
        id="capabilities"
        className="border-t border-b border-memo-divider bg-memo-surface py-22 px-6"
      >
        <div className="max-w-[1080px] mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs tracking-widest uppercase text-memo-neutral-700 mb-3">
              Core capabilities
            </div>
            <h2 className="font-heading font-semibold text-4xl">The graph is the product.</h2>
            <p className="max-w-xl mx-auto mt-3.5 text-base text-memo-text/70">
              The chat is where you speak. This is what Memo actually builds underneath it —
              powered by a personal knowledge graph.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-memo-divider border border-memo-divider">
            {[
              {
                kicker: "Structured extraction",
                title: "No more re-reading transcripts",
                body: "Every conversation is converted into typed entities — people, projects, goals, emotions, causes, activities, effects — instead of being stored as raw text.",
              },
              {
                kicker: "Relationship mapping",
                title: "Connections, not a list",
                body: "Memo links what it finds — a project to a goal, a cause to an emotion, an activity to its effect — so patterns in your life become visible over time.",
              },
              {
                kicker: "Reviewable records",
                title: "You stay in control",
                body: "Every extracted record is visible and editable. Correct a detail, merge two people, or remove something entirely — the graph reflects what you confirm.",
              },
              {
                kicker: "A living model",
                title: "Grows with you",
                body: "Each new conversation refines the model — strengthening some connections, closing out old goals, surfacing new ones.",
              },
            ].map((c) => (
              <div key={c.kicker} className="bg-memo-bg p-8">
                <div className="text-[10px] tracking-widest uppercase text-memo-neutral-700 mb-2">
                  {c.kicker}
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2.5">{c.title}</h3>
                <p className="text-sm leading-relaxed text-memo-text/70 m-0">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIX MONTHS LATER */}
      <section id="later" className="py-24 px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="text-xs tracking-widest uppercase text-memo-neutral-700 mb-3">
            Six months later
          </div>
          <h2 className="font-heading font-semibold text-4xl mb-4">
            One reflection becomes a life.
          </h2>
          <p className="max-w-[520px] mx-auto mb-12 text-base text-memo-text/70">
            Keep talking to Memo, and the map you saw above stops being one conversation — it
            becomes the whole picture.
          </p>

          <div className="flex items-center justify-center gap-5 mb-12 flex-wrap">
            <div className="flex gap-1.5 opacity-55">
              {["Dan", "Memologic", "Stress"].map((t) => (
                <span
                  key={t}
                  className="text-[11px] border border-memo-divider rounded-full px-3 py-1.5"
                >
                  {t}
                </span>
              ))}
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-none text-memo-neutral-700"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            <div className="flex gap-2 flex-wrap justify-center max-w-[480px]">
              {["Projects", "Habits", "Friends", "Family", "Goals", "Books", "Travel", "Health"].map(
                (t) => (
                  <span
                    key={t}
                    className="text-[13px] font-heading font-semibold rounded-full border border-memo-connection-300 bg-memo-connection-100 text-memo-connection-700 px-4 py-1.5"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="max-w-[600px] mx-auto flex gap-3 items-start text-left rounded border border-memo-connection-300 bg-memo-connection-100 p-5">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-none mt-0.5 text-memo-connection-600"
            >
              <path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" />
              <line x1="10" y1="21" x2="14" y2="21" />
            </svg>
            <div>
              <div className="text-[10px] tracking-widest uppercase text-memo-connection-600 mb-1">
                Memo notices
              </div>
              <p className="text-[15px] leading-relaxed m-0">
                You consistently feel your best after taking weekends completely away from work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        id="waitlist"
        className="py-24 px-6 bg-memo-neutral-900 text-memo-neutral-100"
      >
        <div className="max-w-[520px] mx-auto text-center">
          <h2 className="font-heading font-normal text-[38px] text-memo-neutral-100 mb-3.5">
            Start building your map.
          </h2>
          <p className="text-base leading-relaxed text-memo-neutral-100/70 mb-8">
            Join the waitlist. We&rsquo;ll let you know the moment Memo is ready for you.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex gap-2.5 max-w-[420px] mx-auto">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 min-h-[44px] px-3.5 rounded border border-memo-neutral-100/30 bg-transparent text-memo-neutral-100 text-sm focus:outline-none focus:border-memo-connection-400"
              />
              <button
                type="submit"
                className="flex-none rounded font-heading font-semibold text-sm text-memo-neutral-900 bg-memo-connection-300 px-5 hover:bg-memo-connection-400 transition-colors"
              >
                Join
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 text-[15px] text-memo-connection-300">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              You&rsquo;re on the list — we&rsquo;ll be in touch.
            </div>
          )}
          <p className="text-xs text-memo-neutral-100/45 mt-4.5">
            No spam. Just one email when Memo is ready.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-12 py-7 flex justify-between items-center border-t border-memo-divider text-xs text-memo-text/55">
        <span className="font-heading font-semibold text-memo-text">MemoMind</span>
        <span>&copy; 2026 MemoMind. Not a medical or mental-health service.</span>
      </footer>
    </div>
  );
}
