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
    default: "JGSOPS - Realtime AI Observability Systems",
    template: "%s / JGSOPS"
  },
  description:
    "Realtime observability infrastructure for monitoring intelligent systems, alignment signals, operational telemetry, and ecosystem drift.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "JGSOPS - Realtime AI Observability Systems",
    description:
      "Realtime observability infrastructure for monitoring intelligent systems, alignment signals, operational telemetry, and ecosystem drift.",
    url: "https://jgsops.dev",
    siteName: "JGSOPS",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "JGSOPS realtime observability systems"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "JGSOPS - Realtime AI Observability Systems",
    description:
      "Realtime observability infrastructure for monitoring intelligent systems, alignment signals, operational telemetry, and ecosystem drift.",
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
