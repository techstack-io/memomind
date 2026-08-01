"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, BookOpen, Compass, Feather } from "lucide-react";
import type { LibraryItem } from "./LibraryView";

export default function LibraryCard({ item }: { item: LibraryItem }) {
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