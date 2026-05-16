"use client";

import type { Detection } from "@/components/labs/inference/use-coco-ssd";

export type DetectionFrame = {
  timestamp: number;
  detections: Detection[];
};

export type TemporalMetric = {
  label: string;
  value: number | null;
  detail: string;
};

export function meanConfidence(detections: Detection[]) {
  if (!detections.length) return null;
  return detections.reduce((total, detection) => total + detection.score, 0) / detections.length;
}

export function analyzeTemporalDetections(frames: DetectionFrame[]): TemporalMetric[] {
  const usableFrames = frames.filter((frame) => frame.detections.length > 0);
  const means = usableFrames.map((frame) => meanConfidence(frame.detections)).filter((value): value is number => value !== null);
  const counts = frames.map((frame) => frame.detections.length);
  const persistence = pairwise(frames).map(([previous, current]) => classOverlap(previous.detections, current.detections));
  const confidenceDeltas = pairwise(means).map(([previous, current]) => Math.abs(current - previous));
  const emptyFrameRate = frames.length ? frames.filter((frame) => frame.detections.length === 0).length / frames.length : null;

  return [
    {
      label: "DETECTION.RELIABILITY",
      value: means.length ? average(means) : null,
      detail: "rolling mean confidence from model outputs",
    },
    {
      label: "CONFIDENCE.VARIANCE",
      value: means.length > 2 ? 1 - clamp(standardDeviation(means) * 3.2) : null,
      detail: "inverse variance across recent inference frames",
    },
    {
      label: "TRACKING.PERSISTENCE",
      value: persistence.length ? average(persistence) : null,
      detail: "class continuity between adjacent frames",
    },
    {
      label: "TEMPORAL.CONSISTENCY",
      value: confidenceDeltas.length ? 1 - clamp(average(confidenceDeltas) * 2.8) : null,
      detail: "confidence movement between adjacent frames",
    },
    {
      label: "PERCEPTION.STABILITY",
      value: counts.length > 2 ? 1 - clamp(standardDeviation(counts) / Math.max(1, average(counts) + 1)) : null,
      detail: "stability of detected object count",
    },
    {
      label: "FRAME.INTEGRITY",
      value: emptyFrameRate === null ? null : 1 - emptyFrameRate,
      detail: "share of recent frames with at least one model detection",
    },
    {
      label: "OCCLUSION.PRESSURE",
      value: persistence.length && emptyFrameRate !== null ? clamp((1 - average(persistence)) * 0.55 + emptyFrameRate * 0.45) : null,
      detail: "derived from detection disappearance and class continuity loss",
    },
  ];
}

export function appendDetectionFrame(frames: DetectionFrame[], detections: Detection[], limit = 32): DetectionFrame[] {
  return [...frames, { timestamp: Date.now(), detections }].slice(-limit);
}

function classOverlap(previous: Detection[], current: Detection[]) {
  const previousClasses = new Set(previous.map((detection) => detection.class));
  const currentClasses = new Set(current.map((detection) => detection.class));
  if (!previousClasses.size && !currentClasses.size) return 1;
  const intersection = [...previousClasses].filter((name) => currentClasses.has(name)).length;
  const union = new Set([...previousClasses, ...currentClasses]).size;
  return union ? intersection / union : 0;
}

function pairwise<T>(values: T[]): Array<[T, T]> {
  const pairs: Array<[T, T]> = [];
  for (let index = 1; index < values.length; index += 1) {
    pairs.push([values[index - 1], values[index]]);
  }
  return pairs;
}

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function standardDeviation(values: number[]) {
  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  return Math.sqrt(variance);
}

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}
