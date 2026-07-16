"use client";

import Lottie from "lottie-react";
import animationData from "@/public/animations/magic_particles.json";

interface MagicParticlesProps {
  className?: string;
}

export default function MagicParticles({
  className = "",
}: MagicParticlesProps) {
  return (
    <div className={className} aria-hidden="true">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        className="h-full w-full"
      />
    </div>
  );
}
