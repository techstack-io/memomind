"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useHexclaveApp, useUser } from "@hexclave/next";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Library",
    href: "/library",
  },
  {
    label: "Journey",
    href: "/journey",
  },
];

export function AppNavbar() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const app = useHexclaveApp();
  const user = useUser();

  if (pathname === "/waitlist") return null;

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

  function toggleMobileMenu() {
    setMobileMenuOpen((open) => !open);
    setProfileOpen(false);
  }

  function toggleProfileMenu() {
    setProfileOpen((open) => !open);
    setMobileMenuOpen(false);
  }

  function closeMenus() {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }

  return (
    <header className="relative z-50 w-full px-4 py-3 sm:px-8 sm:py-4 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="mr-auto flex min-w-0 items-center gap-2"
        >
          <Image
            src="/memomind-logo@72x.svg"
            alt="mettavia"
            width={56}
            height={56}
            className="h-11 w-11 shrink-0 sm:h-14 sm:w-14"
            priority
          />

          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-heading text-xl font-bold text-memo-neutral-900 sm:text-3xl">
              mettavia
            </span>

            <span className="hidden text-[10px] uppercase tracking-widest text-memo-neutral-400 xs:inline">
              Beta
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 text-sm text-memo-neutral-700/70 md:flex lg:gap-10"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors duration-200 hover:text-memo-connection-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop profile or sign-in */}
        <div className="hidden md:block">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={toggleProfileMenu}
                className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-memo-surface"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                aria-label="Open profile menu"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full border border-memo-divider bg-memo-surface font-heading text-sm font-semibold">
                  {initials}
                </span>

                <span className="hidden max-w-40 truncate text-sm font-medium text-memo-neutral-900 lg:block">
                  {userLabel}
                </span>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`h-4 w-4 text-memo-neutral-700 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
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
                <div
                  role="menu"
                  className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-memo-divider bg-memo-surface p-2 shadow-[0_20px_50px_rgba(42,36,31,0.12)]"
                >
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

                  <Link
                    href="/settings"
                    onClick={closeMenus}
                    className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-memo-connection-100"
                    role="menuitem"
                  >
                    Settings
                  </Link>

                  <button
                    type="button"
                    onClick={() => app.redirectToSignOut()}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-memo-connection-100"
                    role="menuitem"
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

        {/* Mobile account button */}
        {user && (
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleProfileMenu}
              className="grid h-10 w-10 place-items-center rounded-full border border-memo-divider bg-memo-surface font-heading text-sm font-semibold"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              aria-label="Open profile menu"
            >
              {initials}
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute right-4 top-[72px] z-50 w-[calc(100vw-2rem)] max-w-72 rounded-xl border border-memo-divider bg-memo-surface p-2 shadow-[0_20px_50px_rgba(42,36,31,0.12)]"
              >
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

                <Link
                  href="/settings"
                  onClick={closeMenus}
                  className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-memo-connection-100"
                  role="menuitem"
                >
                  Settings
                </Link>

                <button
                  type="button"
                  onClick={() => app.redirectToSignOut()}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-memo-connection-100"
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-memo-divider text-memo-neutral-900 transition-colors hover:bg-memo-surface md:hidden"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={
            mobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
        >
          {mobileMenuOpen ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="mx-auto mt-3 max-w-7xl md:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="rounded-2xl border border-memo-divider bg-memo-surface p-2 shadow-[0_20px_50px_rgba(42,36,31,0.1)]"
          >
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenus}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-memo-neutral-900 transition-colors hover:bg-memo-connection-100"
              >
                {item.label}
              </Link>
            ))}

            <div className="my-2 border-t border-memo-divider" />

            {user ? (
              <Link
                href="/settings"
                onClick={closeMenus}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-memo-neutral-900 transition-colors hover:bg-memo-connection-100"
              >
                Settings
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeMenus();
                  app.redirectToSignIn();
                }}
                className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-memo-neutral-900 transition-colors hover:bg-memo-connection-100"
              >
                Sign in
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}