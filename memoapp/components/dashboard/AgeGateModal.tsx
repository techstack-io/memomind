"use client";

import { useState } from "react";

type AgeGateModalProps = {
  onConfirm: () => void;
};

export default function AgeGateModal({
  onConfirm,
}: AgeGateModalProps) {
  const [checked, setChecked] = useState(false);

  const handleContinue = () => {
    if (!checked) return;
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-memo-text/40 px-6 backdrop-blur-sm">
      <div className="flex w-full max-w-[400px] flex-col gap-5 rounded-[14px] border border-memo-divider bg-memo-bg px-6 py-7">
        <div>
          <h1 className="font-heading text-[22px] font-semibold leading-snug">
            Quick check.
          </h1>

          <p className="mt-2 text-[15px] leading-relaxed text-memo-neutral-700">
            MemoMind is intended for people age 13 and older. If you are under
            18, please use MemoMind with the involvement of a parent or
            guardian.
          </p>
        </div>

        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          onClick={() => setChecked((current) => !current)}
          className="flex items-center gap-3 rounded-[10px] border border-memo-divider px-4 py-3.5 text-left transition-colors hover:bg-memo-connection-100"
        >
          <span
            className={`flex h-5 w-5 flex-none items-center justify-center rounded-md border transition-colors ${
              checked
                ? "border-memo-connection-500 bg-memo-connection-500"
                : "border-memo-divider"
            }`}
          >
            {checked && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>

          <span className="text-[15px]">
            I confirm I am 13 or older
          </span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!checked}
          className="w-full rounded-full border border-memo-connection-500 py-3 font-heading text-[15px] font-semibold text-memo-connection-600 transition-colors hover:bg-memo-connection-100 disabled:pointer-events-none disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}