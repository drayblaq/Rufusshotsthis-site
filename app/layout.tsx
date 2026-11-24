import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// next/font self-hosts the font files (no extra request to Google at runtime),
// which matters for visitors on slow mobile data.
// The variable names match what globals.css / shadcn expect (--font-sans).
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Placeholder metadata; will move to content/ once site copy is added.
export const metadata: Metadata = {
  title: "RufusShotThis Photography",
  description: "Photography in Ilorin and Lagos, Nigeria.",
};

// Root layout: wraps every page. Header/footer will be added under app/(site)/layout.tsx.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
