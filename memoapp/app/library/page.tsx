"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Clock3,
  Compass,
  Feather,
  Search,
  Sparkles,
} from "lucide-react";

type LibraryCategory =
  | "All"
  | "Foundations"
  | "Lojong"
  | "Meditations"
  | "Teachings";

type LibraryItem = {
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

export default function LibraryPage() {
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

              <h1 className="text-4xl font-medium tracking-[-0.04em] text-[#292721] sm:text-5xl">
                Teachings for everyday life
              </h1>

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
            <Link
              href={`/library/${featuredItem.id}`}
              className="group grid overflow-hidden rounded-[2rem] border border-[#D8D1C5] bg-[#E9E6DC] transition hover:-translate-y-0.5 hover:border-[#BEB6AA] hover:shadow-[0_20px_60px_rgba(47,61,54,0.08)] lg:grid-cols-[1.15fr_0.85fr]"
            >
              <div className="flex min-h-[360px] flex-col justify-between p-7 sm:p-10 lg:p-12">
                <div>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C9C4B9] bg-white/40 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[#5F665E]">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    Featured path
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

                  <span className="ml-auto flex items-center gap-2 font-medium text-[#35443C]">
                    Begin
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </div>

              <div className="relative hidden min-h-[360px] overflow-hidden border-l border-[#D0CBC0] lg:block">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.85),transparent_28%),linear-gradient(145deg,#C9D0C3_0%,#E8DFD0_48%,#B9C2B7_100%)]" />

                <div className="absolute left-[16%] top-[18%] h-44 w-44 rounded-full border border-white/40 bg-white/20 backdrop-blur-sm" />
                <div className="absolute bottom-[14%] right-[14%] h-56 w-32 rotate-12 rounded-[50%] bg-[#68766C]/20 blur-sm" />

                <div className="absolute inset-x-10 bottom-10 rounded-3xl border border-white/40 bg-white/30 p-5 backdrop-blur-md">
                  <Feather
                    className="mb-4 h-5 w-5 text-[#4F5E55]"
                    aria-hidden="true"
                  />
                  <p className="max-w-xs text-sm leading-6 text-[#445048]">
                    A foundation for bringing awareness, appreciation, and
                    intention into ordinary life.
                  </p>
                </div>
              </div>
            </Link>
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

function LibraryCard({ item }: { item: LibraryItem }) {
  return (
    <article className="group relative flex min-h-[310px] flex-col rounded-[1.6rem] border border-[#DCD5C9] bg-[#FBF9F4] p-6 transition hover:-translate-y-0.5 hover:border-[#BDB5A8] hover:shadow-[0_18px_45px_rgba(48,43,35,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8E5DC] text-[#526158]">
          {item.category === "Meditations" ? (
            <Feather className="h-4.5 w-4.5" aria-hidden="true" />
          ) : item.category === "Lojong" ? (
            <Compass className="h-4.5 w-4.5" aria-hidden="true" />
          ) : (
            <BookOpen className="h-4.5 w-4.5" aria-hidden="true" />
          )}
        </div>

        <button
          type="button"
          aria-label={`Save ${item.title}`}
          className="rounded-full p-2 text-[#898277] transition hover:bg-[#EEEAE2] hover:text-[#35443C] focus:outline-none focus:ring-2 focus:ring-[#7E8E84]/30"
        >
          <Bookmark className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#837C71]">
          {item.eyebrow}
        </p>

        <h3 className="mt-3 text-xl font-medium tracking-[-0.02em] text-[#2E2B26]">
          {item.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6D675D]">
          {item.description}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-4 border-t border-[#E4DED4] pt-5 text-xs text-[#837C71]">
        <span>{item.type}</span>

        <span className="h-1 w-1 rounded-full bg-[#B1AA9E]" />

        <span>{item.duration}</span>

        <Link
          href={`/library/${item.id}`}
          aria-label={`Open ${item.title}`}
          className="ml-auto rounded-full p-2 text-[#45534B] transition hover:bg-[#EAE7DF]"
        >
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
