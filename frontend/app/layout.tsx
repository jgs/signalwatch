import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./portfolio.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jgsops.dev"),
  title: {
    default: "Anxo Fandiño — Selected Work",
    template: "%s / Anxo Fandiño"
  },
  description:
    "The portfolio of Anxo Fandiño. Projects in computer vision, human movement, and intelligent systems engineering.",
  icons: {
    icon: [
      { url: "/portfolio-mark.svg", type: "image/svg+xml" }
    ],
    apple: "/apple-icon.png"
  },
  openGraph: {
    title: "Anxo Fandiño — Selected Work",
    description:
      "Computer vision, human movement, and intelligent systems. Explore selected projects by Anxo Fandiño.",
    url: "https://jgsops.dev",
    siteName: "Anxo Fandiño",
    type: "website",
    images: [
      {
        url: "/portfolio-share.png",
        width: 1200,
        height: 630,
        alt: "Anxo Fandiño — computer vision, movement, systems"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Anxo Fandiño — Selected Work",
    description:
      "Computer vision, human movement, and intelligent systems. Explore selected projects by Anxo Fandiño.",
    images: ["/portfolio-share.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className={`${sans.variable} ${mono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
