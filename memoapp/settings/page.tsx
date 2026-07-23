"use client";

import { FormEvent, useEffect, useState } from "react";
import { useHexclaveApp, useUser } from "@hexclave/next";

export default function SettingsPage() {
  const app = useHexclaveApp();
  const user = useUser();

  const [displayName, setDisplayName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("memomind:displayName");

    setDisplayName(
      savedName ||
        user?.displayName?.trim() ||
        ""
    );
  }, [user]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = displayName.trim();

    if (trimmedName) {
      localStorage.setItem("memomind:displayName", trimmedName);
    } else {
      localStorage.removeItem("memomind:displayName");
    }

    window.dispatchEvent(new Event("memomind:profile-updated"));

    setDisplayName(trimmedName);
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-memo-bg px-6 py-16 text-memo-text">
        <div className="mx-auto max-w-3xl rounded-2xl border border-memo-divider bg-memo-surface p-8">
          <h1 className="font-heading text-3xl">Settings</h1>

          <p className="mt-3 text-memo-neutral-700">
            Sign in to manage your MemoMind settings.
          </p>

          <button
            type="button"
            onClick={() => app.redirectToSignIn()}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-memo-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-black"
          >
            Sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-memo-bg px-6 py-12 text-memo-text sm:px-8 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-memo-neutral-700/70">
            Your account
          </p>

          <h1 className="mt-4 font-heading text-4xl tracking-[-0.03em]">
            Settings
          </h1>

          <p className="mt-3 max-w-xl leading-7 text-memo-neutral-700">
            Manage how Memo addresses you and review your account information.
          </p>
        </div>

        <section className="mt-10 rounded-2xl border border-memo-divider bg-memo-surface p-6 shadow-[0_20px_50px_rgba(42,36,31,0.06)] sm:p-8">
          <h2 className="font-heading text-2xl">Profile</h2>

          <form onSubmit={handleSubmit} className="mt-7">
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-memo-neutral-900"
            >
              Display name
            </label>

            <p className="mt-1 text-sm text-memo-neutral-700">
              This is the name Memo will use when speaking with you.
            </p>

            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(event) => {
                setDisplayName(event.target.value);
                setSaved(false);
              }}
              placeholder="What should Memo call you?"
              autoComplete="name"
              className="mt-4 min-h-12 w-full rounded-xl border border-memo-divider bg-memo-bg px-4 text-base outline-none transition focus:border-memo-connection-500 focus:ring-2 focus:ring-memo-connection-200"
            />

            <div className="mt-7">
              <label className="block text-sm font-medium text-memo-neutral-900">
                Email
              </label>

              <div className="mt-3 rounded-xl border border-memo-divider bg-memo-bg px-4 py-3">
                <p className="text-sm text-memo-neutral-900">
                  {user.primaryEmail ?? "No email available"}
                </p>
              </div>

              <p className="mt-2 text-xs text-memo-neutral-700">
                Your email is managed through your Hexclave account.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-memo-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-black"
              >
                Save changes
              </button>

              {saved && (
                <p className="text-sm text-memo-connection-600">
                  Changes saved
                </p>
              )}
            </div>
          </form>
        </section>

        <section className="mt-6 rounded-2xl border border-memo-divider bg-memo-surface p-6 sm:p-8">
          <h2 className="font-heading text-2xl">Account</h2>

          <p className="mt-3 text-sm leading-6 text-memo-neutral-700">
            Sign out of MemoMind on this device.
          </p>

          <button
            type="button"
            onClick={() => app.redirectToSignOut()}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-memo-divider px-6 text-sm font-semibold transition hover:bg-memo-bg"
          >
            Sign out
          </button>
        </section>
      </div>
    </main>
  );
}
