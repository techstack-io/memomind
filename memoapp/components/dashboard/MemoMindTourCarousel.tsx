"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import DandelionAnimation from "@/components/DandelionAnimation";

const slides = [
  {
    eyebrow: "Slogan 1",
    title: "Training in the Preliminaries.",
    body: "To quiet the noise of daily life, you must first establish a stable foundation. Slogan 1 introduces the Four Reminders, profound realizations that shift your perspective on life.",
  },
  {
    eyebrow: "How it works",
    title: "Short practices. Real presence.",
    body: "Each morning begins with a gateway practice. Throughout the day, return to Memo to reflect, converse, or simply pause.",
  },
  {
    eyebrow: "Your rhythm",
    title: "No streaks. No pressure.",
    body: "You set the pace. Memo remembers where you've been and gently offers what might serve you next.",
  },
];

type MemoMindTourCarouselProps = {
  onComplete: () => void;
  onSkip: () => void;
};

export default function MemoMindTourCarousel({
  onComplete,
  onSkip,
}: MemoMindTourCarouselProps) {
  const [i, setI] = useState(0);
  const slide = slides[i];
  const isLast = i === slides.length - 1;

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="relative overflow-hidden rounded-3xl border border-memo-divider bg-memo-surface p-8 shadow-[0_24px_70px_rgba(42,36,31,0.12)] sm:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-memo-connection-500 opacity-[0.08] blur-3xl" />
  
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-memo-neutral-500 opacity-[0.08] blur-3xl" />
  
        <div className="relative flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.22em] text-memo-neutral-700">
              {slide.eyebrow}
            </span>
  
            <button
              type="button"
              onClick={onSkip}
              className="text-xs uppercase tracking-[0.18em] text-memo-neutral-700 transition-colors hover:text-memo-text"
            >
              Skip
            </button>
          </div>
  
          <div className="max-w-2xl space-y-5">
            <h2 className="font-heading text-3xl leading-[1.1] text-memo-text sm:text-4xl md:text-4xl">
              {slide.title}
            </h2>
  
            <p className="text-base leading-relaxed text-memo-neutral-700 sm:text-lg">
              {slide.body}
            </p>
          </div>
  
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setI(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={idx === i ? "step" : undefined}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === i
                      ? "w-8 bg-memo-text"
                      : "w-1.5 bg-memo-divider hover:bg-memo-neutral-500"
                  }`}
                />
              ))}
            </div>
  
            <button
              type="button"
              onClick={() => {
                if (isLast) {
                  onComplete();
                  return;
                }
  
                setI((current) => current + 1);
              }}
              className="group inline-flex items-center gap-2 rounded-full bg-memo-text px-5 py-2.5 text-sm font-medium text-memo-bg transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLast ? (
                <>
                  Enter
                  <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
  
      <div className="mx-auto flex w-full max-w-sm items-center justify-center opacity-40">
        <div className="aspect-square w-full">
          <DandelionAnimation />
        </div>
      </div>
    </div>
  );
}
