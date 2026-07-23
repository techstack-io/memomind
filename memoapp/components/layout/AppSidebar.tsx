"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Compass,
  LayoutGrid,
  MessageCircle,
  Settings,
} from "lucide-react";

const SIDEBAR_NAV = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    label: "Reflect",
    href: "/conversation",
    icon: MessageCircle,
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

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-56 shrink-0 flex-col rounded-3xl border border-memo-divider bg-memo-surface p-4 md:flex">
      <Link
        href="/dashboard"
        className="mb-8 px-3 text-lg font-semibold tracking-tight text-memo-text"
      >
        memomind
      </Link>

      <nav
        className="flex flex-1 flex-col gap-1"
        aria-label="Application navigation"
      >
        {SIDEBAR_NAV.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-memo-connection-100 font-semibold text-memo-connection-700"
                  : "text-memo-neutral-700 hover:bg-memo-neutral-100 hover:text-memo-text"
              }`}
            >
              <Icon
                className="h-4 w-4 shrink-0"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/settings"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-memo-neutral-700 transition-colors hover:bg-memo-neutral-100 hover:text-memo-text"
      >
        <Settings
          className="h-4 w-4 shrink-0"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <span>Settings</span>
      </Link>
    </aside>
  );
}
