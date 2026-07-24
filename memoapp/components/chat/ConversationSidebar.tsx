"use client";

import { Search, Plus } from "lucide-react";

const conversations = [
  {
    title: "On letting go of urgency",
    snippet:
      "I keep putting off a conversation I need to have with my brother.",
    date: "Today",
    active: true,
  },
  {
    title: "Morning restlessness",
    snippet:
      "Notes on the habit of reaching for my phone the moment I wake up.",
    date: "Yesterday",
    active: false,
  },
  {
    title: "Comparing myself to peers",
    snippet:
      "A recurring pattern of measuring my week against everyone else's.",
    date: "3 days ago",
    active: false,
  },
  {
    title: "Foundations: Slogan 3",
    snippet: "Examine the nature of unborn awareness.",
    date: "Last week",
    active: false,
  },
  {
    title: "Difficulty resting",
    snippet: "Why stillness feels unproductive lately.",
    date: "2 weeks ago",
    active: false,
  },
];

export function ConversationSidebar() {
  return (
    <aside className="hidden w-[260px] shrink-0 border-r border-memo-divider bg-memo-surface lg:flex lg:flex-col">
      <div className="border-b border-memo-divider p-5">
        <button className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-memo-connection-500 text-sm font-semibold text-memo-connection-700 transition-colors hover:bg-memo-connection-100 bg-black">
          <Plus className="h-4 w-4" />
          New reflection
        </button>

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-memo-neutral-500" />

          <input
            type="search"
            placeholder="Search conversations"
            className="w-full rounded-xl border border-memo-divider bg-transparent py-2 pl-9 pr-3 text-sm text-memo-text placeholder:text-memo-neutral-500 focus:border-memo-connection-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-memo-neutral-500">
          Recent
        </p>

        <div className="space-y-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.title}
              type="button"
              className={[
                "w-full rounded-xl p-3 text-left transition-colors",
                conversation.active
                  ? "border border-memo-divider bg-memo-neutral-100"
                  : "hover:bg-memo-neutral-100",
              ].join(" ")}
            >
              <p className="mb-1 text-memo-text">
                {conversation.title}
              </p>

              <p className="line-clamp-2 text-sm leading-5 text-memo-neutral-700">
                {conversation.snippet}
              </p>

              <p className="mt-2 text-xs text-memo-neutral-500">
                {conversation.date}
              </p>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}