import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Feather,
  Sparkles,
} from "lucide-react";

import Image from "next/image";

const featuredTeachings = [
  {
    number: "01",
    title: "First, train in the preliminaries",
    description:
      "Begin by remembering what matters before the urgency of the day takes over.",
    theme: "Foundations",
  },
  {
    number: "12",
    title: "Drive all blames into one",
    description:
      "Move beyond blame and look closely at the habits of mind that keep suffering in place.",
    theme: "Responsibility",
  },
  {
    number: "21",
    title: "Always maintain only a joyful mind",
    description:
      "Practice meeting difficulty without allowing it to close your heart.",
    theme: "Resilience",
  },
];

const themes = [
  "Anxiety and uncertainty",
  "Relationships and conflict",
  "Self-judgment",
  "Change and loss",
  "Control and attachment",
  "Compassion",
  "Everyday stress",
  "Identity and awareness",
];

export function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#f4efe5] text-[#302f2a]">
      <header className="border-b border-[#302f2a]/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 lg:px-12">
          <Link
            href="/marketing"
            className="flex items-center gap-3"
            aria-label="Mettavia home"
          >
            <div className="flex items-center gap-2">
            <Image
                src="/memomind-logo@72x.svg"
                alt="mettavia"
                width={56}
                height={56}
                className="h-11 w-11 shrink-0 sm:h-14 sm:w-14"
                priority
            />

            <span className="font-heading text-xl font-bold text-memo-neutral-900 sm:text-3xl">
                mettavia
            </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a
              href="#about"
              className="transition-colors hover:text-[#8d5e48]"
            >
              About
            </a>
            <a
              href="#teachings"
              className="transition-colors hover:text-[#8d5e48]"
            >
              Teachings
            </a>
            <a
              href="#ana"
              className="transition-colors hover:text-[#8d5e48]"
            >
              Meet Ana
            </a>
          </nav>

          <a
            href="#early-access"
            className="rounded-full bg-[#302f2a] px-5 py-2.5 text-sm text-[#f7f1e8] transition hover:bg-[#4a473f]"
          >
            Join early access
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pt-16 lg:pt-24">
          <div className="pointer-events-none absolute -right-20 top-24 h-80 w-80 rounded-full bg-[#c9d5bf]/45 blur-3xl" />
          <div className="relative mx-auto grid item-start max-w-7xl items-center gap-14 px-6 pb-20 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:pb-28">
            <div className="max-w-3xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#302f2a]/15 bg-white/35 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#302f2a]/65">
                <Sparkles className="h-3.5 w-3.5" />
                Ancient wisdom for ordinary life
              </div>

              <h1 className="font-heading text-3xl leading-[1.1] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
                Train your mind.
                <span className="block italic text-[#8d5e48]">
                    Change how you meet life.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-[#302f2a]/70 sm:text-lg">
                Explore the 59 Lojong slogans through modern reflections,
                practical guidance, and questions rooted in the moments that
                shape everyday life.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#teachings"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#302f2a] px-7 py-3.5 text-sm font-medium text-[#f7f1e8] transition hover:-translate-y-0.5 hover:bg-[#4a473f]"
                >
                  Explore the teachings
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="#ana"
                  className="inline-flex items-center justify-center rounded-full border border-[#302f2a]/20 bg-white/30 px-7 py-3.5 text-sm font-medium transition hover:bg-white/55"
                >
                  Meet Ana
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-4 rotate-3 rounded-[2.5rem] border border-[#302f2a]/10 bg-[#d9c9b7]/35" />

              <article className="relative -rotate-1 rounded-[2.25rem] border border-[#302f2a]/10 bg-[#fbf7ef]/90 p-8 shadow-[0_30px_80px_rgba(56,48,37,0.13)] backdrop-blur sm:p-10">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#302f2a]/50">
                    A teaching for today
                  </span>
                  <BookOpen
                    className="h-5 w-5 text-[#8d5e48]"
                    strokeWidth={1.5}
                  />
                </div>

                <p className="mt-16 font-serif text-4xl leading-tight">
                  Be grateful
                  <span className="block italic text-[#8d5e48]">
                    to everyone.
                  </span>
                </p>

                <p className="mt-7 leading-7 text-[#302f2a]/68">
                  Every person and circumstance can reveal something about the
                  habits of mind we are learning to understand.
                </p>

                <div className="mt-12 border-t border-[#302f2a]/10 pt-6">
                  <p className="text-sm italic text-[#302f2a]/55">
                    Lojong slogan 13
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="border-y border-[#302f2a]/10 bg-[#e9e2d5]/55"
        >
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-12">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#8d5e48]">
                What is Lojong?
              </p>
              <h2 className="mt-5 font-heading text-4xl leading-tight sm:text-3xl">
                The Slogans
              </h2>
            </div>

            <div className="space-y-6 text-md leading-8 text-[#302f2a]/70">
              <p>
                Lojong means “mind training.” Its 59 slogans offer a practical
                way to work with uncertainty, conflict, attachment, compassion,
                and the ordinary pressures of being human.
              </p>

              <p>
                Mettavia does not present these teachings as distant philosophy.
                It brings them into the situations where they matter: at work,
                inside relationships, during difficult decisions, and in the
                quiet patterns we carry from one day into the next.
              </p>
            </div>
          </div>
        </section>

        <section
          id="teachings"
          className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12"
        >
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#8d5e48]">
                Featured teachings
              </p>
              <h2 className="mt-4 max-w-2xl font-heading text-4xl leading-tight sm:text-3xl">
                Small instructions for meeting life differently.
              </h2>
            </div>

            <p className="max-w-md leading-7 text-[#302f2a]/60">
              The full library will eventually include all 59 slogans, each
              interpreted through the realities of modern life.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {featuredTeachings.map((teaching) => (
              <article
                key={teaching.number}
                className="group flex min-h-[390px] flex-col rounded-[2rem] border border-[#302f2a]/10 bg-[#fbf7ef]/65 p-8 transition duration-300 hover:-translate-y-1 hover:bg-[#fbf7ef] hover:shadow-[0_22px_60px_rgba(56,48,37,0.09)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-4xl text-[#8d5e48]/70">
                    {teaching.number}
                  </span>
                  <span className="rounded-full border border-[#302f2a]/10 px-3 py-1 text-xs text-[#302f2a]/55">
                    {teaching.theme}
                  </span>
                </div>

                <h3 className="mt-16 font-heading text-xl leading-tight">
                  {teaching.title}
                </h3>

                <p className="mt-5 leading-7 text-[#302f2a]/65">
                  {teaching.description}
                </p>

                <div className="mt-auto pt-8">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#8d5e48]">
                    Read the reflection
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#30342f] text-[#f5efe5]">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.22em] text-[#c9d5bf]">
                Browse by experience
              </p>
              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                Begin with what is present for you.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f5efe5]/65">
                You do not need to know Buddhist language to begin. Enter
                through the part of life that is asking for your attention.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              {themes.map((theme) => (
                <span
                  key={theme}
                  className="rounded-full border border-[#f5efe5]/15 bg-white/[0.04] px-5 py-3 text-sm text-[#f5efe5]/80"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="ana"
          className="mx-auto grid max-w-7xl gap-14 px-6 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12"
        >
          <div className="lg:pt-10">
            <p className="text-xs uppercase tracking-[0.22em] text-[#8d5e48]">
              Meet Ana
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
              A reflective guide for the life you are actually living.
            </h2>
            <p className="mt-7 text-lg leading-8 text-[#302f2a]/68">
              Ana is being designed to help people recognize patterns,
              encounter contemplative teachings through direct experience, and
              carry those insights into everyday life.
            </p>
            <p className="mt-5 leading-7 text-[#302f2a]/58">
              She is not a therapist, guru, or productivity assistant. She is a
              thoughtful companion built around reflection before advice.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#302f2a]/10 bg-[#ebe3d7] p-5 sm:p-8">
            <div className="rounded-[1.5rem] bg-[#f9f5ed] p-6 shadow-sm sm:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-[#302f2a]/45">
                You
              </p>
              <p className="mt-3 leading-7 text-[#302f2a]/78">
                I feel like I have to plan for everything that could go wrong
                before I can finally relax.
              </p>
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-[#8d5e48]/15 bg-[#fffaf2] p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8d5e48] text-xs text-white">
                  A
                </span>
                <p className="text-xs uppercase tracking-[0.2em] text-[#302f2a]/45">
                  Ana
                </p>
              </div>

              <p className="mt-5 leading-8 text-[#302f2a]/75">
                It sounds exhausting to feel as though rest has to be earned
                through certainty. Notice how the mind keeps reaching for one
                more answer before it will let the body settle.
              </p>

              <p className="mt-4 leading-8 text-[#302f2a]/75">
                What is one thing that truly needs your attention today—and
                what can remain unresolved for this moment?
              </p>
            </div>
          </div>
        </section>

        <section
          id="early-access"
          className="border-t border-[#302f2a]/10 px-6 py-24 sm:px-8 lg:px-12"
        >
          <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-[#d9c9b7] px-7 py-16 text-center sm:px-12 lg:px-20">
            <p className="text-xs uppercase tracking-[0.22em] text-[#684d3e]">
              Mettavia is still growing
            </p>
            <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
              Join us as contemplative wisdom finds a new form.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#302f2a]/65">
              Be among the first to explore the full library and reflect with
              Ana as Mettavia develops.
            </p>

            <a
              href="mailto:team@mettavia.app?subject=Mettavia Early Access"
              className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-[#302f2a] px-7 py-3.5 text-sm font-medium text-[#f7f1e8] transition hover:-translate-y-0.5 hover:bg-[#4a473f]"
            >
              Join early access
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#302f2a]/10 px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-[#302f2a]/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Mettavia</p>

          <p>
            A modern path into contemplative practice.
          </p>
        </div>
      </footer>
    </div>
  );
}