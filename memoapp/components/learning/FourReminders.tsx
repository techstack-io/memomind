"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  LayoutGrid,
} from "lucide-react";

import Pill from "@/components/ui/pill";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const REMINDERS = [
  {
    id: "precious-human-life",
    title: "Precious Human Life",
    summary: "You have the rare opportunity to practice.",
    teaching:
      "Consider the extreme rarity of your existence: at the moment of conception, your life won a race against 250 million other potential outcomes. Had any other cell arrived a fraction of a second sooner, an entirely different consciousness would be here today, You are alive. You are capable of awareness, of learning, of loving, of choosing kindness, and of changing the direction of your life. This opportunity is extraordinarily rare. Take a moment to appreciate the remarkable circumstances that have brought you here, and consider how you want to use them.",
    questions: [
      "1. Three times today, pause for three breaths and mentally recite: 'Out of 250 million possibilities, I am here. Let me not waste this day.'",
      "2. Morning Intention: Before checking your phone or jumping out of bed, spend 60 seconds simply appreciating that your consciousness woke up in a functioning human body.",
    ],
    href: "/preliminaries/four-reminders/precious-human-life",
  },
  {
    id: "impermanence",
    title: "Impermanence",
    summary: "Everything changes. Time is always moving.",
    teaching:
      "Nothing stays fixed. Circumstances, relationships, emotions, and the body are always changing. Remembering this helps clarify what matters now.",
    questions: [
      "What am I treating as though it will last forever?",
      "What important action have I been postponing?",
    ],
    href: "/preliminaries/four-reminders/impermanence",
  },
  {
    id: "cause-and-effect",
    title: "Cause and Effect",
    summary: "Your actions matter. You shape your experience.",
    teaching:
      "What you repeatedly think, say, and do creates patterns. Small choices become habits, and habits influence how you experience your life.",
    questions: [
      "Which repeated action is shaping my life right now?",
      "What small action would move me in a healthier direction?",
    ],
    href: "/preliminaries/four-reminders/cause-and-effect",
  },
  {
    id: "samsara",
    title: "The Unsatisfactory Nature of Samsara",
    summary: "Temporary relief cannot provide lasting freedom.",
    teaching:
      "Pleasure, achievement, approval, and control may offer temporary relief, but none can permanently protect you from change or dissatisfaction.",
    questions: [
      "What am I expecting to make me permanently secure?",
      "What might change if I stopped running from discomfort?",
    ],
    href: "/preliminaries/four-reminders/samsara",
  },
] as const;

const SIDEBAR_NAV = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    label: "Library",
    href: "/library",
    icon: BookOpen,
  },
  {
    label: "Journey",
    href: "/journey",
    icon: Compass,
  },
] as const;

export default function FourReminders() {
  return (
    <div className="min-h-screen bg-memo-bg text-memo-text">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col justify-between rounded-3xl border border-memo-divider bg-memo-surface p-5 md:flex">
          <div>
            <Link
              href="/dashboard"
              className="mb-8 inline-flex items-center gap-2 px-3 text-sm font-semibold text-memo-connection-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <nav
              className="flex flex-col gap-1"
              aria-label="Main navigation"
            >
              {SIDEBAR_NAV.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-memo-neutral-700 transition-colors hover:bg-memo-neutral-100 hover:text-memo-text"
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

            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-memo-connection-600">
              Lojong · Slogan 1
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-3xl py-4 sm:py-8">
            <header>
              <Pill>Slogan 1</Pill>

              <h1 className="mt-4 font-heading text-4xl leading-tight text-slate-700 sm:text-5xl">
                Training in the Preliminaries
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-memo-neutral-700">
                Before transforming difficult experiences, establish a
                foundation for practice.
              </p>
              <Image
                src="/opening.jpeg"
                alt="Hand-drawn tree illustration"
                width={900}
                height={900}
                draggable={false}
                priority
                className="
                  memo-tree
                  h-auto
                  w-full
                  select-none
                  mix-blend-multiply
                  opacity-30
                  contrast-90
                  brightness-105
                "
              />
            </header>

            <section className="mt-10 border-t border-memo-divider pt-8">
              <h2 className="font-heading text-2xl text-memo-text">
                The Four Reminders
              </h2>

              <Accordion
                type="single"
                collapsible
                defaultValue="precious-human-life"
                className="mt-6 space-y-3"
                >
                {REMINDERS.map((reminder) => (
                    <AccordionItem
                    key={reminder.id}
                    value={reminder.id}
                    className="overflow-hidden rounded-2xl border border-memo-divider bg-memo-surface px-5 shadow-sm"
                    >
                    <AccordionTrigger className="py-5 hover:no-underline">
                        <div className="text-left">
                        <h3 className="font-heading text-xl text-memo-text">
                            {reminder.title}
                        </h3>

                        <p className="mt-1 text-sm font-normal leading-relaxed text-memo-neutral-700">
                            {reminder.summary}
                        </p>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="pb-5">
                        <div className="rounded-xl bg-memo-bg/70 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-memo-connection-600">
                            Teaching
                        </p>

                        <p className="mt-3 text-base leading-relaxed text-memo-neutral-700">
                            {reminder.teaching}
                        </p>

                        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-memo-connection-600">
                            Reflection
                        </p>

                        <div className="mt-3 space-y-2">
                            {reminder.questions.map((question) => (
                            <p
                                key={question}
                                className="text-base leading-relaxed text-memo-text"
                            >
                                {question}
                            </p>
                            ))}
                        </div>

                        <Link
                            href={reminder.href}
                            className="mt-6 inline-flex text-sm font-semibold text-memo-connection-700 hover:underline"
                        >
                            Continue →
                        </Link>
                        </div>
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
