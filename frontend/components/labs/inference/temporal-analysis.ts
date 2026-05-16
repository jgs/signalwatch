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

export type EvidencePacket = {
  frameCount: number;
  framesWithDetections: number;
  emptyFrames: number;
  meanConfidence: number | null;
  minConfidence: number | null;
  maxConfidence: number | null;
  detectionDropEvents: number;
  classContinuityBreaks: number;
  observedClasses: string[];
};

export type OperationalObservation = {
  label: string;
  text: string;
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

export function buildEvidencePacket(frames: DetectionFrame[]): EvidencePacket {
  const means = frames.map((frame) => meanConfidence(frame.detections)).filter((value): value is number => value !== null);
  const pairs = pairwise(frames);
  return {
    frameCount: frames.length,
    framesWithDetections: frames.filter((frame) => frame.detections.length > 0).length,
    emptyFrames: frames.filter((frame) => frame.detections.length === 0).length,
    meanConfidence: means.length ? average(means) : null,
    minConfidence: means.length ? Math.min(...means) : null,
    maxConfidence: means.length ? Math.max(...means) : null,
    detectionDropEvents: pairs.filter(([previous, current]) => previous.detections.length > 0 && current.detections.length === 0).length,
    classContinuityBreaks: pairs.reduce((total, [previous, current]) => total + missingClasses(previous.detections, current.detections).length, 0),
    observedClasses: Array.from(new Set(frames.flatMap((frame) => frame.detections.map((detection) => detection.class)))).slice(0, 8),
  };
}

export function buildOperationalObservations(frames: DetectionFrame[]): OperationalObservation[] {
  const packet = buildEvidencePacket(frames);
  const observations: OperationalObservation[] = [];
  if (!packet.frameCount) {
    return [{ label: "waiting", text: "No inference frames have been recorded in this observation window." }];
  }
  if (packet.emptyFrames > 0) {
    observations.push({
      label: "frame integrity",
      text: `${packet.emptyFrames} empty inference frame${packet.emptyFrames === 1 ? "" : "s"} observed in the current window.`,
    });
  }
  if (packet.detectionDropEvents > 0) {
    observations.push({
      label: "detection continuity",
      text: `${packet.detectionDropEvents} transition${packet.detectionDropEvents === 1 ? "" : "s"} moved from detected objects to no detections.`,
    });
  }
  if (packet.classContinuityBreaks > 0) {
    observations.push({
      label: "class persistence",
      text: `${packet.classContinuityBreaks} class continuity break${packet.classContinuityBreaks === 1 ? "" : "s"} recorded across adjacent frames.`,
    });
  }
  if (packet.meanConfidence !== null && packet.meanConfidence < 0.45) {
    observations.push({
      label: "confidence",
      text: `Mean confidence in detected frames is ${Math.round(packet.meanConfidence * 100)}% in this window.`,
    });
  }
  if (!observations.length) {
    observations.push({
      label: "stable window",
      text: "No empty-frame or continuity-break observation has been recorded in the current window.",
    });
  }
  return observations.slice(0, 3);
}

export function observationCadence(frames: DetectionFrame[]) {
  if (frames.length < 2) return null;
  const first = frames[0].timestamp;
  const last = frames[frames.length - 1].timestamp;
  const durationSeconds = Math.max(0, (last - first) / 1000);
  const cadenceSeconds = durationSeconds / Math.max(1, frames.length - 1);
  return {
    durationSeconds,
    cadenceSeconds,
  };
}

function classOverlap(previous: Detection[], current: Detection[]) {
  const previousClasses = new Set(previous.map((detection) => detection.class));
  const currentClasses = new Set(current.map((detection) => detection.class));
  if (!previousClasses.size && !currentClasses.size) return 1;
  const intersection = [...previousClasses].filter((name) => currentClasses.has(name)).length;
  const union = new Set([...previousClasses, ...currentClasses]).size;
  return union ? intersection / union : 0;
}

function missingClasses(previous: Detection[], current: Detection[]) {
  const currentClasses = new Set(current.map((detection) => detection.class));
  return Array.from(new Set(previous.map((detection) => detection.class))).filter((name) => !currentClasses.has(name));
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
