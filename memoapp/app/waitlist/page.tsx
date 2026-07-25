"use client";

import { useEffect, useState } from "react";
import MemoLogo from "@/components/icons/MemoLogo";

/**
 * /join-waitlist
 *
 * Standalone, unlisted route. Deliberately has no shared <Navbar />
 * and no links back into the main app — this is a dead-end page for
 * people arriving via a direct link (Reddit, personal network, Discord),
 * not something discoverable from the main domain.
 *
 * Uses the existing Fern Breath token names (memo-*, memo-connection-*)
 * and typefaces (Cormorant Garamond / Lora / Manrope). Verify these
 * against the real tailwind @theme config before shipping — written
 * from memory of the design system, not from the live file.
 *
 * Swap the <LaunchListEmbed /> placeholder for the real embed
 * snippet/ID once you have it.
 */

function LaunchListEmbed() {
  // Replace this block with your actual LaunchList embed code/script.
  useEffect(() => {
    // e.g. dynamically inject the LaunchList script tag here if that's
    // how their embed works, or swap this whole component for their
    // provided <iframe> / <div data-launchlist-id="..."> snippet.
  }, []);

  return (
    <div
      data-launchlist-id="YOUR_LAUNCHLIST_ID"
      className="w-full max-w-sm rounded-2xl border border-memo-connection-100 bg-white/50 px-6 py-5 text-center text-sm text-memo-connection-700"
    >
      LaunchList embed goes here
    </div>
  );
}

export default function JoinWaitlistPage() {
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  return (
    <main className="min-h-screen bg-memo-50 text-memo-900">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center">
        {/* Mark, not nav — no links, just identity */}
        <MemoLogo className="h-10 w-10 text-memo-700" />

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
