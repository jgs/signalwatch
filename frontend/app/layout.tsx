import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
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
    "A clear, evidence-first interface for understanding AI safety signals, model behavior, and perception robustness without fabricated telemetry.",
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
      "A clear, evidence-first interface for understanding AI safety signals, model behavior, and perception robustness without fabricated telemetry.",
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
      "A clear, evidence-first interface for understanding AI safety signals, model behavior, and perception robustness without fabricated telemetry.",
    images: ["/og-image.svg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${sans.variable} ${mono.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
