import { ReactNode } from "react";
import clsx from "clsx";

type PillVariant =
  | "primary"
  | "success"
  | "neutral"
  | "warning"
  | "outline";

interface PillProps {
  children: ReactNode;
  variant?: PillVariant;
  className?: string;
}

const variants: Record<PillVariant, string> = {
  primary:
    "border-memo-connection-200 bg-memo-connection-50 text-memo-connection-700",

  success:
    "border-memo-growth-200 bg-memo-growth-50 text-memo-growth-700",

  neutral:
    "border-gray-200 bg-gray-50 text-gray-600",

  warning:
    "border-amber-200 bg-amber-50 text-amber-700",

  outline:
    "border-gray-300 bg-transparent text-gray-700",
};

export default function Pill({
  children,
  variant = "primary",
  className,
}: PillProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}