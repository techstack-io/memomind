"use client";

import { useState } from "react";

/**
 * MemoMind age-gate modal — Next.js + Tailwind, same "Fern Breath" tokens
 * as the rest of the app.
 *
 * MemoMind is currently designed for adults aged 18 and older. The
 * application does not intentionally support or collect personal
 * reflective data from minors.
 *
 * This is a self-attestation step. It establishes the product's scope
 * boundary and sets user expectations — it is NOT reliable age
 * verification, and should never be described or relied upon as one.
 *
 * A youth-oriented version of MemoMind (different prompts, memory rules,
 * safety thresholds, parental-consent requirements, and crisis procedures)
 * is out of scope here and would need to be a distinct product mode, not a
 * toggle on this flow.
 *
 * Blocking by design: nothing behind this modal is interactive until the
 * user confirms. Render it above everything else — app shell, onboarding,
 * dashboard — before any of it is reachable.
 */

export default function AgeGateModal({
  onConfirm,
}: {
  onConfirm: (ageConfirmed: true) => void;
}) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-memo-text/40 backdrop-blur-sm px-6">
      <div className="w-full max-w-[400px] bg-memo-bg border border-memo-divider rounded-[14px] px-6 py-7 flex flex-col gap-5">
        <div>
          <h1 className="font-heading font-semibold text-[22px] leading-snug">
            Quick check.
          </h1>
          <p className="text-[15px] leading-relaxed text-memo-neutral-700 mt-2">
            MemoMind is built for adults. Please confirm you&rsquo;re 18 or
            older to continue.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setChecked((v) => !v)}
          className="flex items-center gap-3 text-left border border-memo-divider rounded-[10px] px-4 py-3.5 hover:bg-memo-connection-100 transition-colors"
        >
          <span
            className={`w-5 h-5 flex-none rounded-md border flex items-center justify-center transition-colors ${
              checked
                ? "bg-memo-connection-500 border-memo-connection-500"
                : "border-memo-divider"
            }`}
          >
            {checked && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>
          <span className="text-[15px]">I confirm I&rsquo;m 18 or older</span>
        </button>

        <button
          type="button"
          onClick={() => onConfirm(true)}
          disabled={!checked}
          className="w-full rounded-full border border-memo-connection-500 text-memo-connection-600 font-heading font-semibold text-[15px] py-3 hover:bg-memo-connection-100 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
