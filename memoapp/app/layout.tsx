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
            <AppNavbar />
            {children}
          </HexclaveTheme>
        </HexclaveProvider>
      </body>
    </html>
  );
}