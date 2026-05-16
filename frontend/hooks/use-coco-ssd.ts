"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ObjectDetection } from "@tensorflow-models/coco-ssd";

export type Detection = {
  bbox: [number, number, number, number];
  class: string;
  score: number;
};

export type ModelState = "idle" | "loading" | "ready" | "unavailable" | "error";

export function useCocoSsd() {
  const modelRef = useRef<ObjectDetection | null>(null);
  const [state, setState] = useState<ModelState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadModel() {
      try {
        setState("loading");
        await import("@tensorflow/tfjs");
        const cocoSsd = await import("@tensorflow-models/coco-ssd");
        const model = await cocoSsd.load({ base: "lite_mobilenet_v2" });
        if (cancelled) return;
        modelRef.current = model;
        setState("ready");
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "model load failed");
        setState("error");
      }
    }

    loadModel();
    return () => {
      cancelled = true;
    };
  }, []);

  const detect = useCallback(async (image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<Detection[]> => {
    if (!modelRef.current) return [];
    const predictions = await modelRef.current.detect(image);
    return predictions.map((prediction) => ({
      bbox: prediction.bbox as [number, number, number, number],
      class: prediction.class,
      score: prediction.score,
    }));
  }, []);

  return { state, error, detect };
}
