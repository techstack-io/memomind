"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Compass,
  Search,
  Sparkles,
} from "lucide-react";
import BlurText from "@/components/reactbits/BlurText";
import OptionWheel from "@/components/reactbits/OptionWheel";
import LibraryCard from "./LibraryCard";

export type LibraryCategory =
  | "All"
  | "Foundations"
  | "Lojong"
  | "Meditations"
  | "Teachings";

export type LibraryItem = {
  id: string;
  title: string;
  description: string;
  category: Exclude<LibraryCategory, "All">;
  type: string;
  duration: string;
  eyebrow: string;
  featured?: boolean;
};

const categories: LibraryCategory[] = [
  "All",
  "Foundations",
  "Lojong",
  "Meditations",
  "Teachings",
];

const libraryItems: LibraryItem[] = [
  {
    id: "four-reminders",
    title: "The Four Reminders",
    description:
      "Four reflections that help awaken appreciation, clarity, and a deeper sense of how you want to live.",
    category: "Foundations",
    type: "Guided reflection",
    duration: "8 min",
    eyebrow: "Begin here",
    featured: true,
  },
  {
    id: "precious-human-life",
    title: "Precious Human Life",
    description:
      "Reflect on the rarity and possibility of this life without turning the teaching into pressure or guilt.",
    category: "Foundations",
    type: "Reflection",
    duration: "6 min",
    eyebrow: "The first reminder",
  },
  {
    id: "everything-is-practice",
    title: "Everything Is Practice",
    description:
      "Explore how ordinary conversations, frustrations, joys, and relationships can become part of the path.",
    category: "Lojong",
    type: "Teaching",
    duration: "7 min",
    eyebrow: "Lojong",
  },
  {
    id: "begin-the-sequence",
    title: "Begin the Sequence with Yourself",
    description:
      "A compassionate introduction to meeting your own difficulty before trying to carry the pain of others.",
    category: "Lojong",
    type: "Practice",
    duration: "10 min",
    eyebrow: "Lojong slogan",
  },
  {
    id: "breathing-space",
    title: "A Breathing Space",
    description:
      "A short guided pause for moments when the mind feels crowded, reactive, or pulled in many directions.",
    category: "Meditations",
    type: "Meditation",
    duration: "5 min",
    eyebrow: "Guided practice",
  },
  {
    id: "working-with-difficulty",
    title: "Working with Difficulty",
    description:
      "Learn to stay present with discomfort while avoiding suppression, self-judgment, and spiritual bypassing.",
    category: "Teachings",
    type: "Teaching",
    duration: "9 min",
    eyebrow: "Everyday practice",
  },
  {
    id: "compassion-in-conflict",
    title: "Compassion in Conflict",
    description:
      "A practical reflection on remaining openhearted without abandoning discernment or healthy boundaries.",
    category: "Teachings",
    type: "Reflection",
    duration: "8 min",
    eyebrow: "Relationships",
  },
];

export default function LibraryView() {
  const [activeCategory, setActiveCategory] =
    useState<LibraryCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const featuredItem = libraryItems.find((item) => item.featured);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return libraryItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;

      const matchesSearch =
        normalizedQuery.length === 0 ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery) ||
        item.type.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch && !item.featured;
    });
  }, [activeCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#292721]">
      <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-8 sm:px-8 lg:px-12">
        <header className="border-b border-[#DCD6CA] pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#80796E]">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Mettavia Library
              </div>

              {/* BlurText Animation Applied Here */}
              <BlurText
                text="Teachings for everyday life"
                delay={120}
                animateBy="words"
                direction="top"
                className="mt-4 text-5xl font-light tracking-tight text-neutral-900"
              />

              <p className="mt-4 max-w-xl text-base leading-7 text-[#686258] sm:text-lg">
                Explore contemplative teachings, guided reflections, and
                practices designed to be lived—not merely understood.
              </p>
            </div>

            <Link
              href="/chat"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#2F3D36] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#25312B] focus:outline-none focus:ring-2 focus:ring-[#2F3D36] focus:ring-offset-2 focus:ring-offset-[#F7F4EE]"
            >
              Reflect with Ana
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </header>

        <section className="py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              aria-label="Library categories"
            >
              {categories.map((category) => {
                const isActive = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={[
                      "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition",
                      isActive
                        ? "border-[#2F3D36] bg-[#2F3D36] text-white"
                        : "border-[#D8D1C5] bg-[#FBF9F4] text-[#5E594F] hover:border-[#AFA79A] hover:text-[#292721]",
                    ].join(" ")}
                    aria-pressed={isActive}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <label className="relative block w-full lg:w-80">
              <span className="sr-only">Search the library</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B8479]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search the library"
                className="h-11 w-full rounded-full border border-[#D8D1C5] bg-[#FBF9F4] pl-11 pr-4 text-sm text-[#292721] outline-none transition placeholder:text-[#999286] focus:border-[#7E8E84] focus:ring-2 focus:ring-[#7E8E84]/20"
              />
            </label>
          </div>
        </section>

        {featuredItem && activeCategory === "All" && !searchQuery && (
          <section className="mb-12">
            <div className="group grid overflow-hidden rounded-[2rem] border border-[#D8D1C5] bg-[#E9E6DC] transition hover:border-[#BEB6AA] hover:shadow-[0_20px_60px_rgba(47,61,54,0.08)] lg:grid-cols-[1.15fr_0.85fr]">
              <div className="flex min-h-[360px] flex-col justify-between p-7 sm:p-10 lg:p-12">
                <div>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C9C4B9] bg-white/40 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[#5F665E]">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    Interactive feature
                  </div>

                  <p className="text-sm font-medium text-[#737066]">
                    {featuredItem.eyebrow}
                  </p>

                  <h2 className="mt-3 max-w-lg text-3xl font-medium tracking-[-0.035em] text-[#292721] sm:text-4xl">
                    {featuredItem.title}
                  </h2>

                  <p className="mt-5 max-w-xl text-base leading-7 text-[#625E55]">
                    {featuredItem.description}
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-5 text-sm text-[#6E695F]">
                  <span className="flex items-center gap-2">
                    <Compass className="h-4 w-4" aria-hidden="true" />
                    {featuredItem.type}
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" aria-hidden="true" />
                    {featuredItem.duration}
                  </span>

                  <Link
                    href={`/library/${featuredItem.id}`}
                    className="ml-auto inline-flex items-center gap-2 font-medium text-[#35443C] hover:underline"
                  >
                    Open Details
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>

              {/* OptionWheel Interactive Replacement */}
              <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden border-l border-[#D0CBC0] bg-[#292721] p-6 lg:block">
                <div className="absolute inset-0 h-full w-full">
                  <OptionWheel
                    items={[
                      "The Rare Opportunity",
                      "Impermanence of Life",
                      "The Weight of Action",
                      "The Nature of Suffering",
                      "Awakening Intention",
                    ]}
                    defaultSelected={0}
                    textColor="#8b8479"
                    activeColor="#F7F4EE"
                    side="left"
                    fontSize={2.5}
                    spacing={1.4}
                    curve={1}
                    tilt={6}
                    blur={2}
                    fade={0.25}
                    smoothing={200}
                    inset={60}
                    loop={true}
                    draggable
                    soundVolume={0.3}
                    onChange={(index: number, item: string) =>
                      console.log(index, item)
                    }
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#827B70]">
                Explore
              </p>
              <h2 className="mt-2 text-2xl font-medium tracking-[-0.025em]">
                {activeCategory === "All"
                  ? "All practices and teachings"
                  : activeCategory}
              </h2>
            </div>

            <p className="hidden text-sm text-[#827B70] sm:block">
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "item" : "items"}
            </p>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <LibraryCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-[#CCC5B9] bg-[#FBF9F4] px-6 py-16 text-center">
              <BookOpen
                className="mx-auto h-6 w-6 text-[#8A8378]"
                aria-hidden="true"
              />
              <h3 className="mt-4 text-lg font-medium">
                Nothing found in this section
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#756F65]">
                Try another category or use a broader search.
              </p>
            </div>
          )}
        </section>

        <section className="mt-16 rounded-[2rem] border border-[#D7D0C4] bg-[#FBF9F4] px-6 py-8 sm:px-9 sm:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#80796E]">
                Not sure where to begin?
              </p>
              <h2 className="mt-3 text-2xl font-medium tracking-[-0.025em]">
                Begin with what is present today.
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#6E685E] sm:text-base">
                Ana can help you find a practice that relates naturally to what
                you are experiencing rather than asking you to choose a teaching
                in isolation.
              </p>
            </div>

            <Link
              href="/chat"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#BEB7AA] px-5 py-3 text-sm font-medium text-[#35443C] transition hover:border-[#35443C] hover:bg-[#F1EEE7]"
            >
              Talk with Ana
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}