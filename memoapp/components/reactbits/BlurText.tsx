"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: TargetAndTransition;
  animationTo?: TargetAndTransition;
  easing?: string | ((t: number) => number);
  onAnimationComplete?: () => void;
}

export default function BlurText({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = "easeOut",
  onAnimationComplete,
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const animatedCount = useRef(0);

  // Default animations if custom ones aren't supplied
  const defaultFrom =
    direction === "top"
      ? { filter: "blur(10px)", opacity: 0, transform: "translate3d(0,-50px,0)" }
      : { filter: "blur(10px)", opacity: 0, transform: "translate3d(0,50px,0)" };

  const defaultTo = [
    {
      filter: "blur(5px)",
      opacity: 0.5,
      transform:
        direction === "top"
          ? "translate3d(0,5px,0)"
          : "translate3d(0,-5px,0)",
    },
    { filter: "blur(0px)", opacity: 1, transform: "translate3d(0,0,0)" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const springs = elements.map((_, i) => ({
    from: animationFrom || defaultFrom,
    to: inView
      ? async (next: (step: Record<string, unknown>) => Promise<void>) => {
          const steps = animationTo || defaultTo;
          for (const step of steps) {
            await next(step);
          }
          animatedCount.current += 1;
          if (animatedCount.current === elements.length && onAnimationComplete) {
            onAnimationComplete();
          }
        }
      : animationFrom || defaultFrom,
    delay: i * delay,
  }));

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={springs[index].from}
          animate={inView ? defaultTo[1] : springs[index].from}
          transition={{
            duration: 0.8,
            delay: (index * delay) / 1000,
            ease: easing,
          }}
          className="inline-block transition-all will-change-[transform,filter,opacity]"
        >
          {element === " " ? "\u00A0" : element}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </p>
  );
}