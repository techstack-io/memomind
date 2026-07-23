"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

type Reflection = {
  id: string;
  title: string;
  group: "Today" | "Yesterday" | "Last Week" | "Older";
};

const REFLECTIONS: Reflection[] = [
  {
    id: "letting-go-of-urgency",
    title: "Letting go of urgency",
    group: "Today",
  },
  {
    id: "morning-restlessness",
    title: "Morning restlessness",
    group: "Yesterday",
  },
  {
    id: "comparing-myself",
    title: "Comparing myself to others",
    group: "Last Week",
  },
  {
    id: "foundations-slogan-three",
    title: "Foundations: Slogan 3",
    group: "Last Week",
  },
  {
    id: "difficulty-resting",
    title: "Difficulty allowing myself to rest",
    group: "Older",
  },
];

const GROUPS = ["Today", "Yesterday", "Last Week", "Older"] as const;

export function ReflectionSidebar() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const filteredReflections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return REFLECTIONS;
    }

    return REFLECTIONS.filter((reflection) =>
      reflection.title.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <aside className="flex min-h-0 w-full shrink-0 flex-col border-b border-memo-divider bg-memo-surface lg:w-72 lg:border-b-0 lg:border-r">
      <div className="p-4">
        <Link
          href="/conversation"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-memo-connection-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-memo-connection-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Reflection
        </Link>

        <label className="mt-4 flex items-center gap-2 rounded-xl border border-memo-divider bg-memo-background px-3 py-2.5">
          <Search
            className="h-4 w-4 shrink-0 text-memo-neutral-500"
            aria-hidden="true"
          />

          <span className="sr-only">Search reflections</span>

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search reflections"
            className="min-w-0 flex-1 bg-transparent text-sm text-memo-text outline-none placeholder:text-memo-neutral-500"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-5">
        {GROUPS.map((group) => {
          const reflections = filteredReflections.filter(
            (reflection) => reflection.group === group,
          );

          if (reflections.length === 0) {
            return null;
          }

          return (
            <section key={group} className="mt-5 first:mt-1">
              <h2 className="px-3 text-xs font-medium uppercase tracking-[0.12em] text-memo-neutral-500">
                {group}
              </h2>

              <div className="mt-1 space-y-0.5">
                {reflections.map((reflection) => {
                  const href = `/conversation/${reflection.id}`;
                  const isActive = pathname === href;

                  return (
                    <Link
                      key={reflection.id}
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={`block truncate rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-memo-connection-100 font-medium text-memo-connection-800"
                          : "text-memo-neutral-700 hover:bg-memo-neutral-100 hover:text-memo-text"
                      }`}
                    >
                      {reflection.title}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {filteredReflections.length === 0 && (
          <p className="px-3 py-8 text-sm text-memo-neutral-500">
            No reflections found.
          </p>
        )}
      </div>
    </aside>
  );
}
