"use client";

import Lottie from "lottie-react";
import dandelionAnimation from "@/public/animations/dandelion.json";

export default function DandelionAnimation() {
  return (
    <Lottie
      animationData={dandelionAnimation}
      loop
      autoplay
      aria-hidden="true"
      className="h-full w-full"
    />
  );
}