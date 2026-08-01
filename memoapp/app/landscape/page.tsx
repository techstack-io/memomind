"use client";

import Image from "next/image";
import SideRays from "@/components/SideRays";

export default function LandscapePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F3EEE5]">
      {/* Ambient light */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[55%] overflow-hidden opacity-10">
        <SideRays
          rayColor1="#E6D3A4"
          rayColor2="#F3EEE5"
          origin="top-right"
          speed={0.15}
          intensity={0.15}
          spread={0.8}
          tilt={-12}
          saturation={0.4}
          blend={0.1}
          falloff={3}
          opacity={1}
        />
      </div>
      {/* Intro */}
      <section className="relative z-20 mx-auto w-full max-w-7xl px-4 pt-20 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Your Practice
          </p>

          <h1 className="mt-4 text-5xl font-light tracking-tight text-neutral-900">
            Your Landscape
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            Your landscape is a quiet reflection of your ongoing practice. It
            changes gradually as you return to reflection, revisit themes, and
            spend time cultivating awareness. It isn&apos;t a measure of
            success—it simply makes your journey visible.
          </p>
        </div>
      </section>

      {/* Mountains */}
      <div className="absolute -bottom-16 left-0 right-0 z-10 overflow-hidden">
        <Image
          src="/cutouts/mountain-range2.svg"
          alt=""
          width={2200}
          height={600}
          priority
          sizes="100vw"
          className="block h-auto w-full"
        />
      </div>

      {/* Tree */}
      <div className="absolute bottom-0 left-8 z-20 h-[62vh] w-[42vw]">
        {/* <Image
          src="/cutouts/tree-cutout.svg"
          alt=""
          fill
          priority
          sizes="42vw"
          className="object-contain object-bottom-left"
        /> */}
      </div>
    </main>
  );
}