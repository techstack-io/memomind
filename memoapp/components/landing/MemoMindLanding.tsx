import Image from "next/image";

export default function MemoMindLandingPage() {
  return (
    <main className="min-h-screen bg-memo-bg text-memo-text">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-12 pt-0 lg:px-10 lg:pb-20 lg:pt-0">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-0">
          
          {/* Left: Hero text */}
          <div className="relative z-10 text-left lg:-translate-y-12">
            <p className="text-xs uppercase tracking-[0.34em] text-memo-neutral-700/80 sm:text-sm">
              Inspired by Lojong mind training
            </p>

            <h1 className="mt-10 font-heading text-6xl font-normal leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[68px]">
              Meet{" "}
              <span className="italic text-memo-connection-600">
                Memo
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-xl leading-9 text-memo-neutral-700">
              Thoughtful conversations rooted in timeless wisdom.
            </p>

            <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
              <a
                href="#waitlist"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-memo-neutral-900 px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg"
              >
                Join the waitlist
              </a>

              <a
                href="#conversation"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-memo-neutral-300 bg-memo-surface/80 px-7 text-sm font-semibold text-memo-text transition-all duration-300 hover:-translate-y-0.5 hover:border-memo-connection-300 hover:bg-memo-surface hover:shadow-md"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Right: Editorial illustration */}
          <div className="relative flex items-center justify-center pt-0 lg:justify-start lg:pt-20">
            <div
              className="
                relative
                w-full
                max-w-[700px]
                lg:-translate-x-16
              "
            >
              <Image
                src="/tree.png"
                alt="Hand-drawn tree illustration"
                width={900}
                height={900}
                draggable={false}
                priority
                className="
                  memo-tree
                  h-auto
                  w-full
                  select-none
                  mix-blend-multiply
                  opacity-30
                  contrast-90
                  brightness-105
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* Conversation preview */}
      <section
        id="conversation"
        className="scroll-mt-24 px-6 pb-28 lg:px-10"
      >
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-memo-divider bg-memo-surface shadow-[0_28px_90px_rgba(42,36,31,0.08)]">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            
            {/* Left Content Column */}
            <div className="flex flex-col justify-between border-b border-memo-divider bg-[#fffdf9] p-8 sm:p-12 lg:border-b-0 lg:border-r lg:p-16">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-memo-neutral-700/80">
                  A moment with Memo
                </p>
                <h2 className="mt-7 max-w-md font-heading text-4xl leading-[1.08] tracking-[-0.035em] sm:text-3xl">
                  Begin with what is already here.
                </h2>
                <p className="mt-7 max-w-md text-lg leading-8 text-memo-neutral-700">
                  Memo listens for the feelings, patterns, and circumstances
                  beneath your words, then introduces a relevant Lojong teaching
                  as a place to reflect.
                </p>
              </div>

              <div className="mt-12 border-l-2 border-memo-connection-500 pl-5">
                <p className="italic leading-7 text-memo-neutral-700">
                  Reflection, not instruction.
                </p>
              </div>
            </div>

            {/* Right Interactive Mockup Column */}
            <div className="bg-memo-neutral-100 p-6 sm:p-10 lg:p-14">
              <div className="mx-auto max-w-2xl">
                
                {/* Mockup Header */}
                <div className="flex items-center justify-between border-b border-memo-divider pb-5">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-heading text-lg">Memo</p>
                      <p className="text-xs text-memo-neutral-700">
                        Reflective conversation
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full border border-memo-divider bg-memo-surface/80 px-3 py-1 text-xs text-memo-neutral-700">
                    Private
                  </span>
                </div>

                {/* Mockup Messages Chat Bubble Thread */}
                <div className="space-y-6 py-8">
                  <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-memo-surface p-5 shadow-[0_8px_26px_rgba(42,36,31,0.06)]">
                    <p className="leading-7 text-memo-text">
                      Everything feels uncertain right now. I keep thinking about
                      everything that could go wrong.
                    </p>
                  </div>

                  <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-memo-connection-100 p-6">
                    <p className="text-xs uppercase tracking-[0.22em] text-memo-connection-700">
                      Beginning where you are
                    </p>
                    <p className="mt-4 leading-7 text-memo-text">
                      When the future feels uncertain, the mind often tries to
                      protect us by imagining every possible outcome.
                    </p>
                    <p className="mt-4 leading-7 text-memo-text">
                      What changes when you set those imagined outcomes aside and
                      stay with what is actually happening now?
                    </p>
                  </div>

                  <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-memo-surface p-5 shadow-[0_8px_26px_rgba(42,36,31,0.06)]">
                    <p className="leading-7 text-memo-text">
                      I think I am treating uncertainty like proof that something
                      bad will happen.
                    </p>
                  </div>
                </div>

                {/* Mockup Input Box */}
                <div className="flex items-center gap-3 border-t border-memo-divider pt-5">
                  <div className="flex h-14 flex-1 items-center rounded-full border border-memo-divider bg-memo-surface/80 px-5 text-sm text-memo-neutral-500">
                    Continue reflecting...
                  </div>
                  <button
                    type="button"
                    aria-label="Send message"
                    className="grid h-14 w-14 place-items-center rounded-full bg-memo-connection-600 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-memo-connection-700 hover:shadow-lg"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
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
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
