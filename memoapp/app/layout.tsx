import { Suspense } from "react";
import { HexclaveProvider, HexclaveTheme } from "@hexclave/next";
import { hexclaveServerApp } from "@/hexclave/server";
import { AppNavbar } from "@/components/layout/AppNavbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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