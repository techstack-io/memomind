"use client";

import { useState } from "react";

/**
 * MemoMind onboarding wizard — modal overlay.
 * Next.js + Tailwind, same "Fern Breath" tokens as MemoMindDashboard.tsx.
 *
 * Steps: welcome → boundaries → memory → content → crisis → begin.
 * (Age confirmation happens earlier, in AgeGateModal — not part of this
 * wizard.)
 *
 * This renders as a blocking overlay — same pattern as AgeGateModal — on
 * top of the real MemoMindDashboard, which the parent (MemoMindEntry)
 * renders underneath it. That's deliberate: the user sees the actual app
 * taking shape behind the wizard instead of a faked preview, and this
 * component doesn't need to duplicate any dashboard chrome to pull that
 * off. Finishing just calls onFinish() and the parent removes the overlay.
 */

type StepId = "welcome" | "boundaries" | "memory" | "content" | "crisis" | "begin";

const STEP_ORDER: StepId[] = ["welcome", "boundaries", "memory", "content", "crisis", "begin"];

function MemoMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="text-memo-connection-600"
    >
      <circle cx="8" cy="16" r="3" />
      <circle cx="16" cy="8" r="3" />
      <line x1="10.2" y1="13.8" x2="13.8" y2="10.2" />
    </svg>
  );
}

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {STEP_ORDER.map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === current
              ? "w-5 bg-memo-connection-500"
              : i < current
              ? "w-1.5 bg-memo-connection-300"
              : "w-1.5 bg-memo-divider"
          }`}
        />
      ))}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-full border border-memo-connection-500 text-memo-connection-600 font-heading font-semibold text-[17px] py-3.5 hover:bg-memo-connection-100 transition-colors disabled:opacity-40 disabled:pointer-events-none"
    >
      {children}
    </button>
  );
}

function TextButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm text-memo-neutral-700 hover:text-memo-text underline underline-offset-4 decoration-memo-divider transition-colors"
    >
      {children}
    </button>
  );
}

// Placeholder — wire this to your actual backend. Keeping it separate from
// onFinish() keeps the UI transition free to run regardless of network
// latency or failure; consent submission should be best-effort and
// retried independently, not gate the user entering the app.
function submitOnboardingConsent(payload: { ageConfirmed: boolean; memoryEnabled: boolean | null }) {
  // TODO: replace with a real API call, e.g.:
  //   await fetch("/api/onboarding/complete", {
  //     method: "POST",
  //     body: JSON.stringify(payload),
  //   });
  console.log("onboarding consent recorded:", payload);
}

export default function MemoMindOnboardingToDashboard({
  ageConfirmed,
  onFinish,
}: {
  // Passed down from the age-gate modal, which is the only place this is
  // ever set. By the time this component mounts, it's already true — see
  // AgeGateModal.tsx for the actual self-attestation policy notes.
  ageConfirmed: true;
  // Called once the user finishes the wizard. The parent removes this
  // overlay, revealing the real MemoMindDashboard already rendered
  // underneath.
  onFinish: (memoryEnabled: boolean | null) => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [memoryEnabled, setMemoryEnabled] = useState<boolean | null>(null);

  const step = STEP_ORDER[stepIndex];
  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEP_ORDER.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleFinish = () => {
    submitOnboardingConsent({ ageConfirmed, memoryEnabled });
    onFinish(memoryEnabled);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-memo-text/40 backdrop-blur-sm px-6 py-10">
      <div className="w-full max-w-[1020px] max-h-[92vh] bg-memo-bg border border-memo-divider rounded-[16px] px-12 py-10 flex flex-col gap-8 overflow-hidden">
        <div className="flex items-center justify-between flex-none">
          <MemoMark size={24} />
          <StepDots current={stepIndex} />
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col justify-center gap-5 pr-1">
          {step === "welcome" && (
            <>
              <h1 className="font-heading font-semibold text-[36px] leading-snug">
                Welcome to MemoMind.
              </h1>
              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                MemoMind is inspired by Lojong, an ancient Mahayana
                Buddhist practice often translated as &ldquo;mind
                training.&rdquo; Lojong uses 59 short slogans to help
                people respond to life&rsquo;s difficult moments with
                greater awareness and compassion.
              </p>
              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                Unlike sitting meditation, which may feel intimidating
                to beginners, Lojong offers simple phrases you can
                recall when you need them most. The slogans
                aren&rsquo;t meant to be studied only as ideas — they
                become useful through practice and repetition.
              </p>
              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                With MemoMind, you can gradually build a personal set
                of slogans to turn to when your thoughts begin to race
                or a situation feels overwhelming.
              </p>
              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                Lojong is not magic, and it won&rsquo;t make your
                problems disappear. Instead, it can help you pause,
                see a situation from a different angle, and choose how
                you want to respond.
              </p>
              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                Lojong itself is nearly 900 years old, and it draws on
                a Buddhist tradition that goes back much further
                still. Centuries of teachers, translators, and
                scholars have devoted their lives to this work, and
                we&rsquo;re not attempting to replace any of that — we
                leave it where it belongs, in its historical and
                scholarly context.
              </p>
              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                What MemoMind offers is simpler: a way to carry the
                spirit of these slogans into an ordinary day, in plain
                language, as a starting point rather than a substitute
                for the tradition itself.
              </p>
            </>
          )}

          {step === "boundaries" && (
          <>
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-memo-connection-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="size-6 text-memo-connection-600">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <h1 className="font-heading font-semibold text-[32px] leading-snug">
            What I&rsquo;m not.
          </h1>
          <p className="text-[19px] leading-relaxed text-memo-neutral-700">
            As much as I care about helping people, MemoMind is not a therapist and cannot replace professional care. For clinical guidance, professional advice, or support during a mental health crisis, please contact a licensed mental health professional or emergency service in your area.
          </p>
          </>
          )}
          {step === "memory" && (
            <>
              <h1 className="font-heading font-semibold text-[32px] leading-snug">
                About memory.
              </h1>
              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                I can remember things you tell me across conversations
                — recurring themes, what&rsquo;s resonated with you —
                so our conversations can build on each other. Nothing
                is stored without showing you first, and you can review
                or delete it anytime.
              </p>
              <div className="flex flex-col gap-2.5 mt-1">
                <button
                  type="button"
                  onClick={() => setMemoryEnabled(true)}
                  className={`text-left border rounded-[10px] px-4 py-3.5 transition-colors ${
                    memoryEnabled === true
                      ? "border-memo-connection-500 bg-memo-connection-100"
                      : "border-memo-divider hover:bg-memo-connection-100"
                  }`}
                >
                  <span className="text-[17px] font-medium">Enable memory</span>
                  <p className="text-[15px] text-memo-neutral-700 mt-0.5">
                    I&rsquo;ll remember what you choose to share, with your review.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setMemoryEnabled(false)}
                  className={`text-left border rounded-[10px] px-4 py-3.5 transition-colors ${
                    memoryEnabled === false
                      ? "border-memo-connection-500 bg-memo-connection-100"
                      : "border-memo-divider hover:bg-memo-connection-100"
                  }`}
                >
                  <span className="text-[17px] font-medium">Not now</span>
                  <p className="text-[15px] text-memo-neutral-700 mt-0.5">
                    Every conversation starts fresh. You can turn this on later.
                  </p>
                </button>
              </div>
            </>
          )}

          {step === "content" && (
            <>
              <h1 className="font-heading font-semibold text-[32px] leading-snug">
                A note on the reflections.
              </h1>
              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                The ideas I draw on come from Lojong, a Tibetan Buddhist
                mind-training tradition dating back centuries. My
                reflections are my own interpretation of that tradition
                — not a certified translation or religious instruction.
              </p>
            </>
          )}

          {step === "crisis" && (
            <>
              <h1 className="font-heading font-semibold text-[32px] leading-snug">
                If things feel urgent.
              </h1>
              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                I&rsquo;m not equipped to help in a crisis. If
                you&rsquo;re thinking about harming yourself or you&rsquo;re
                in immediate danger, please reach out to a crisis line
                or emergency services in your area instead of talking
                to me.
              </p>
              <div className="border border-memo-divider rounded-[10px] px-4 py-3.5">
                <p className="text-[16px] text-memo-neutral-700">
                  In the US, you can call or text{" "}
                  <span className="text-memo-text font-medium">988</span> to
                  reach the Suicide &amp; Crisis Lifeline, any time.
                </p>
              </div>
            </>
          )}

          {step === "begin" && (
            <>
              <h1 className="font-heading font-semibold text-[36px] leading-snug">
                That&rsquo;s everything.
              </h1>
              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                Here&rsquo;s Memo — take a look around whenever you&rsquo;re ready.
              </p>
            </>
          )}
        </div>

        <div className="flex-none flex flex-col gap-3">
          {step === "welcome" && <PrimaryButton onClick={goNext}>Continue</PrimaryButton>}

          {(step === "boundaries" || step === "content" || step === "crisis") && (
            <>
              <PrimaryButton onClick={goNext}>Continue</PrimaryButton>
              <TextButton onClick={goBack}>Back</TextButton>
            </>
          )}

          {step === "memory" && (
            <>
              <PrimaryButton onClick={goNext} disabled={memoryEnabled === null}>
                Continue
              </PrimaryButton>
              <TextButton onClick={goBack}>Back</TextButton>
            </>
          )}

          {step === "begin" && (
            <PrimaryButton onClick={handleFinish}>Start talking to Memo</PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}
