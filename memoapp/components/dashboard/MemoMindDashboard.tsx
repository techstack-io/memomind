"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  BrickWall,
  Compass,
  Dumbbell,
  LayoutGrid,
  MessageCircle,
  Repeat,
} from "lucide-react";
import MemoMindTourCarousel from "@/components/dashboard/MemoMindTourCarousel";
import { MemoLogo } from "@/components/icons/MemoLogo";

const ENTRY_POINTS = [
  {
    title: "Foundation",
    description: "Training in the preliminaries means taking full ownership of your life. It’s about dropping the self-pity, looking at your reality with radical honesty, and making a firm commitment to train your mind—starting right where you are.",
    href: "/conversation",
    icon: BrickWall,
    featured: false,
  },
  {
    title: "Seize the Moment",
    description: "Mind training isn't about feeling calm or faking positivity. It’s about turning every moment, pleasant or painful, into raw material for growth.",
    href: "/conversation",
    icon: Dumbbell,
    featured: false,
  },
  {
    title: "Habit",
    description: "Your mind is already trained by habit. Every self-critical thought is just a well-worn groove. Mind training is the intentional process of carving new ones.",
    href: "/library",
    icon: Repeat,
    featured: false,
  },
] as const;

const SIDEBAR_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid, active: true },
  { label: "Library", href: "/library", icon: BookOpen, active: false },
  { label: "Journey", href: "/journey", icon: Compass, active: false },
] as const;

type MemoMindDashboardProps = {
  userName?: string;
};

export default function MemoMindDashboard({
  userName = "Dan",
}: MemoMindDashboardProps) {
  const [tourComplete, setTourComplete] = useState(false);

  return (
    <div className="min-h-screen bg-memo-bg text-memo-text">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] gap-8 px-4 py-6 sm:px-6 lg:px-8">
        {tourComplete && (
          <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col justify-between rounded-3xl border border-memo-divider bg-memo-surface p-5 md:flex">
            <div className="space-y-8">
              <nav
                className="flex flex-col gap-1"
                aria-label="Dashboard navigation"
              >
                {SIDEBAR_NAV.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      aria-current={item.active ? "page" : undefined}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                        item.active
                          ? "bg-memo-connection-100 font-semibold text-memo-connection-700"
                          : "text-memo-neutral-700 hover:bg-memo-neutral-100 hover:text-memo-text"
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="rounded-2xl border border-memo-divider bg-memo-bg/60 p-4">
              <p className="font-heading text-sm leading-snug text-memo-text">
                &ldquo;First, train in the preliminaries.&rdquo;
              </p>
              <p className="mt-2 text-xs text-memo-neutral-700">
                Lojong · Slogan 1
              </p>
            </div>
          </aside>
        )}

        <main>

          {!tourComplete ? (
            <MemoMindTourCarousel
              onComplete={() => setTourComplete(true)}
              onSkip={() => setTourComplete(true)}
            />
          ) : (
            <div className="space-y-12">
              <section className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.22em] text-memo-connection-600">
                  Good morning, {userName}
                </p>

                <h1 className="mt-4 font-heading text-4xl leading-[1.05] text-slate-700 sm:text-5xl md:text-4xl">
                  Where should we begin?
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-memo-neutral-700">
                  Grounding Before Growth
                </p>
              </section>

              <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {ENTRY_POINTS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={`group relative flex min-h-80 flex-col justify-between overflow-hidden rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(42,36,31,0.07)] ${
                        item.featured
                          ? "border-memo-connection-300 bg-memo-connection-100/60 hover:border-memo-connection-500"
                          : "border-memo-divider bg-memo-surface/70 hover:border-memo-connection-300 hover:bg-memo-surface"
                      }`}
                    >
                      {item.featured && (
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-memo-connection-500/10 via-transparent to-transparent" />
                      )}

                      <div className="relative flex items-start justify-between gap-4">
                        <div
                          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                            item.featured
                              ? "bg-memo-connection-500 text-white"
                              : "bg-memo-neutral-100 text-memo-text"
                          }`}
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.75} />
                        </div>

                        {item.featured && (
                          <span className="rounded-full border border-memo-connection-300 bg-memo-connection-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-memo-connection-700">
                            Recommended
                          </span>
                        )}
                      </div>

                      <div className="relative mt-14">
                        <h2 className="font-heading text-2xl leading-tight text-memo-text">
                          {item.title}
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-memo-neutral-700">
                          {item.description}
                        </p>

                        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-memo-connection-600">
                          {item.featured ? "Begin" : "Open"}
                          <ArrowUpRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            strokeWidth={2}
                          />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
