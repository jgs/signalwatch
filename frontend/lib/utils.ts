import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Severity } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUtc(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";
  return `${date.toISOString().slice(0, 10)} ${date.toISOString().slice(11, 16)} UTC`;
}

export function timeOnly(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--:--";
  return `${date.toISOString().slice(11, 19)} UTC`;
}

export function severityFromScore(score: number): Severity {
  if (score >= 0.92) return "CRITICAL";
  if (score >= 0.84) return "ALERT";
  if (score >= 0.78) return "ELEVATED";
  if (score >= 0.72) return "WATCH";
  return "TRACE";
}

export function severityClass(severity: Severity | undefined) {
  switch (severity) {
    case "CRITICAL":
      return "border-signal-danger/60 text-signal-danger shadow-[0_0_28px_rgba(200,120,120,0.08)]";
    case "ALERT":
      return "border-signal-amber/60 text-signal-amber shadow-[0_0_26px_rgba(182,161,109,0.07)]";
    case "ELEVATED":
      return "border-signal-olive/70 text-signal-olive shadow-[0_0_24px_rgba(154,165,111,0.07)]";
    case "WATCH":
      return "border-[#2f4a39] text-signal-green shadow-[0_0_24px_rgba(137,227,173,0.06)]";
    default:
      return "border-signal-line text-signal-muted";
  }
}
