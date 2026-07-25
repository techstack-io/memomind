"use client";

import { useState } from "react";
import Script from "next/script";
import Image from "next/image";

function LaunchListEmbed() {
  return (
    <>
      {/* Loads LaunchList's widget script once per page. `afterInteractive`
          is fine here since the widget just needs to find the div below
          and doesn't affect first paint. */}
      <Script
        src="https://getlaunchlist.com/js/widget.js"
        strategy="afterInteractive"
      />
      <div
        className="launchlist-widget w-full max-w-sm"
        data-key-id="AGopWP"
      />
    </>
  );
}

export default function WaitlistEntry() {
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  return (
    <main className="min-h-screen bg-memo-50 text-memo-900">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center">
        {/* Logo mark only — no nav links, this page is a dead end on purpose */}
        <Image
          src="/memomind-logo@72x.svg"
          alt="MemoMind"
          width={40}
          height={40}
          priority
        />

        {/* Hero */}
        <h1 className="mt-10 font-[Cormorant_Garamond] text-4xl leading-tight text-memo-900 sm:text-5xl">
          A quiet place to notice your day.
        </h1>
        <p className="mt-5 max-w-md font-[Lora] text-lg text-memo-connection-700">
          MemoMind is a small, reflective space — a few minutes in the
          morning, a few notes through the day, a few minutes in the
          evening. We're opening it to a small group first.
        </p>

        {/* Three-beat explainer — quiet, text-led, not a step-flow.
            Order isn't the point here; the rhythm is. */}
        <div className="mt-14 flex w-full max-w-md flex-col gap-6 text-left">
          <div>
            <p className="font-[Manrope] text-sm font-medium text-memo-700">
              Morning
            </p>
            <p className="mt-1 font-[Lora] text-memo-connection-700">
              A small moment of gratitude to start the day.
            </p>
          </div>
          <div>
            <p className="font-[Manrope] text-sm font-medium text-memo-700">
              Through the day
            </p>
            <p className="mt-1 font-[Lora] text-memo-connection-700">
              Jot things down as they happen — no pressure to make sense
              of them yet.
            </p>
          </div>
          <div>
            <p className="font-[Manrope] text-sm font-medium text-memo-700">
              Evening
            </p>
            <p className="mt-1 font-[Lora] text-memo-connection-700">
              A short reflection, looking back over what the day held.
            </p>
          </div>
        </div>

        {/* Signup */}
        <div className="mt-16 flex w-full flex-col items-center gap-4">
          <LaunchListEmbed />

          <label className="flex max-w-sm items-start gap-2 text-left font-[Manrope] text-xs text-memo-connection-600">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-memo-connection-300"
            />
            I confirm I'm 18 or older.
          </label>
        </div>

        {/* Footer — minimal, trust signal only */}
        <p className="mt-20 max-w-sm font-[Manrope] text-xs text-memo-connection-500">
          What you write stays yours — you can review, edit, or delete
          any of it at any time.
        </p>
      </div>
    </main>
  );
}