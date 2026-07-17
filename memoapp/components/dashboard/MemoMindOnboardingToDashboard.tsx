"use client";

import { useState } from "react";

type StepId =
  | "welcome"
  | "tradition"
  | "boundaries"
  | "memory"
  | "content"
  | "crisis"
  | "begin";

type MemoMindOnboardingProps = {
  ageConfirmed: true;
  onFinish: (memoryEnabled: boolean | null) => void;
};

const STEP_ORDER: StepId[] = [
  "welcome",
  "tradition",
  "boundaries",
  "memory",
  "content",
  "crisis",
  "begin",
];

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
      aria-hidden="true"
    >
      <circle cx="8" cy="16" r="3" />
      <circle cx="16" cy="8" r="3" />
      <line x1="10.2" y1="13.8" x2="13.8" y2="10.2" />
    </svg>
  );
}

function StepDots({ current }: { current: number }) {
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Step ${current + 1} of ${STEP_ORDER.length}`}
    >
      {STEP_ORDER.map((stepId, index) => (
        <span
          key={stepId}
          className={`h-1.5 rounded-full transition-all ${
            index === current
              ? "w-5 bg-memo-connection-500"
              : index < current
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
  disabled = false,
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
      className="w-full rounded-full border border-memo-connection-500 py-3.5 font-heading text-[17px] font-semibold text-memo-connection-600 transition-colors hover:bg-memo-connection-100 disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function TextButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm text-memo-neutral-700 underline decoration-memo-divider underline-offset-4 transition-colors hover:text-memo-text"
    >
      {children}
    </button>
  );
}

export default function MemoMindOnboardingToDashboard({
  ageConfirmed,
  onFinish,
}: MemoMindOnboardingProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [memoryEnabled, setMemoryEnabled] = useState<boolean | null>(null);

  const step = STEP_ORDER[stepIndex];

  const goNext = () => {
    setStepIndex((current) =>
      Math.min(current + 1, STEP_ORDER.length - 1),
    );
  };

  const goBack = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const handleFinish = () => {
    if (!ageConfirmed) {
      return;
    }

    onFinish(memoryEnabled);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-memo-text/40 px-6 py-10 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-[640px] flex-col gap-8 overflow-hidden rounded-[16px] border border-memo-divider bg-memo-bg px-10 py-10">
        <div className="flex flex-none items-center justify-between">
          <MemoMark size={24} />
          <StepDots current={stepIndex} />
        </div>

        <div className="flex flex-1 flex-col justify-start gap-5 overflow-y-auto pr-1">
          {step === "welcome" && (
            <>
              <h1 className="font-heading text-[36px] font-semibold leading-snug">
                Welcome to MemoMind.
              </h1>

              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                MemoMind is inspired by Lojong, an ancient Mahayana Buddhist
                practice often translated as &ldquo;mind training.&rdquo;
                Lojong uses 59 short slogans to help people respond to
                life&rsquo;s difficult moments with greater awareness and
                compassion.
              </p>

              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                Unlike sitting meditation, which may feel intimidating to
                beginners, Lojong offers simple phrases you can recall when
                you need them most. The slogans aren&rsquo;t meant to be
                studied only as ideas—they become useful through practice and
                repetition.
              </p>

              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                With MemoMind, you can gradually build a personal set of
                slogans to turn to when your thoughts begin to race or a
                situation feels overwhelming.
              </p>
            </>
          )}

          {step === "tradition" && (
            <>
              <h1 className="font-heading text-[32px] font-semibold leading-snug">
                Rooted in something older.
              </h1>

              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                Lojong is not magic, and it won&rsquo;t make your problems
                disappear. Instead, it can help you pause, see a situation
                from a different angle, and choose how you want to respond.
              </p>

              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                Lojong itself is nearly 900 years old, and it draws on a
                Buddhist tradition that goes back much further still.
                Centuries of teachers, translators, and scholars have devoted
                their lives to this work, and we&rsquo;re not attempting to
                replace any of that—we leave it where it belongs, in its
                historical and scholarly context.
              </p>

              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                What MemoMind offers is simpler: a way to carry the spirit of
                these slogans into an ordinary day, in plain language, as a
                starting point rather than a substitute for the tradition
                itself.
              </p>
            </>
          )}

          {step === "boundaries" && (
            <>
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-memo-connection-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="size-6 text-memo-connection-600"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </div>

              <h1 className="font-heading text-[32px] font-semibold leading-snug">
                What I&rsquo;m not.
              </h1>

              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                As much as I care about helping people, MemoMind is not a
                therapist and cannot replace professional care. For clinical
                guidance, professional advice, or support during a mental
                health crisis, please contact a licensed mental health
                professional or emergency service in your area.
              </p>
            </>
          )}

          {step === "memory" && (
            <>
              <h1 className="font-heading text-[32px] font-semibold leading-snug">
                About memory.
              </h1>

              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                I can remember things you tell me across conversations—
                recurring themes and what&rsquo;s resonated with you—so our
                conversations can build on each other. Nothing is stored
                without showing you first, and you can review or delete it
                anytime.
              </p>

              <div className="mt-1 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setMemoryEnabled(true)}
                  className={`rounded-[10px] border px-4 py-3.5 text-left transition-colors ${
                    memoryEnabled === true
                      ? "border-memo-connection-500 bg-memo-connection-100"
                      : "border-memo-divider hover:bg-memo-connection-100"
                  }`}
                >
                  <span className="text-[17px] font-medium">
                    Enable memory
                  </span>

                  <p className="mt-0.5 text-[15px] text-memo-neutral-700">
                    I&rsquo;ll remember what you choose to share, with your
                    review.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMemoryEnabled(false)}
                  className={`rounded-[10px] border px-4 py-3.5 text-left transition-colors ${
                    memoryEnabled === false
                      ? "border-memo-connection-500 bg-memo-connection-100"
                      : "border-memo-divider hover:bg-memo-connection-100"
                  }`}
                >
                  <span className="text-[17px] font-medium">Not now</span>

                  <p className="mt-0.5 text-[15px] text-memo-neutral-700">
                    Every conversation starts fresh. You can turn this on
                    later.
                  </p>
                </button>
              </div>
            </>
          )}

          {step === "content" && (
            <>
              <h1 className="font-heading text-[32px] font-semibold leading-snug">
                A note on the reflections.
              </h1>

              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                The ideas I draw on come from Lojong, a Tibetan Buddhist
                mind-training tradition dating back centuries. My reflections
                are my own interpretation of that tradition—not a certified
                translation or religious instruction.
              </p>
            </>
          )}

          {step === "crisis" && (
            <>
              <h1 className="font-heading text-[32px] font-semibold leading-snug">
                If things feel urgent.
              </h1>

              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                I&rsquo;m not equipped to help in a crisis. If you&rsquo;re
                thinking about harming yourself or you&rsquo;re in immediate
                danger, please reach out to a crisis line or emergency
                services in your area instead of talking to me.
              </p>

              <div className="rounded-[10px] border border-memo-divider px-4 py-3.5">
                <p className="text-[16px] text-memo-neutral-700">
                  In the US, you can call or text{" "}
                  <span className="font-medium text-memo-text">988</span> to
                  reach the Suicide &amp; Crisis Lifeline at any time.
                </p>
              </div>
            </>
          )}

          {step === "begin" && (
            <>
              <h1 className="font-heading text-[36px] font-semibold leading-snug">
                That&rsquo;s everything.
              </h1>

              <p className="text-[19px] leading-relaxed text-memo-neutral-700">
                Here&rsquo;s Memo—take a look around whenever you&rsquo;re
                ready.
              </p>
            </>
          )}
        </div>

        <div className="flex flex-none flex-col gap-3">
          {step === "welcome" && (
            <PrimaryButton onClick={goNext}>Continue</PrimaryButton>
          )}

          {(step === "tradition" ||
            step === "boundaries" ||
            step === "content" ||
            step === "crisis") && (
            <>
              <PrimaryButton onClick={goNext}>Continue</PrimaryButton>
              <TextButton onClick={goBack}>Back</TextButton>
            </>
          )}

          {step === "memory" && (
            <>
              <PrimaryButton
                onClick={goNext}
                disabled={memoryEnabled === null}
              >
                Continue
              </PrimaryButton>

              <TextButton onClick={goBack}>Back</TextButton>
            </>
          )}

          {step === "begin" && (
            <PrimaryButton onClick={handleFinish}>
              Start talking to Memo
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}