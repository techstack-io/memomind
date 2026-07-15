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
