"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useHexclaveApp, useUser } from "@hexclave/next";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";

type PreferredPath = "memo" | "foundations";

const easeOut = [0.22, 1, 0.36, 1] as const;

const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.16,
    },
  },
};

const heroItem: Variants = {
  hidden: {
    opacity: 0,
    y: 6,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOut,
    },
  },
};

const sectionContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sectionItem: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

export default function MemoMindLandingPage() {
  const router = useRouter();
  const app = useHexclaveApp();
  const user = useUser();
  const shouldReduceMotion = useReducedMotion();

  const [rememberChoice, setRememberChoice] = useState(false);

  useEffect(() => {
    if (!user) return;

    const pendingPath = localStorage.getItem(
      "memomind:pendingPath",
    );

    if (pendingPath === "memo") {
      localStorage.removeItem("memomind:pendingPath");
      router.replace("/conversation");
      return;
    }

    if (pendingPath === "foundations") {
      localStorage.removeItem("memomind:pendingPath");
      router.replace("/preliminaries");
    }
  }, [user, router]);

  async function choosePath(path: PreferredPath) {
    if (rememberChoice) {
      localStorage.setItem("memomind:preferredPath", path);
    } else {
      localStorage.removeItem("memomind:preferredPath");
    }

    if (!user) {
      localStorage.setItem("memomind:pendingPath", path);
      await app.redirectToSignIn();
      return;
    }

    router.push(
      path === "memo"
        ? "/conversation"
        : "/preliminaries",
    );
  }

  return (
    <main className="min-h-screen bg-memo-bg text-memo-text">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Hero text */}
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="visible"
            className="relative z-10 order-2 text-left lg:order-1"
          >
            <motion.p
              variants={heroItem}
              className="text-[10px] uppercase tracking-[0.22em] text-memo-neutral-700/80 sm:text-xs sm:tracking-[0.3em] lg:text-sm lg:tracking-[0.34em]"
            >
              Inspired by Lojong Mind Training
            </motion.p>

            <motion.h1
              variants={heroItem}
              className="mt-4 font-heading text-[clamp(3rem,12vw,62px)] font-normal leading-[0.96] tracking-[-0.045em] sm:mt-6"
            >
              welcome to{" "}
              <span className="italic text-memo-connection-600">
                memo
              </span>
            </motion.h1>

            <motion.p
              variants={heroItem}
              className="mt-3 max-w-xl text-lg leading-7 text-memo-neutral-700 sm:mt-4 sm:text-xl sm:leading-9"
            >
              your conversational guide inside Memomind
            </motion.p>

            <motion.p
              variants={heroItem}
              className="mt-4 text-sm text-memo-neutral-700 sm:mt-5"
            >
              Choose how you would like to begin.
            </motion.p>

            <motion.div
              variants={heroItem}
              className="mt-5 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            >
              <motion.button
                type="button"
                onClick={() => choosePath("memo")}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -2,
                        boxShadow:
                          "0 12px 24px rgba(32, 32, 30, 0.16)",
                      }
                }
                whileTap={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: 0.985,
                      }
                }
                transition={{
                  duration: 0.2,
                  ease: easeOut,
                }}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-memo-neutral-900 px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-black sm:w-auto sm:px-7"
              >
                Talk with Memo
              </motion.button>

              <motion.button
                type="button"
                onClick={() => choosePath("foundations")}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -2,
                        boxShadow:
                          "0 10px 22px rgba(52, 47, 42, 0.1)",
                      }
                }
                whileTap={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: 0.985,
                      }
                }
                transition={{
                  duration: 0.2,
                  ease: easeOut,
                }}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-memo-neutral-300 bg-memo-surface/80 px-5 text-center text-sm font-semibold text-memo-text transition-colors duration-200 hover:border-memo-connection-300 hover:bg-memo-surface sm:w-auto sm:px-7"
              >
                Begin with Foundations
              </motion.button>
            </motion.div>

            <motion.label
              variants={heroItem}
              className="mt-4 flex max-w-full cursor-pointer items-start gap-2 text-sm leading-5 text-memo-neutral-700 sm:w-fit sm:items-center"
            >
              <input
                type="checkbox"
                checked={rememberChoice}
                onChange={(event) =>
                  setRememberChoice(event.target.checked)
                }
                className="mt-0.5 size-4 shrink-0 rounded border-memo-neutral-300 accent-memo-neutral-900 sm:mt-0"
              />

              <span>
                Remember my choice for next time
              </span>
            </motion.label>
          </motion.div>

          {/* Video illustration */}
          <motion.div
            initial={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.99,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1.2,
              delay: 0.35,
              ease: easeOut,
            }}
            className="relative order-1 flex w-full items-center justify-center lg:order-2"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-memo-surface sm:aspect-video sm:rounded-2xl">
              <video
                autoPlay={!shouldReduceMotion}
                muted
                playsInline
                preload="auto"
                className="h-full w-full object-cover"
              >
                <source
                  src="/animations/hero-animated-2.mp4"
                  type="video/mp4"
                />

                Your browser does not support the video tag.
              </video>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl border border-black/5 shadow-[inset_0_0_10px_rgba(38,31,26,0.12),inset_0_2px_4px_rgba(38,31,26,0.08),inset_0_-1px_2px_rgba(255,255,255,0.28)] sm:rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How Memo works */}
      <section
        id="conversation"
        className="scroll-mt-20 px-5 pb-16 sm:px-6 sm:pb-20 lg:scroll-mt-24 lg:px-10 lg:pb-24"
      >
        <motion.div
          variants={sectionContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="mx-auto max-w-7xl border-y border-memo-divider py-10 sm:py-14 lg:py-16"
        >
          <motion.p
            variants={sectionItem}
            className="text-[10px] uppercase tracking-[0.22em] text-memo-neutral-700/80 sm:text-xs sm:tracking-[0.28em]"
          >
            How Memo works
          </motion.p>

          <div className="mt-8 grid gap-0 sm:mt-10 md:grid-cols-3 md:gap-8 lg:gap-12">
            <motion.article
              variants={sectionItem}
              className="border-b border-memo-divider py-7 first:pt-0 md:border-b-0 md:py-0"
            >
              <p className="text-sm text-memo-connection-600">
                01
              </p>

              <h2 className="mt-3 font-heading text-xl leading-tight sm:mt-4 sm:text-2xl">
                Share what is present
              </h2>

              <p className="mt-3 text-[15px] leading-7 text-memo-neutral-700 sm:text-base">
                Begin with an ordinary moment, concern,
                relationship, or recurring pattern.
              </p>
            </motion.article>

            <motion.article
              variants={sectionItem}
              className="border-b border-memo-divider py-7 md:border-b-0 md:border-l md:border-memo-divider md:py-0 md:pl-8 lg:pl-12"
            >
              <p className="text-sm text-memo-connection-600">
                02
              </p>

              <h2 className="mt-3 font-heading text-xl leading-tight sm:mt-4 sm:text-2xl">
                Notice what lies beneath
              </h2>

              <p className="mt-3 text-[15px] leading-7 text-memo-neutral-700 sm:text-base">
                Memo reflects the feelings, intentions, and
                habits shaping the experience.
              </p>
            </motion.article>

            <motion.article
              variants={sectionItem}
              className="py-7 last:pb-0 md:border-l md:border-memo-divider md:py-0 md:pl-8 lg:pl-12"
            >
              <p className="text-sm text-memo-connection-600">
                03
              </p>

              <h2 className="mt-3 font-heading text-xl leading-tight sm:mt-4 sm:text-2xl">
                Turn reflection into practice
              </h2>

              <p className="mt-3 text-[15px] leading-7 text-memo-neutral-700 sm:text-base">
                A relevant Lojong teaching or contemplative
                practice is introduced when it is genuinely
                useful.
              </p>
            </motion.article>
          </div>
        </motion.div>
      </section>
    </main>
  );
}