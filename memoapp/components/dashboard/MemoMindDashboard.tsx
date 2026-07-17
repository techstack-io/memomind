"use client";

import Image from "next/image";
import { useState } from "react";
import MemoMindTourCarousel from "./MemoMindTourCarousel";


const DAILY_INVITATIONS = [
  {
    eyebrow: "Slogan 41",
    title: "Begin at the beginning. End at the end.",
    body: [
      "This is a wonderful place to begin our journey.Slogan 41 invites us to start the day with a commitment to be mindful, openhearted, and compassionate. At the end of the day, we pause and reflect on how things went.I’d also like to add a small moment of gratitude to the practice. It can help the day begin on a positive note, and it can be especially meaningful to practice with your children.",
      "",
    ],
  },
];

function MemoMark() {
  return (
    <div className="relative grid h-20 w-20 place-items-center rounded-full border border-memo-divider bg-memo-surface/90 shadow-[0_18px_60px_rgba(42,36,31,0.08)]">
      <Image
        src="/memomind-logo@72x.svg"
        alt="Memo"
        width={52}
        height={52}
        priority
        className="select-none"
        draggable={false}
      />
      <span className="absolute inset-0 rounded-full border border-memo-connection-300/40 animate-[memo-breathe_7s_ease-in-out_infinite]" />
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MemoMindDashboard({
  userName = "Dan",
}: {
  userName?: string;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [tourComplete, setTourComplete] = useState(false);
  
  const invitation = DAILY_INVITATIONS[0];


  return (
    <main className="min-h-screen bg-memo-bg text-memo-text">
      <style jsx global>{`
        @keyframes memo-breathe {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.07); opacity: 0.7; }
        }

        @media (prefers-reduced-motion: reduce) {
          [class*="memo-breathe"] { animation: none !important; }
        }
      `}</style>

      <header className="border-b border-memo-divider/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <a href="/dashboard" className="font-heading text-xl font-semibold">
            MemoMind
          </a>

          <nav className="hidden items-center gap-8 text-sm text-memo-neutral-700 md:flex">
            <a href="/library" className="transition-colors hover:text-memo-connection-600">
              Library
            </a>
            <a href="/journey" className="transition-colors hover:text-memo-connection-600">
              Journey
            </a>
          </nav>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-memo-surface"
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full border border-memo-divider bg-memo-surface font-heading text-sm font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-memo-neutral-700" aria-hidden="true">
                <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-memo-divider bg-memo-surface p-2 shadow-[0_20px_50px_rgba(42,36,31,0.12)]">
                <a href="/settings" className="block rounded-lg px-3 py-2 text-sm hover:bg-memo-connection-100">
                  Settings
                </a>
                <button type="button" className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-memo-connection-100">
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 pb-24 pt-14 lg:px-10 lg:pt-20">
        <Image
          src="/tree.png"
          alt=""
          width={900}
          height={900}
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute left-1/2 top-0 w-[760px] -translate-x-1/2 select-none opacity-[0.055] mix-blend-multiply"
        />

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
              <MemoMark />
            
              <p className="mt-5 text-xs uppercase tracking-[0.3em] text-memo-neutral-700/70">
                Memo
              </p>
            
              {!tourComplete && (
                <MemoMindTourCarousel
                  onComplete={() => setTourComplete(true)}
                  onSkip={() => setTourComplete(true)}
                />
              )}
            </div>

          {tourComplete && (
          <section className="mx-auto mt-16 max-w-3xl border-y border-memo-divider py-12 text-center">
            <p className="text-lg uppercase tracking-[0.3em] text-memo-neutral-700/70">
              {invitation.eyebrow}
            </p>
        
            <h2 className="mt-5 font-heading text-2xl font-normal tracking-[-0.03em] sm:text-3xl">
              {invitation.title}
            </h2>
        
            <div className="mx-auto mt-6 max-w-2xl space-y-4 text-lg leading-8 text-memo-neutral-700">
              {invitation.body.map((paragraph, index) =>
                paragraph === "" ? (
                  <div key={index} className="h-3" />
                ) : (
                  <p key={index}>{paragraph}</p>
                ),
              )}
            </div>
        
            <button
              type="button"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-memo-neutral-900 px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg"
            >
              Let's Begin
              <ArrowIcon />
            </button>
          </section>
        )}

          <section className="mx-auto mt-12 max-w-3xl">
            <div className="rounded-3xl border border-memo-divider bg-memo-surface/75 p-7 sm:p-9">
              <p className="text-xs uppercase tracking-[0.28em] text-memo-neutral-700/70">Continue your reflection</p>
              <blockquote className="mt-5 max-w-2xl font-heading text-2xl leading-9 tracking-[-0.02em] text-memo-text">
                “I noticed I often treat uncertainty as proof that something bad is about to happen.”
              </blockquote>
              <a href="/conversation" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-memo-connection-600 transition-colors hover:text-memo-connection-700">
                Continue where we left off
                <ArrowIcon />
              </a>
            </div>
          </section>

          <section className="mx-auto mt-12 max-w-3xl">
            <p className="text-center text-xs uppercase tracking-[0.3em] text-memo-neutral-700/70">Explore</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { title: "Practices", description: "Short invitations for ordinary moments.", href: "/library/practices" },
                { title: "Teachings", description: "Explore the ideas behind the practice.", href: "/library/teachings" },
                { title: "Begin here", description: "A gentle introduction to Lojong and Memo.", href: "/library/begin" },
              ].map((item) => (
                <a key={item.title} href={item.href} className="group rounded-2xl border border-memo-divider bg-memo-surface/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-memo-connection-300 hover:bg-memo-surface hover:shadow-[0_18px_50px_rgba(42,36,31,0.07)]">
                  <h3 className="font-heading text-xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-memo-neutral-700">{item.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-memo-connection-600">
                    Explore
                    <span className="transition-transform group-hover:translate-x-1"><ArrowIcon /></span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
