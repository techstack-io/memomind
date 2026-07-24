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

    const pendingPath = localStorage.getItem("memomind:pendingPath");

    if (pendingPath === "memo") {
      localStorage.removeItem("memomind:pendingPath");
      router.replace("/dashboard");
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

    router.push(path === "memo" ? "/dashboard" : "/preliminaries");
  }

  return (
    <main className="min-h-screen bg-memo-bg text-memo-text">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-12 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          {/* Left: Hero text */}
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="visible"
            className="relative z-10 text-left"
          >
            <motion.p
              variants={heroItem}
              className="text-xs uppercase tracking-[0.34em] text-memo-neutral-700/80 sm:text-sm"
            >
              Inspired by Lojong Mind Training
            </motion.p>

            <motion.h1
              variants={heroItem}
              className="mt-6 font-heading text-6xl font-normal leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[62px]"
            >
              welcome to{" "}
              <span className="italic text-memo-connection-600">
                memo
              </span>
            </motion.h1>

            <motion.p
              variants={heroItem}
              className="mt-4 max-w-xl text-xl leading-9 text-memo-neutral-700"
            >
              your conversational guide inside Memomind
            </motion.p>

            <motion.p
              variants={heroItem}
              className="mt-5 text-sm text-memo-neutral-700"
            >
              Choose how you would like to begin.
            </motion.p>

            <motion.div
              variants={heroItem}
              className="mt-5 flex flex-col items-start gap-3 sm:flex-row"
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
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-memo-neutral-900 px-7 text-sm font-semibold text-white transition-colors duration-200 hover:bg-black"
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
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-memo-neutral-300 bg-memo-surface/80 px-7 text-sm font-semibold text-memo-text transition-colors duration-200 hover:border-memo-connection-300 hover:bg-memo-surface"
              >
                Begin with Foundations
              </motion.button>
            </motion.div>

            <motion.label
              variants={heroItem}
              className="mt-4 flex w-fit cursor-pointer items-center gap-2 text-sm text-memo-neutral-700"
            >
              <input
                type="checkbox"
                checked={rememberChoice}
                onChange={(event) =>
                  setRememberChoice(event.target.checked)
                }
                className="size-4 rounded border-memo-neutral-300 accent-memo-neutral-900"
              />
              Remember my choice for next time
            </motion.label>
          </motion.div>

          {/* Right: Video illustration */}
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
            className="relative flex items-center justify-center"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-memo-surface">
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
                className="pointer-events-none absolute inset-0 rounded-2xl border border-black/5 shadow-[inset_0_0_10px_rgba(38,31,26,0.12),inset_0_2px_4px_rgba(38,31,26,0.08),inset_0_-1px_2px_rgba(255,255,255,0.28)]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="conversation"
        className="scroll-mt-24 px-6 pb-24 lg:px-10"
      >
        <motion.div
          variants={sectionContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="mx-auto max-w-7xl border-y border-memo-divider py-16"
        >
          <motion.p
            variants={sectionItem}
            className="text-xs uppercase tracking-[0.28em] text-memo-neutral-700/80"
          >
            How Memo works
          </motion.p>

          <div className="mt-10 grid gap-10 md:grid-cols-3">
            <motion.article variants={sectionItem}>
              <p className="text-sm text-memo-connection-600">
                01
              </p>

              <h2 className="mt-4 font-heading text-2xl">
                Share what is present
              </h2>

              <p className="mt-3 leading-7 text-memo-neutral-700">
                Begin with an ordinary moment, concern, relationship,
                or recurring pattern.
              </p>
            </motion.article>

            <motion.article variants={sectionItem}>
              <p className="text-sm text-memo-connection-600">
                02
              </p>

              <h2 className="mt-4 font-heading text-2xl">
                Notice what lies beneath
              </h2>

              <p className="mt-3 leading-7 text-memo-neutral-700">
                Memo reflects the feelings, intentions, and habits
                shaping the experience.
              </p>
            </motion.article>

            <motion.article variants={sectionItem}>
              <p className="text-sm text-memo-connection-600">
                03
              </p>

              <h2 className="mt-4 font-heading text-2xl">
                Turn reflection into practice
              </h2>

              <p className="mt-3 leading-7 text-memo-neutral-700">
                A relevant Lojong teaching or contemplative practice is
                introduced when it is genuinely useful.
              </p>
            </motion.article>
          </div>
        </motion.div>
      </section>
    </main>
  );
}