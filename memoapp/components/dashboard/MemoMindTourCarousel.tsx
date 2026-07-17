"use client";

import { useState } from "react";

type TourSlide = {
  eyebrow: string;
  title: string;
  body: string;
  actionLabel: string;
};

const TOUR_SLIDES: TourSlide[] = [
  {
    eyebrow: "Welcome",
    title: "I'm Memo.",
    body: "Together we'll explore the wisdom of Lojong through
      <br />
      simple conversations and daily practice.",
    actionLabel: "Continue",
  },
  {
    eyebrow: "Begin each day",
    title: "Start with intention.",
    body: "Begin the day with a Lojong teaching, a moment of gratitude, and a simple intention for how you want to meet the day.",
    actionLabel: "Continue",
  },
  {
    eyebrow: "Talk with me",
    title: "Share what is on your mind.",
    body: "Together, we'll explore ordinary challenges through mindfulness, compassion, and the wisdom of Lojong.",
    actionLabel: "Continue",
  },
  {
    eyebrow: "End with reflection",
    title: "Pause and look back.",
    body: "At the end of the day, reflect on what you noticed, how you responded, and what the day helped you understand.",
    actionLabel: "Let's Begin",
  },
];

function ArrowIcon({
  direction = "right",
}: {
  direction?: "left" | "right";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={[
        "h-4 w-4",
        direction === "left" ? "rotate-180" : "",
      ].join(" ")}
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type MemoMindTourCarouselProps = {
  onComplete?: () => void;
  onSkip?: () => void;
};

export default function MemoMindTourCarousel({
  onComplete,
  onSkip,
}: MemoMindTourCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = TOUR_SLIDES[currentSlide];
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === TOUR_SLIDES.length - 1;

  function handleContinue() {
    if (isLastSlide) {
      onComplete?.();
      return;
    }

    setCurrentSlide((slideIndex) => slideIndex + 1);
  }

  function handlePrevious() {
    if (isFirstSlide) return;

    setCurrentSlide((slideIndex) => slideIndex - 1);
  }

  function handleSkip() {
    onSkip?.();
  }

  return (
    <section
      className="mx-auto mt-10 w-full max-w-3xl border-y border-memo-divider py-12 text-center"
      aria-label="Introduction to MemoMind"
    >
      <div
        key={currentSlide}
        className="animate-[memo-tour-fade_400ms_ease-out]"
        aria-live="polite"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-memo-neutral-700/70">
          {slide.eyebrow}
        </p>

        <h2 className="mt-5 font-heading text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
          {slide.title}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-memo-neutral-700">
          {slide.body}
        </p>
      </div>

      <div
        className="mt-8 flex items-center justify-center gap-2"
        aria-label={`Slide ${currentSlide + 1} of ${TOUR_SLIDES.length}`}
      >
        {TOUR_SLIDES.map((tourSlide, index) => (
          <button
            key={tourSlide.eyebrow}
            type="button"
            onClick={() => setCurrentSlide(index)}
            className={[
              "h-2.5 rounded-full transition-all duration-300",
              index === currentSlide
                ? "w-7 bg-memo-connection-600"
                : "w-2.5 bg-memo-divider hover:bg-memo-connection-300",
            ].join(" ")}
            aria-label={`Go to slide ${index + 1}: ${tourSlide.eyebrow}`}
            aria-current={index === currentSlide ? "step" : undefined}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {!isFirstSlide && (
          <button
            type="button"
            onClick={handlePrevious}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-memo-divider bg-memo-surface px-6 text-sm font-semibold text-memo-text transition-all duration-300 hover:-translate-y-0.5 hover:border-memo-connection-300 hover:bg-memo-connection-100"
          >
            <ArrowIcon direction="left" />
            Previous
          </button>
        )}

        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-memo-neutral-900 px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg"
        >
          {slide.actionLabel}
          <ArrowIcon />
        </button>
      </div>

      {!isLastSlide && (
        <button
          type="button"
          onClick={handleSkip}
          className="mt-6 text-sm text-memo-neutral-700 underline-offset-4 transition-colors hover:text-memo-connection-600 hover:underline"
        >
          Skip introduction
        </button>
      )}

      <style jsx>{`
        @keyframes memo-tour-fade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [class*="memo-tour-fade"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
