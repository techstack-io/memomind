"use client";

import { useState } from "react";

type GardenState = "tended" | "resting";

export default function MemoMindGardenPreview() {
  const [gardenState, setGardenState] = useState<GardenState>("tended");
  const [showMemory, setShowMemory] = useState(false);

  const isTended = gardenState === "tended";

  return (
    <main className="min-h-screen bg-[#f3efe6] px-5 py-8 text-[#26312c]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.28em] text-[#798278]">
              MemoMind
            </p>

            <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
              Your practice
            </h1>
          </div>

          <div className="flex rounded-full border border-[#d5d0c4] bg-white/50 p-1 text-sm shadow-sm backdrop-blur">
            <button
              type="button"
              onClick={() => setGardenState("tended")}
              className={`rounded-full px-4 py-2 transition ${
                isTended
                  ? "bg-[#394b40] text-white"
                  : "text-[#667069] hover:bg-white/70"
              }`}
            >
              Tended
            </button>

            <button
              type="button"
              onClick={() => setGardenState("resting")}
              className={`rounded-full px-4 py-2 transition ${
                !isTended
                  ? "bg-[#746f63] text-white"
                  : "text-[#667069] hover:bg-white/70"
              }`}
            >
              Time away
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
          <section className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-[#d4cec0] bg-[#e9e5da] shadow-[0_24px_70px_rgba(71,64,50,0.12)]">
            <GardenIllustration
              isTended={isTended}
              onLeafClick={() => setShowMemory(true)}
            />

            <div className="absolute left-6 top-6 rounded-full border border-white/60 bg-[#f8f5ee]/75 px-4 py-2 text-xs tracking-wide text-[#59645e] shadow-sm backdrop-blur-md">
              The garden reflects your practice
            </div>

            <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/50 bg-[#f8f5ee]/78 p-5 shadow-lg backdrop-blur-md sm:left-auto sm:max-w-sm">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#798078]">
                A quiet observation
              </p>

              <p className="font-serif text-xl leading-relaxed text-[#334239]">
                {isTended
                  ? "The moss has become richer, and the pond feels especially still."
                  : "Nature has been quietly changing while you have been away."}
              </p>

              <p className="mt-3 text-sm leading-6 text-[#70766f]">
                {isTended
                  ? "Nothing was earned. Something was cared for."
                  : "Nothing has been lost. The garden is still here."}
              </p>
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <section className="rounded-[2rem] border border-[#d8d2c5] bg-[#faf7f0] p-7 shadow-[0_18px_55px_rgba(70,63,50,0.08)]">
              <p className="mb-5 text-xs uppercase tracking-[0.25em] text-[#7b847d]">
                Today&apos;s Lens
              </p>

              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dfe5d8]">
                  <LeafIcon />
                </div>

                <div>
                  <h2 className="font-serif text-2xl">Right Intention</h2>
                  <p className="text-sm text-[#85877f]">
                    A way of seeing beneath the action
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-[15px] leading-7 text-[#565f59]">
                <p>
                  This reflection was inspired by a Buddhist teaching known as{" "}
                  <strong className="font-medium text-[#35433b]">
                    Right Intention
                  </strong>
                  .
                </p>

                <p>
                  One way this teaching invites us to reflect is by looking
                  beyond our actions and considering the intentions behind
                  them.
                </p>

                <p>
                  As I read your story, I found myself thinking about the care
                  and inclusion that motivated your actions.
                </p>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#d8d2c5] bg-[#e7e9df] p-7">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#747c75]">
                Today&apos;s Practice
              </p>

              <p className="font-serif text-xl leading-8 text-[#39463e]">
                As you move through today, notice the intention beneath one
                small act of care.
              </p>
            </section>

            <section className="rounded-[2rem] border border-[#d8d2c5] bg-[#faf7f0] p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-[#dce4d7] p-2">
                  <LeafIcon />
                </div>

                <div>
                  <p className="font-serif text-lg text-[#39453e]">
                    A new leaf has found its place.
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#777b74]">
                    Select the highlighted leaf in the tree to revisit the
                    memory connected to this lens.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {showMemory && (
        <MemoryModal onClose={() => setShowMemory(false)} />
      )}
    </main>
  );
}

function GardenIllustration({
  isTended,
  onLeafClick,
}: {
  isTended: boolean;
  onLeafClick: () => void;
}) {
  return (
    <svg
      viewBox="0 0 900 720"
      role="img"
      aria-label="A quiet Japanese garden with a tree, pond, moss, stones, and lantern"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isTended ? "#dce4df" : "#dedbd3"} />
          <stop offset="100%" stopColor={isTended ? "#f0eadc" : "#e7e1d7"} />
        </linearGradient>

        <linearGradient id="pond" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={isTended ? "#9eaea8" : "#a8aaa5"} />
          <stop offset="100%" stopColor={isTended ? "#778f89" : "#8e918d"} />
        </linearGradient>

        <filter id="softShadow">
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="12"
            floodColor="#4d534c"
            floodOpacity="0.18"
          />
        </filter>

        <filter id="leafGlow">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="7"
            floodColor="#f4e6a7"
            floodOpacity="0.95"
          />
        </filter>
      </defs>

      <rect width="900" height="720" fill="url(#sky)" />

      <circle cx="760" cy="115" r="48" fill="#f3e7c8" opacity="0.65" />

      <path
        d="M0 260 C170 200 290 230 430 205 C590 178 710 220 900 165 L900 420 L0 420 Z"
        fill="#aeb7a8"
        opacity="0.5"
      />

      <path
        d="M0 330 C190 270 320 330 470 290 C650 245 760 300 900 260 L900 470 L0 470 Z"
        fill="#8f9a8d"
        opacity="0.38"
      />

      <path
        d="M0 390 C160 340 300 365 450 340 C620 310 760 360 900 315 L900 720 L0 720 Z"
        fill={isTended ? "#a7ad91" : "#aaa792"}
      />

      <path
        d="M0 555 C160 490 300 525 420 555 C550 590 650 615 900 560 L900 720 L0 720 Z"
        fill={isTended ? "#879775" : "#96927d"}
      />

      <path
        d="M600 463 C695 430 810 451 900 513 L900 720 L600 720 C551 638 533 533 600 463 Z"
        fill="url(#pond)"
        opacity="0.94"
      />

      <g
        fill="none"
        stroke="#dce5df"
        strokeWidth="3"
        opacity={isTended ? 0.48 : 0.16}
      >
        <path d="M651 528 C711 508 785 512 845 535" />
        <path d="M630 567 C712 547 804 556 873 585" />
        <path d="M650 611 C727 595 801 602 853 625" />
      </g>

      <g filter="url(#softShadow)">
        <ellipse cx="196" cy="585" rx="75" ry="25" fill="#77786e" />
        <ellipse cx="295" cy="625" rx="64" ry="22" fill="#85857a" />
        <ellipse cx="402" cy="580" rx="72" ry="24" fill="#73776f" />
        <ellipse cx="499" cy="637" rx="55" ry="19" fill="#8c8b80" />
      </g>

      <g>
        <path
          d="M112 502 C145 456 202 451 241 480 C275 506 287 552 267 590 C218 610 153 603 105 576 C91 551 94 525 112 502 Z"
          fill={isTended ? "#6d8062" : "#807e68"}
          className="transition-all duration-1000"
        />

        <circle
          cx="145"
          cy="527"
          r="16"
          fill={isTended ? "#8da17d" : "#8d8a72"}
        />
        <circle
          cx="184"
          cy="506"
          r="20"
          fill={isTended ? "#829772" : "#85816b"}
        />
        <circle
          cx="221"
          cy="538"
          r="24"
          fill={isTended ? "#91a682" : "#918c75"}
        />
        <circle
          cx="172"
          cy="565"
          r="25"
          fill={isTended ? "#778d69" : "#817d69"}
        />
      </g>

      {!isTended && (
        <g fill="#9c7657" opacity="0.62">
          <ellipse cx="130" cy="604" rx="18" ry="7" transform="rotate(24 130 604)" />
          <ellipse cx="225" cy="620" rx="20" ry="7" transform="rotate(-18 225 620)" />
          <ellipse cx="390" cy="646" rx="17" ry="6" transform="rotate(12 390 646)" />
          <ellipse cx="520" cy="579" rx="19" ry="7" transform="rotate(-24 520 579)" />
        </g>
      )}

      <g transform="translate(715 348)" filter="url(#softShadow)">
        <rect x="29" y="56" width="18" height="130" rx="6" fill="#77776f" />
        <path d="M0 56 L76 56 L61 80 L14 80 Z" fill="#64675f" />
        <path d="M13 20 L64 20 L76 56 L0 56 Z" fill="#696c64" />
        <path d="M25 0 L51 0 L64 20 L13 20 Z" fill="#5c6059" />
        <rect
          x="19"
          y="29"
          width="39"
          height="29"
          rx="5"
          fill={isTended ? "#ead89d" : "#b6ad92"}
          opacity={isTended ? 0.86 : 0.38}
        />
        <ellipse cx="38" cy="190" rx="36" ry="11" fill="#6c7069" />
      </g>

      <g filter="url(#softShadow)">
        <path
          d="M345 502 C360 427 382 354 414 288 C431 252 450 213 449 160"
          fill="none"
          stroke="#665b4c"
          strokeWidth="39"
          strokeLinecap="round"
        />

        <path
          d="M403 315 C343 282 297 237 264 185"
          fill="none"
          stroke="#665b4c"
          strokeWidth="22"
          strokeLinecap="round"
        />

        <path
          d="M416 280 C480 241 534 199 568 148"
          fill="none"
          stroke="#665b4c"
          strokeWidth="21"
          strokeLinecap="round"
        />

        <path
          d="M443 230 C484 202 504 166 510 122"
          fill="none"
          stroke="#665b4c"
          strokeWidth="15"
          strokeLinecap="round"
        />
      </g>

      <g
        fill={isTended ? "#64785f" : "#747562"}
        className="transition-all duration-1000"
      >
        <circle cx="248" cy="171" r="74" />
        <circle cx="317" cy="141" r="78" />
        <circle cx="385" cy="151" r="90" />
        <circle cx="458" cy="128" r="82" />
        <circle cx="534" cy="153" r="74" />
        <circle cx="286" cy="218" r="70" />
        <circle cx="370" cy="211" r="83" />
        <circle cx="458" cy="206" r="82" />
        <circle cx="548" cy="204" r="62" />
      </g>

      <g fill={isTended ? "#82927a" : "#858374"} opacity="0.9">
        <circle cx="278" cy="132" r="38" />
        <circle cx="360" cy="112" r="44" />
        <circle cx="436" cy="105" r="40" />
        <circle cx="516" cy="139" r="35" />
        <circle cx="322" cy="213" r="40" />
        <circle cx="426" cy="191" r="48" />
      </g>

      <button
        type="button"
        onClick={onLeafClick}
        aria-label="Open the Right Intention memory"
        className="cursor-pointer focus:outline-none"
      >
        <g
          filter="url(#leafGlow)"
          className="animate-[leafFloat_4s_ease-in-out_infinite]"
        >
          <path
            d="M485 173 C509 146 544 151 553 174 C544 205 509 220 482 203 C473 191 474 181 485 173 Z"
            fill="#d9df9f"
          />
          <path
            d="M486 201 C505 190 525 178 547 165"
            fill="none"
            stroke="#78825e"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </button>

      <g opacity={isTended ? 0.72 : 0.3}>
        <circle cx="662" cy="472" r="4" fill="#e7ece4" />
        <circle cx="695" cy="455" r="3" fill="#e7ece4" />
        <circle cx="744" cy="474" r="4" fill="#e7ece4" />
      </g>

      <style>
        {`
          @keyframes leafFloat {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
              transform-origin: 518px 182px;
            }
            50% {
              transform: translateY(-8px) rotate(2deg);
              transform-origin: 518px 182px;
            }
          }
        `}
      </style>
    </svg>
  );
}

function MemoryModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#27302b]/45 px-5 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <article
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-white/60 bg-[#faf7ef] p-7 shadow-2xl sm:p-9"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-7 flex items-start justify-between gap-5">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#83877f]">
              July 17, 2026
            </p>

            <h2 className="font-serif text-3xl text-[#344139]">
              Emily&apos;s fifth birthday
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d8d2c6] text-xl text-[#687069] transition hover:bg-white"
            aria-label="Close memory"
          >
            ×
          </button>
        </div>

        <div className="rounded-2xl bg-[#ece9df] p-5">
          <p className="text-sm uppercase tracking-[0.18em] text-[#7e837d]">
            Your memo
          </p>

          <p className="mt-3 font-serif text-xl leading-8 text-[#414c45]">
            Today I&apos;m grateful for my daughter&apos;s birthday. We bought
            her a cake, and I bought Liam a brownie so he wouldn&apos;t feel
            left out.
          </p>
        </div>

        <div className="my-7 h-px bg-[#ddd7ca]" />

        <p className="text-xs uppercase tracking-[0.22em] text-[#7d847e]">
          Today&apos;s Lens
        </p>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#dfe5d8] p-2">
            <LeafIcon />
          </div>

          <h3 className="font-serif text-2xl text-[#354139]">
            Right Intention
          </h3>
        </div>

        <p className="mt-5 leading-7 text-[#5f665f]">
          As I read your story, I found myself thinking about the care and
          inclusion that motivated your actions. The brownie was a small
          gesture, but the intention behind it helped ensure that Liam also
          felt remembered.
        </p>

        <p className="mt-5 text-sm italic leading-6 text-[#83837b]">
          This leaf remembers the moment. The garden reflects the practice.
        </p>
      </article>
    </div>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
      <path
        d="M19.5 4.5C13.2 4.7 8.3 7 6.2 10.7c-1.6 2.8-.8 5.7 1.6 7.1 2.5 1.5 5.5.7 7.1-2 2.2-3.7 2.9-7.9 4.6-11.3Z"
        fill="#71816a"
      />
      <path
        d="M5 20c2.7-4.1 6.1-7.4 10.4-10"
        stroke="#4f6152"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
