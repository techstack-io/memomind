import Image from "next/image";
import Link from "next/link";
import AppSidebar from "@/components/layout/AppSidebar";
import { ArrowRight } from "lucide-react";

type MemoMindDashboardProps = {
  userName?: string;
};

export default function MemoMindDashboard({
  userName = "Dan",
}: MemoMindDashboardProps) {
  return (
    <div className="min-h-screen bg-memo-bg text-memo-text">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <AppSidebar />

        <main className="min-w-0 flex-1 py-4 md:py-8">
          <div className="mx-auto max-w-6xl">
            <section className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
              {/* Main reflection column */}
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

              {/* Continue-reading column */}
              <Link
                href="/preliminaries/four-reminders"
                className="group overflow-hidden rounded-[28px] border border-memo-divider bg-memo-surface transition-all duration-300 hover:-translate-y-1 hover:border-memo-connection-300 hover:shadow-[0_18px_50px_rgba(42,36,31,0.08)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-memo-neutral-100">
                  <Image
                    src="/cards/foundations4.jpeg"
                    alt="The Four Reminders"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  />

                  <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_14px_rgba(42,36,31,0.10)]" />
                </div>

                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-memo-connection-600">
                    Continue Reading
                  </p>

                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-memo-neutral-500">
                    Foundations
                  </p>

                  <h2 className="mt-2 font-heading text-2xl leading-tight tracking-[-0.025em] text-slate-700">
                    The Four Reminders
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-memo-neutral-700">
                    Reflect on the rarity of human life and why remembering it
                    changes how we approach each ordinary day.
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-memo-divider pt-5">
                    <span className="text-sm text-memo-neutral-500">
                      4 min read
                    </span>

                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-memo-connection-600">
                      Continue

                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </section>
            <section className="mt-14 border-t border-memo-divider pt-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-memo-connection-600">
                  Explore Further
                </p>
            
                <h2 className="mt-3 font-heading text-3xl tracking-[-0.025em] text-slate-700">
                  Continue your practice.
                </h2>
            
                <p className="mt-3 max-w-2xl text-sm leading-6 text-memo-neutral-700">
                  Return to the foundations, explore a teaching, or review the themes
                  emerging across your reflections.
                </p>
              </div>
            
              <div className="mt-7 grid gap-5 md:grid-cols-3">
                <Link
                  href="/preliminaries/four-reminders"
                  className="group flex flex-col rounded-[24px] border border-memo-divider bg-memo-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-memo-connection-300 hover:shadow-[0_18px_45px_rgba(42,36,31,0.08)]"
                >
                  <div className="flex items-center gap-2 text-memo-connection-600">
                    <Mountain
                      className="h-4 w-4"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
            
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      Foundations
                    </span>
                  </div>
            
                  <h3 className="mt-5 font-heading text-2xl tracking-[-0.02em] text-slate-700">
                    Continue the Four Reminders
                  </h3>
            
                  <p className="mt-3 text-sm leading-6 text-memo-neutral-700">
                    Strengthen the grounding that supports deeper reflection and everyday
                    practice.
                  </p>
            
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-memo-connection-600">
                    Continue
            
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>
                </Link>
            
                <Link
                  href="/library"
                  className="group flex flex-col rounded-[24px] border border-memo-divider bg-memo-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-memo-connection-300 hover:shadow-[0_18px_45px_rgba(42,36,31,0.08)]"
                >
                  <div className="flex items-center gap-2 text-memo-connection-600">
                    <BookOpen
                      className="h-4 w-4"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
            
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      Library
                    </span>
                  </div>
            
                  <h3 className="mt-5 font-heading text-2xl tracking-[-0.02em] text-slate-700">
                    Explore a teaching
                  </h3>
            
                  <p className="mt-3 text-sm leading-6 text-memo-neutral-700">
                    Browse practices, teachings, and contemplations connected to ordinary
                    life.
                  </p>
            
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-memo-connection-600">
                    Browse Library
            
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>
                </Link>
            
                <Link
                  href="/journey"
                  className="group flex flex-col rounded-[24px] border border-memo-divider bg-memo-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-memo-connection-300 hover:shadow-[0_18px_45px_rgba(42,36,31,0.08)]"
                >
                  <div className="flex items-center gap-2 text-memo-connection-600">
                    <Compass
                      className="h-4 w-4"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
            
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      Journey
                    </span>
                  </div>
            
                  <h3 className="mt-5 font-heading text-2xl tracking-[-0.02em] text-slate-700">
                    Review what is emerging
                  </h3>
            
                  <p className="mt-3 text-sm leading-6 text-memo-neutral-700">
                    Revisit the themes, patterns, and shifts taking shape across your
                    reflections.
                  </p>
            
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-memo-connection-600">
                    View Journey
            
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
