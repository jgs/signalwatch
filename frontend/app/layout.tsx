import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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
    default: "SIGNALWATCH - Evidence-first AI observability",
    template: "%s / SIGNALWATCH"
  },
  description:
    "An evidence-aware AI observability surface for inspecting source-backed signals, runtime telemetry, and perception robustness without fabricated metrics.",
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" }
    ],
    apple: "/apple-icon.png"
  },
  openGraph: {
    title: "SIGNALWATCH - Evidence-first AI observability",
    description:
      "Inspect source-backed AI signals, runtime telemetry, evidence boundaries, and perception robustness without fabricated metrics.",
    url: "https://jgsops.dev",
    siteName: "SIGNALWATCH",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "SIGNALWATCH evidence-first AI observability"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SIGNALWATCH - Evidence-first AI observability",
    description:
      "Inspect source-backed AI signals, runtime telemetry, evidence boundaries, and perception robustness without fabricated metrics.",
    images: ["/og-image.svg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${sans.variable} ${mono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
