import { ChartContextProvider } from "./ChartContext";
import "./globals.css";
import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Collaborative Editor",
  description: "Open source collaborative editor",
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChartContextProvider>{children}</ChartContextProvider>
      </body>
    </html>
  );
}
