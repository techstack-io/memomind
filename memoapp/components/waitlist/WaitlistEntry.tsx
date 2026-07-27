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
        <div className="flex min-w-0 items-center gap-2">
          {/* Logo mark only — no nav links, this page is a dead end on purpose */}
          <Image
            src="/memomind-logo@72x.svg"
            alt="mettavia"
            width={40}
            height={40}
            priority
          />

          <span className="truncate font-heading text-lg font-bold text-memo-neutral-900 sm:text-xl">
            mettavia
          </span>

          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 inset-ring inset-ring-gray-500/10">
        Coming Soon
      </span>
        </div>

        {/* Hero */}
        <h1 className="mt-10 font-[Cormorant_Garamond] text-4xl leading-tight text-memo-900 sm:text-4xl">
          Are you ready to train your mind?
        </h1>
        <p className="mt-5 max-w-md font-[Lora] text-lg text-memo-connection-700">
        mettavia is a reflective AI companion inspired by Lojong, the Tibetan Buddhist practice of training the mind through compassion, awareness, and everyday experience.
        </p>
        <h2 className="mt-10 font-[Cormorant_Garamond] text-2xl leading-tight text-memo-900 sm:text-2xl">Join the waitlist and begin training your mind.</h2>

        {/* Three-beat explainer — quiet, text-led, not a step-flow.
            Order isn't the point here; the rhythm is. */}

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
