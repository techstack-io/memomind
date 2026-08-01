"use client";

import { useEffect, useRef } from "react";

type HillLayer = {
  baseline: number;
  amplitude: number;
  frequency: number;
  phase: number;
  opacity: number;
  color: string;
  driftSpeed: number;
};

const hillLayers: HillLayer[] = [
  {
    baseline: 0.6,
    amplitude: 18,
    frequency: 1.35,
    phase: 0.2,
    opacity: 0.12,
    color: "104, 121, 105",
    driftSpeed: 0.000003,
  },
  {
    baseline: 0.69,
    amplitude: 28,
    frequency: 1.7,
    phase: 1.1,
    opacity: 0.17,
    color: "84, 105, 88",
    driftSpeed: 0.000005,
  },
  {
    baseline: 0.79,
    amplitude: 36,
    frequency: 2.1,
    phase: 2,
    opacity: 0.23,
    color: "65, 88, 72",
    driftSpeed: 0.000007,
  },
  {
    baseline: 0.9,
    amplitude: 24,
    frequency: 2.6,
    phase: 0.7,
    opacity: 0.32,
    color: "49, 72, 58",
    driftSpeed: 0.000009,
  },
];

export function AmbientLandscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (!canvasElement) {
      return;
    }

    const renderingContext = canvasElement.getContext("2d");

    if (!renderingContext) {
      return;
    }

    // Non-null aliases prevent TypeScript from losing the guards
    // inside nested functions and callbacks.
    const canvas = canvasElement;
    const ctx = renderingContext;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let prefersReducedMotion = motionPreference.matches;
    let animationFrameId: number | null = null;
    let width = 1;
    let height = 1;

    function resizeCanvas() {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);

      ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0,
      );
    }

    function drawSky() {
      const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        height,
      );

      gradient.addColorStop(0, "#f8efe3");
      gradient.addColorStop(0.45, "#e9e7dc");
      gradient.addColorStop(1, "#d8dfd5");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    function drawSunlight(timestamp: number) {
      const drift = prefersReducedMotion
        ? 0
        : Math.sin(timestamp * 0.000025) * width * 0.03;

      const centerX = width * 0.3 + drift;
      const centerY = height * 0.23;
      const radius = Math.max(width, height) * 0.52;

      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius,
      );

      gradient.addColorStop(
        0,
        "rgba(255, 244, 216, 0.6)",
      );

      gradient.addColorStop(
        0.4,
        "rgba(255, 231, 202, 0.2)",
      );

      gradient.addColorStop(
        1,
        "rgba(255, 255, 255, 0)",
      );

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    function drawMist(timestamp: number) {
      const drift = prefersReducedMotion
        ? 0
        : Math.sin(timestamp * 0.000018) * width * 0.05;

      const gradient = ctx.createLinearGradient(
        drift,
        height * 0.35,
        width + drift,
        height * 0.68,
      );

      gradient.addColorStop(
        0,
        "rgba(255, 255, 255, 0.02)",
      );

      gradient.addColorStop(
        0.5,
        "rgba(255, 255, 255, 0.22)",
      );

      gradient.addColorStop(
        1,
        "rgba(255, 255, 255, 0.03)",
      );

      ctx.fillStyle = gradient;
      ctx.fillRect(
        0,
        height * 0.28,
        width,
        height * 0.5,
      );
    }

    function drawHill(
      layer: HillLayer,
      timestamp: number,
    ) {
      const time = prefersReducedMotion
        ? 0
        : timestamp * layer.driftSpeed;

      const step = Math.max(8, width / 120);

      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let x = 0; x <= width + step; x += step) {
        const normalizedX = x / Math.max(width, 1);

        const primaryWave =
          Math.sin(
            normalizedX *
              Math.PI *
              2 *
              layer.frequency +
              layer.phase +
              time,
          ) * layer.amplitude;

        const secondaryWave =
          Math.sin(
            normalizedX * Math.PI * 5.2 +
              layer.phase * 1.7 -
              time * 0.6,
          ) *
          layer.amplitude *
          0.22;

        const y =
          height * layer.baseline +
          primaryWave +
          secondaryWave;

        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      ctx.fillStyle = `rgba(${layer.color}, ${layer.opacity})`;
      ctx.fill();
    }

    function render(timestamp: number) {
      ctx.clearRect(0, 0, width, height);

      drawSky();
      drawSunlight(timestamp);
      drawMist(timestamp);

      for (const layer of hillLayers) {
        drawHill(layer, timestamp);
      }

      if (!prefersReducedMotion) {
        animationFrameId = window.requestAnimationFrame(render);
      }
    }

    function cancelAnimation() {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }

    function restartAnimation() {
      cancelAnimation();
      render(0);
    }

    function handleMotionChange(event: MediaQueryListEvent) {
      prefersReducedMotion = event.matches;
      restartAnimation();
    }

    resizeCanvas();
    render(0);

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();

      if (prefersReducedMotion) {
        render(0);
      }
    });

    resizeObserver.observe(canvas);

    motionPreference.addEventListener(
      "change",
      handleMotionChange,
    );

    return () => {
      resizeObserver.disconnect();

      motionPreference.removeEventListener(
        "change",
        handleMotionChange,
      );

      cancelAnimation();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 block h-full w-full"
    />
  );
}