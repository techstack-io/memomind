"use client";

import { useState } from "react";

export function LandscapeTour() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Your Landscape",
      body: "Your Landscape is a visual reflection of your contemplative practice. As you spend time reflecting with Ana, it gradually evolves alongside you.",
    },
    {
      title: "It Changes Slowly",
      body: "New elements appear over time as you return to reflection, revisit meaningful themes, and engage with contemplative teachings. Nothing happens overnight—and that's intentional.",
    },
    {
      title: "Not a Score. Not a Game.",
      body: "Your Landscape isn't meant to reward or rank you. It's simply a quiet visual reminder of the time you've invested in understanding yourself.",
    },
  ];

  const lastStep = step === steps.length - 1;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-memo-divider bg-[#F8F3EB]/95 p-10 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
          Landscape Tour
        </p>

        <h2 className="mt-4 text-4xl font-light tracking-tight text-neutral-900">
          {steps[step].title}
        </h2>

        <p className="mt-6 text-lg leading-8 text-neutral-600">
          {steps[step].body}
        </p>

        <div className="mt-10 flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === step
                    ? "bg-neutral-900"
                    : "bg-neutral-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (!lastStep) {
                setStep(step + 1);
              }
            }}
            className="rounded-xl bg-neutral-900 px-5 py-3 text-white transition hover:bg-neutral-800"
          >
            {lastStep ? "Begin Exploring" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}