// app/journey/components/JourneyView.tsx
"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Clock3,
  Leaf,
  Sparkles,
} from "lucide-react";

import BlurText from "@/components/reactbits/BlurText";

interface ReflectionLog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  sloganNumber: number;
  slogan: string;
}

interface LojongPoint {
  id: string;
  number: number;
  title: string;
  description: string;
  reflections: ReflectionLog[];
}

interface JourneyProgressResponse {
  reflections?: ReflectionLog[];
}

const initialPoints: LojongPoint[] = [
  {
    id: "point-1",
    number: 1,
    title: "The Preliminaries",
    description:
      "Begin by grounding the mind in the conditions that make genuine practice possible.",
    reflections: [
      {
        id: "reflection-001",
        title: "Remembering what matters",
        excerpt:
          "I noticed how quickly I move through the morning without remembering that my time and attention are limited.",
        date: "August 2, 2026",
        sloganNumber: 1,
        slogan: "Train in the preliminaries",
      },
      {
        id: "reflection-002",
        title: "A pause before reacting",
        excerpt:
          "The argument felt urgent, but pausing helped me see that I did not need to defend every thought.",
        date: "July 30, 2026",
        sloganNumber: 1,
        slogan: "Train in the preliminaries",
      },
    ],
  },
  {
    id: "point-2",
    number: 2,
    title: "Training in Bodhicitta",
    description:
      "Develop compassion and insight by changing how experience is understood and held.",
    reflections: [
      {
        id: "reflection-003",
        title: "Making room for another person",
        excerpt:
          "I tried to listen without preparing my response, and the conversation became less about being right.",
        date: "July 28, 2026",
        sloganNumber: 10,
        slogan: "Begin the sequence of sending and taking with yourself",
      },
    ],
  },
  {
    id: "point-3",
    number: 3,
    title: "Transforming Adversity into the Path",
    description:
      "Use difficulty, frustration, and uncertainty as direct material for practice.",
    reflections: [
      {
        id: "reflection-004",
        title: "When blame appeared",
        excerpt:
          "My first instinct was to make the problem entirely about someone else. Looking inward revealed my own fear underneath it.",
        date: "July 24, 2026",
        sloganNumber: 12,
        slogan: "Drive all blames into one",
      },
    ],
  },
  {
    id: "point-4",
    number: 4,
    title: "Applying the Practice Throughout Life",
    description:
      "Bring reflection into ordinary moments rather than separating practice from daily life.",
    reflections: [],
  },
  {
    id: "point-5",
    number: 5,
    title: "Evaluating Mind Training",
    description:
      "Notice whether practice is producing greater honesty, compassion, and steadiness.",
    reflections: [],
  },
  {
    id: "point-6",
    number: 6,
    title: "The Disciplines of Mind Training",
    description:
      "Support inner development through consistent conduct, intention, and restraint.",
    reflections: [],
  },
  {
    id: "point-7",
    number: 7,
    title: "Guidelines for Mind Training",
    description:
      "Carry the practice forward through simple reminders that shape everyday attention.",
    reflections: [],
  },
];

function mergeReflections(
  points: LojongPoint[],
  reflections: ReflectionLog[]
): LojongPoint[] {
  return points.map((point) => ({
    ...point,
    reflections: [
      ...reflections.filter((reflection) => {
        if (point.number === 1) {
          return reflection.sloganNumber >= 1 && reflection.sloganNumber <= 7;
        }

        if (point.number === 2) {
          return reflection.sloganNumber >= 8 && reflection.sloganNumber <= 11;
        }

        if (point.number === 3) {
          return reflection.sloganNumber >= 12 && reflection.sloganNumber <= 16;
        }

        if (point.number === 4) {
          return reflection.sloganNumber >= 17 && reflection.sloganNumber <= 18;
        }

        if (point.number === 5) {
          return reflection.sloganNumber >= 19 && reflection.sloganNumber <= 22;
        }

        if (point.number === 6) {
          return reflection.sloganNumber >= 23 && reflection.sloganNumber <= 38;
        }

        return reflection.sloganNumber >= 39;
      }),
    ],
  }));
}

export default function JourneyView() {
  const [points, setPoints] = useState<LojongPoint[]>(initialPoints);
  const [openPointId, setOpenPointId] = useState<string>("point-1");
  const [selectedReflection, setSelectedReflection] =
    useState<ReflectionLog | null>(null);

  useEffect(() => {
    async function fetchUserProgress() {
      try {
        const response = await fetch("/api/journey/progress");

        if (!response.ok) {
          return;
        }

        const contentType = response.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          return;
        }

        const data = (await response.json()) as JourneyProgressResponse;

        if (data.reflections?.length) {
          setPoints((currentPoints) =>
            mergeReflections(currentPoints, data.reflections ?? [])
          );
        }
      } catch {
        console.debug("Journey progress endpoint pending backend setup.");
      }
    }

    fetchUserProgress();
  }, []);

  function togglePoint(pointId: string) {
    setOpenPointId((currentPointId) =>
      currentPointId === pointId ? "" : pointId
    );
  }

  const totalReflections = points.reduce(
    (total, point) => total + point.reflections.length,
    0
  );

  return (
    <main className="min-h-screen bg-[#F4EFE7] px-4 py-6 text-[#292721] sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-6 border-b border-[#D9D1C5] pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#8A8176]">
              <Leaf className="h-4 w-4" />
              Your journey
            </div>

            <BlurText
              text="The 7 Points of Lojong"
              delay={80}
              animateBy="words"
              direction="top"
              className="font-heading text-4xl font-normal leading-tight tracking-[-0.03em] text-[#25231F] sm:text-4xl"
            />

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#746C62] sm:text-base">
              Revisit the teachings that have appeared in your reflections and
              notice how they continue to take shape in ordinary life.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#D8CFC2] bg-[#FBF8F2] px-4 py-3 shadow-[0_12px_35px_rgba(64,55,43,0.06)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EED9C9] text-[#A75F43]">
              <Sparkles className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#948A7D]">
                Reflections connected
              </p>
              <p className="mt-1 text-sm font-medium text-[#3E3933]">
                {totalReflections} across your practice
              </p>
            </div>
          </div>
        </header>

        <section className="space-y-3">
          {points.map((point) => {
            const isOpen = openPointId === point.id;

            return (
              <article
                key={point.id}
                className="overflow-hidden rounded-2xl border border-[#DAD2C7] bg-[#FBF8F3] shadow-[0_10px_30px_rgba(66,57,45,0.04)]"
              >
                <button
                  type="button"
                  onClick={() => togglePoint(point.id)}
                  aria-expanded={isOpen}
                  aria-controls={`${point.id}-content`}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-[#F7F1E9] sm:px-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EED9C9] font-serif text-lg text-[#A65E42]">
                    {point.number}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h2 className="font-heading text-xl text-[#292721]">
                        {point.title}
                      </h2>

                      {point.reflections.length > 0 && (
                        <span className="rounded-full bg-[#EEE7DB] px-2.5 py-1 text-[11px] font-medium text-[#756B5F]">
                          {point.reflections.length}{" "}
                          {point.reflections.length === 1
                            ? "reflection"
                            : "reflections"}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 max-w-3xl text-sm leading-6 text-[#7B7268]">
                      {point.description}
                    </p>
                  </div>

                  <ChevronDown
                    className={[
                      "h-5 w-5 shrink-0 text-[#746B61] transition-transform duration-300",
                      isOpen ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`${point.id}-content`}
                    className="border-t border-[#E1D9CE] px-5 py-5 sm:px-6"
                  >
                    {point.reflections.length > 0 ? (
                      <div>
                        <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[#958B7F]">
                          Reflections connected to this point
                        </p>

                        <div className="space-y-3">
                          {point.reflections.map((reflection) => (
                            <button
                              key={reflection.id}
                              type="button"
                              onClick={() =>
                                setSelectedReflection(reflection)
                              }
                              className="group w-full rounded-xl border border-[#E2D9CD] bg-[#FFFDF9] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#CDBEAD] hover:shadow-[0_12px_28px_rgba(71,61,49,0.06)] sm:p-5"
                            >
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1EBE2] text-[#817568]">
                                  <BookOpen className="h-4 w-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                      <h3 className="font-medium text-[#37322C] transition-colors group-hover:text-[#A15D45]">
                                        {reflection.title}
                                      </h3>

                                      <p className="mt-2 max-w-3xl text-sm leading-6 text-[#776E64]">
                                        {reflection.excerpt}
                                      </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1.5 text-xs text-[#958B80]">
                                      <Clock3 className="h-3.5 w-3.5" />
                                      {reflection.date}
                                    </div>
                                  </div>

                                  <div className="mt-4 inline-flex rounded-full bg-[#F4E7DE] px-3 py-1.5 text-xs text-[#9D5D46]">
                                    Slogan {reflection.sloganNumber}:{" "}
                                    {reflection.slogan}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#D8CEC1] bg-[#F7F2EB] px-5 py-8 text-center">
                        <p className="font-heading text-lg text-[#514A42]">
                          No reflections connected yet
                        </p>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#83796E]">
                          When this point naturally appears in a conversation,
                          the reflection will be gathered here.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </div>

      {selectedReflection && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#1D1B18]/40 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setSelectedReflection(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reflection-dialog-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-xl rounded-3xl border border-[#D8CEC1] bg-[#FCF9F4] p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#958B80]">
                  Reflection
                </p>

                <h2
                  id="reflection-dialog-title"
                  className="mt-2 font-serif text-3xl text-[#292721]"
                >
                  {selectedReflection.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReflection(null)}
                className="rounded-full border border-[#D8CEC1] px-3 py-1.5 text-sm text-[#6F665D] transition-colors hover:bg-[#F2EBE2]"
              >
                Close
              </button>
            </div>

            <p className="mt-6 text-base leading-8 text-[#665E55]">
              {selectedReflection.excerpt}
            </p>

            <div className="mt-6 border-t border-[#DED5C9] pt-5">
              <p className="text-sm text-[#8B8175]">
                Slogan {selectedReflection.sloganNumber}
              </p>
              <p className="mt-1 font-serif text-xl text-[#3C3731]">
                {selectedReflection.slogan}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[#9A9084]">
                {selectedReflection.date}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}