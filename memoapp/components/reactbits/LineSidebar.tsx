"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";

type FalloffMode = "linear" | "smooth" | "gaussian";

type LineSidebarProps = {
  items: string[];
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: FalloffMode;
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  defaultActive?: number;
  activeIndex?: number;
  onItemClick?: (index: number, label: string) => void;
  className?: string;
};

type ItemMeasurement = {
  centerY: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function calculateInfluence(
  distance: number,
  radius: number,
  falloff: FalloffMode
) {
  if (distance >= radius) {
    return 0;
  }

  const normalized = clamp(1 - distance / radius, 0, 1);

  if (falloff === "linear") {
    return normalized;
  }

  if (falloff === "gaussian") {
    return Math.exp(-4 * Math.pow(1 - normalized, 2));
  }

  return normalized * normalized * (3 - 2 * normalized);
}

export default function LineSidebar({
    items,
    accentColor = "#AABDA8",
    textColor = "#CFC8BC",
    markerColor = "#716B62",
    showIndex = false,
    showMarker = true,
    proximityRadius = 85,
    maxShift = 12,
    falloff = "smooth",
    markerLength = 38,
    markerGap = 12,
    tickScale = 0.35,
    scaleTick = false,
    itemGap = 30,
    fontSize = 1.1,
    smoothing = 180,
    defaultActive = 0,
    activeIndex,
    onItemClick,
    className = "",
  }: LineSidebarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const animationFrameRef = useRef<number | null>(null);
  const targetPointerYRef = useRef<number | null>(null);
  const currentPointerYRef = useRef<number | null>(null);

  const [internalActiveIndex, setInternalActiveIndex] = useState(() =>
    clamp(defaultActive, 0, Math.max(items.length - 1, 0))
  );

  const [pointerY, setPointerY] = useState<number | null>(null);
  const [measurements, setMeasurements] = useState<ItemMeasurement[]>([]);

  const resolvedActiveIndex =
    typeof activeIndex === "number"
      ? clamp(activeIndex, 0, Math.max(items.length - 1, 0))
      : internalActiveIndex;

  const updateMeasurements = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const containerRect = container.getBoundingClientRect();

    const nextMeasurements = itemRefs.current.map((item) => {
      if (!item) {
        return { centerY: 0 };
      }

      const rect = item.getBoundingClientRect();

      return {
        centerY: rect.top - containerRect.top + rect.height / 2,
      };
    });

    setMeasurements(nextMeasurements);
  }, []);

  useEffect(() => {
    updateMeasurements();

    const resizeObserver = new ResizeObserver(updateMeasurements);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    itemRefs.current.forEach((item) => {
      if (item) {
        resizeObserver.observe(item);
      }
    });

    window.addEventListener("resize", updateMeasurements);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMeasurements);
    };
  }, [items, updateMeasurements]);

  useEffect(() => {
    setInternalActiveIndex((current) =>
      clamp(current, 0, Math.max(items.length - 1, 0))
    );
  }, [items.length]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const animatePointer = useCallback(() => {
    const target = targetPointerYRef.current;
    const current = currentPointerYRef.current;

    if (target === null) {
      currentPointerYRef.current = null;
      setPointerY(null);
      animationFrameRef.current = null;
      return;
    }

    const next =
      current === null
        ? target
        : current + (target - current) * clamp(16 / smoothing, 0.06, 1);

    currentPointerYRef.current = next;
    setPointerY(next);

    if (Math.abs(target - next) > 0.1) {
      animationFrameRef.current = requestAnimationFrame(animatePointer);
    } else {
      currentPointerYRef.current = target;
      setPointerY(target);
      animationFrameRef.current = null;
    }
  }, [smoothing]);

  function handlePointerMove(event: ReactMouseEvent<HTMLDivElement>) {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    targetPointerYRef.current = event.clientY - rect.top;

    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(animatePointer);
    }
  }

  function handlePointerLeave() {
    targetPointerYRef.current = null;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(animatePointer);
  }

  function handleItemClick(index: number, label: string) {
    if (typeof activeIndex !== "number") {
      setInternalActiveIndex(index);
    }

    onItemClick?.(index, label);
  }

  const itemTransforms = useMemo(() => {
    return items.map((_, index) => {
      const measurement = measurements[index];

      if (pointerY === null || !measurement) {
        return {
          influence: 0,
          shift: 0,
        };
      }

      const distance = Math.abs(pointerY - measurement.centerY);
      const influence = calculateInfluence(
        distance,
        proximityRadius,
        falloff
      );

      return {
        influence,
        shift: influence * maxShift,
      };
    });
  }, [
    falloff,
    items,
    maxShift,
    measurements,
    pointerY,
    proximityRadius,
  ]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className={[
        "relative flex h-full w-full items-center overflow-hidden",
        className,
      ].join(" ")}
    >
      <div
        className="relative flex w-full flex-col justify-center"
        style={{ gap: `${itemGap}px` }}
      >
        {items.map((item, index) => {
          const isActive = resolvedActiveIndex === index;
          const { influence, shift } = itemTransforms[index] ?? {
            influence: 0,
            shift: 0,
          };

          const markerWidth = isActive
            ? markerLength
            : markerLength * tickScale;

          const markerScale =
            scaleTick && !isActive ? 1 + influence * 0.35 : 1;

          const rowStyle = {
            "--line-sidebar-shift": `${shift}px`,
          } as CSSProperties;

          return (
            <button
              key={`${item}-${index}`}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              type="button"
              onClick={() => handleItemClick(index, item)}
              aria-pressed={isActive}
              className="group flex w-full items-center border-0 bg-transparent px-0 py-1 text-left outline-none"
              style={{
                ...rowStyle,
                transform: `translateX(${shift}px)`,
                transition:
                  "color 180ms ease, opacity 180ms ease, transform 70ms linear",
              }}
            >
              {showMarker && (
                <span
                  aria-hidden="true"
                  className="block h-px shrink-0 origin-left"
                  style={{
                    width: `${markerWidth}px`,
                    marginRight: `${markerGap}px`,
                    backgroundColor: isActive
                      ? accentColor
                      : markerColor,
                    transform: `scaleX(${markerScale})`,
                    opacity: isActive ? 1 : 0.65 + influence * 0.35,
                    transition:
                      "width 220ms ease, background-color 220ms ease, opacity 160ms ease, transform 80ms linear",
                  }}
                />
              )}

              {showIndex && (
                <span
                  className="mr-3 shrink-0 font-mono text-[0.7em] tabular-nums"
                  style={{
                    color: isActive ? accentColor : markerColor,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}

              <span
                className="min-w-0 leading-snug"
                style={{
                  color: isActive ? accentColor : textColor,
                  fontSize: `${fontSize}rem`,
                  opacity: isActive ? 1 : 0.72 + influence * 0.28,
                  transition: "color 180ms ease, opacity 120ms ease",
                }}
              >
                {item}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}