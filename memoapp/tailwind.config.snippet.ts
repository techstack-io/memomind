// Merge this into your existing tailwind.config.ts (theme.extend).
// These tokens come from the "Classical" design system used for the mock
// (editorial, warm neutrals) plus a single indigo "connection" accent —
// reserved for Memo mentions, insight callouts, graph connections, and
// primary CTAs. Everything else stays neutral gray.

export const memoMindThemeExtend = {
  colors: {
    memo: {
      bg: "#f3f2f2",
      surface: "#eae9e9",
      text: "#201f1d",
      divider: "rgba(32,31,29,0.16)",
      "neutral-100": "#f8f4f4",
      "neutral-700": "#605d5d",
      "neutral-900": "#2d2b2b",
      "connection-100": "#eceffa",
      "connection-300": "#b7c0ea",
      "connection-400": "#8b98d4",
      "connection-500": "#5c6bb3",
      "connection-600": "#44518f",
      "connection-700": "#333e73",
    },
  },
  fontFamily: {
    heading: ['"Cormorant Garamond"', "serif"],
    body: ["Lora", "serif"],
  },
};

/*
Example tailwind.config.ts:

import type { Config } from "tailwindcss";
import { memoMindThemeExtend } from "./tailwind.config.snippet";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      ...memoMindThemeExtend,
    },
  },
};

export default config;
*/
