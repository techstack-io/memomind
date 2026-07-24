"use client";

import Image from "next/image";
import { useState } from "react";
import { useHexclaveApp, useUser } from "@hexclave/next";
import Link from "next/link";

export function AppNavbar() {
  const [profileOpen, setProfileOpen] = useState(false);

  const app = useHexclaveApp();
  const user = useUser();

  const userLabel =
    user?.displayName?.trim() ||
    user?.primaryEmail ||
    "Account";

  const initials = userLabel
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="w-full px-6 py-4 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="mr-auto flex items-center gap-2">
          <Image
            src="/memomind-logo@72x.svg"
            alt="MemoMind"
            width={56}
            height={56}
            className="h-14 w-14"
            priority
          />

        <div className="flex min-w-0 flex-shrink-0 items-center gap-2">
          <span className="font-heading text-xl font-bold text-memo-neutral-900">
            MemoMind
          </span>
          <span className="text-[10px] uppercase tracking-widest text-memo-neutral-400">
            Beta
          </span>
        </div>
        </Link>
          
        <nav className="hidden items-center gap-10 text-sm text-memo-neutral-700/70 md:flex">
          <a
            href="/dashboard"
            className="transition-colors duration-200 hover:text-memo-connection-600"
          >
            Dashboard
          </a>

          <a
            href="/library"
            className="transition-colors duration-200 hover:text-memo-connection-600"
          >
            Library
          </a>

          <a
            href="/journey"
            className="transition-colors duration-200 hover:text-memo-connection-600"
          >
            Journey
          </a>
        </nav>

        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-memo-surface"
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full border border-memo-divider bg-memo-surface font-heading text-sm font-semibold">
                {initials}
              </span>

              <span className="hidden max-w-40 truncate text-sm font-medium text-memo-neutral-900 sm:block">
                {userLabel}
              </span>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 text-memo-neutral-700"
                aria-hidden="true"
              >
                <path
                  d="m7 10 5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 z-20 w-64 rounded-xl border border-memo-divider bg-memo-surface p-2 shadow-[0_20px_50px_rgba(42,36,31,0.12)]">
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-medium text-memo-neutral-900">
                    {user?.displayName?.trim() || "Signed in"}
                  </p>

                  {user.primaryEmail && (
                    <p className="mt-1 truncate text-xs text-memo-neutral-700">
                      {user.primaryEmail}
                    </p>
                  )}
                </div>

                <div className="my-2 border-t border-memo-divider" />

                <a
                  href="/settings"
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-memo-connection-100"
                >
                  Settings
                </a>

                <button
                  type="button"
                  onClick={() => app.redirectToSignOut()}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-memo-connection-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => app.redirectToSignIn()}
            className="rounded-xl border border-memo-divider px-4 py-2 text-sm font-medium transition-colors hover:bg-memo-surface"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}