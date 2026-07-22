import Image from "next/image";
import Link from "next/link";
import AppSidebar from "@/components/layout/AppSidebar";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Mountain,
} from "lucide-react";

type MemoMindDashboardProps = {
  userName?: string;
};

const SUPPORTING_PATHS = [
  {
    title: "Foundations",
    eyebrow: "Continue your practice",
    description:
      "Build the grounding needed for deeper reflection through the Four Reminders.",
    action: "Continue Foundations",
    href: "/preliminaries/four-reminders",
    icon: Mountain,
  },
  {
    title: "Library",
    eyebrow: "Deepen your understanding",
    description:
      "Explore teachings, practices, and contemplations connected to everyday life.",
    action: "Browse Library",
    href: "/library",
    icon: BookOpen,
  },
  {
    title: "Journey",
    eyebrow: "See what is unfolding",
    description:
      "Return to the themes, reflections, and patterns emerging across your practice.",
    action: "View Journey",
    href: "/journey",
    icon: Compass,
  },
] as const;

export default function MemoMindDashboard({
  userName = "Dan",
}: MemoMindDashboardProps) {
  return (
    <div className="min-h-screen bg-memo-bg text-memo-text">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <AppSidebar />

        <main className="min-w-0 flex-1 py-4 md:py-8">
          <div className="mx-auto max-w-6xl">
            <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-memo-connection-600">
                  Good morning, {userName}
                </p>

                <h1 className="mt-4 max-w-2xl font-heading text-4xl leading-[1.05] tracking-[-0.035em] text-slate-700 sm:text-5xl">
                  Bring whatever is present.
                </h1>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-memo-neutral-700">
                  Memo helps you examine ordinary moments through reflection,
                  contemplative wisdom, and practical next steps.
                </p>

                <div className="mt-8 rounded-[28px] border border-memo-divider bg-memo-surface p-5 shadow-[0_18px_50px_rgba(42,36,31,0.07)] sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-memo-connection-600">
                    A reflection with Memo
                  </p>

                  <div className="mt-5 space-y-4">
                    <div className="flex justify-end">
                      <div className="max-w-md rounded-2xl rounded-tr-sm bg-memo-neutral-900 px-4 py-3 text-sm leading-6 text-white">
                        My manager took credit for my work, and I cannot stop
                        replaying it.
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="max-w-lg rounded-2xl rounded-tl-sm border border-memo-divider bg-memo-bg px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-memo-connection-600">
                          Slogan 12 · Drive all blames into one
                        </p>

                        <p className="mt-2 text-sm leading-6 text-memo-neutral-700">
                          This is not about excusing what happened. It is about
                          noticing where your peace has become dependent on
                          someone else behaving differently.
                        </p>

                        <p className="mt-3 text-sm font-medium leading-6 text-memo-text">
                          What feels most threatened here: fairness,
                          recognition, or trust?
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/conversation"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-memo-neutral-900 px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg"
                    >
                      Talk with Memo

                      <ArrowRight
                        className="h-4 w-4"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </Link>

                    <Link
                      href="/preliminaries/four-reminders"
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-memo-divider bg-memo-bg px-6 text-sm font-semibold text-memo-text transition-all duration-300 hover:-translate-y-0.5 hover:border-memo-connection-300 hover:bg-memo-surface"
                    >
                      Begin Foundations
                    </Link>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[30px] border border-memo-divider bg-memo-surface">
                <Image
                  src="/chat/memo-bot.jpeg"
                  alt="Memo contemplative emblem"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 36vw"
                  className="object-cover"
                />

                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_18px_rgba(42,36,31,0.12)]" />
              </div>
            </section>

            <section className="mt-14 border-t border-memo-divider pt-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-memo-connection-600">
                    Continue your practice
                  </p>

                  <h2 className="mt-3 font-heading text-3xl tracking-[-0.025em] text-slate-700">
                    Choose the next useful step.
                  </h2>
                </div>
              </div>

              <div className="mt-7 grid gap-5 lg:grid-cols-3">
                {SUPPORTING_PATHS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group rounded-[24px] border border-memo-divider bg-memo-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-memo-connection-300 hover:shadow-[0_18px_45px_rgba(42,36,31,0.08)]"
                    >
                      <div className="flex items-center gap-2 text-memo-connection-600">
                        <Icon
                          className="h-4 w-4"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />

                        <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                          {item.eyebrow}
                        </span>
                      </div>

                      <h3 className="mt-5 font-heading text-2xl tracking-[-0.02em]">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-memo-neutral-700">
                        {item.description}
                      </p>

                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-memo-connection-600">
                        {item.action}

                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
