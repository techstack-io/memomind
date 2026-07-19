"use client";

import Image from "next/image";
import { useState } from "react";
import MemoMindTourCarousel from "./MemoMindTourCarousel";
import { MemoLogo } from "@/components/icons/MemoLogo";

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

const ENTRY_POINTS = [
  {
    title: "Morning gratitude",
    description: "Today's gateway. A short guided practice to open the day with intention.",
    href: "/practice/morning",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
    featured: true,
  },
  {
    title: "Talk to Memo",
    description: "Share what's on your mind, any time of day.",
    href: "/conversation",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
    featured: false,
  },
  {
    title: "Explore",
    description: "Practices and teachings from the Lojong tradition.",
    href: "/library",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M4 19.5V5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M19 17H6a2 2 0 00-2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    featured: false,
  },
];

const SIDEBAR_NAV = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <path d="M4 12l8-8 8 8M6 10v10h12V10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    active: true,
  },
  {
    label: "Library",
    href: "/library",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <path d="M4 19.5V5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M19 17H6a2 2 0 00-2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
    active: false,
  },
  {
    label: "Journey",
    href: "/journey",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <path d="M3 12h4l3-8 4 16 3-8h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    active: false,
  },
];

export default function MemoMindDashboard({
  userName = "Dan",
}: {
  userName?: string;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [tourComplete, setTourComplete] = useState(false);

  return (
    <div className="min-h-screen bg-memo-bg text-memo-text">
      <div className="flex">
        {tourComplete && (
          <aside className="hidden w-56 flex-none border-r border-memo-divider/80 bg-memo-surface/40 px-4 py-6 lg:block">
            <a href="/dashboard" className="mb-6 flex items-center justify-center">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-memo-divider bg-memo-bg">
                <MemoLogo className="h-8 w-8 text-memo-text" />
                <span className="absolute inset-0 rounded-full border border-memo-connection-800 animate-[memo-breathe_7s_ease-in-out_infinite]" />
              </div>
            </a>
            <nav className="flex flex-col gap-1">
              {SIDEBAR_NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    item.active
                      ? "bg-memo-connection-100 text-memo-connection-700 font-semibold"
                      : "text-memo-neutral-700 hover:bg-memo-surface hover:text-memo-text"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
        )}

        <div className="mx-auto w-full max-w-7xl flex-1">
          <main className="min-w-0">
            <section className="relative min-h-[900px] overflow-hidden px-6 pb-24 pt-14 lg:px-10 lg:pt-20">
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
                  {!tourComplete && (
                    <MemoMindTourCarousel
                      onComplete={() => setTourComplete(true)}
                      onSkip={() => setTourComplete(true)}
                    />
                  )}
                </div>

                {tourComplete && (
                  <section className="mx-auto max-w-5xl">
                    <p className="text-center text-xs uppercase tracking-[0.3em] text-memo-neutral-700/70">
                      Where would you like to begin?
                    </p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      {ENTRY_POINTS.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          className={`group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(42,36,31,0.07)] ${
                            item.featured
                              ? "border-memo-connection-300 bg-[#f9f2e6] hover:border-memo-connection-500"
                              : "border-memo-divider bg-memo-surface/70 hover:border-memo-connection-300 hover:bg-memo-surface"
                          }`}
                        >
                          <div
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                              item.featured ? "bg-memo-connection-500 text-white" : "bg-memo-surface text-memo-neutral-700"
                            }`}
                          >
                            {item.icon}
                          </div>
                          {item.featured && (
                            <span className="ml-2 align-middle text-[11px] font-semibold uppercase tracking-wide text-memo-connection-600">
                              Recommended Path
                            </span>
                          )}
                          <h3 className="mt-4 font-heading text-xl">{item.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-memo-neutral-700">{item.description}</p>
                          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-memo-connection-600">
                            {item.featured ? "Begin" : "Open"}
                            <span className="transition-transform group-hover:translate-x-1"><ArrowIcon /></span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}