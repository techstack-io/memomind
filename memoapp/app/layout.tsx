import { Suspense } from "react";
import { HexclaveProvider, HexclaveTheme } from "@hexclave/next";
import { Geist, Newsreader } from "next/font/google";

import { hexclaveServerApp } from "@/hexclave/server";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { cn } from "@/lib/utils";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(geist.variable, newsreader.variable)}
    >
      <body>
        <HexclaveProvider app={hexclaveServerApp}>
          <HexclaveTheme>
            <Suspense fallback={<NavbarLoading />}>
              <AppNavbar />
            </Suspense>

            {children}
          </HexclaveTheme>
        </HexclaveProvider>
      </body>
    </html>
  );
}

function NavbarLoading() {
  return (
    <header className="w-full px-6 py-4 sm:px-8 lg:px-10">
      <div className="mx-auto h-14 max-w-7xl" />
    </header>
  );
}