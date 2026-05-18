export type PerceptionScenarioType = "low-light" | "occlusion" | "motion" | "compression" | "continuity";

export type PerceptionAssetStatus = "capture-required" | "asset-backed";

export type PerceptionDegradation = {
  blur: number;
  brightness: number;
  occlusion: number;
  noise: number;
  crop: number;
  motionBlur: number;
};

export type PerceptionDatasetSequence = {
  id: string;
  title: string;
  scenarioType: PerceptionScenarioType;
  assetStatus: PerceptionAssetStatus;
  datasetPath: string;
  frameUris: string[];
  degradationPresetId: string;
  degradation: PerceptionDegradation;
  lighting: string;
  temporalProperties: {
    targetCadenceMs: number;
    minimumFrames: number;
    observationWindowSeconds: number;
  };
  inspectionTargets: string[];
  operationalRelevance: string;
  safetyCriticalRelevance: string;
  reproducibilityLevel: "protocol" | "asset-backed";
  reproducibilityNotes: string[];
  evidenceRequirements: string[];
};

export const PERCEPTION_DATASET_SEQUENCES: PerceptionDatasetSequence[] = [
  {
    id: "low-light-hallway-protocol",
    title: "Low-light hallway sequence",
    scenarioType: "low-light",
    assetStatus: "capture-required",
    datasetPath: "/datasets/perception/low-light/",
    frameUris: [],
    degradationPresetId: "low-light",
    degradation: { blur: 1, brightness: 48, occlusion: 10, noise: 24, crop: 4, motionBlur: 1 },
    lighting: "dim indoor route or comparable low-illumination upload",
    temporalProperties: { targetCadenceMs: 820, minimumFrames: 12, observationWindowSeconds: 10 },
    inspectionTargets: ["empty inference frames", "mean confidence movement", "class disappearance under low illumination"],
    operationalRelevance: "Low illumination is common in deployed indoor monitoring paths and can hide detector failure states.",
    safetyCriticalRelevance: "A safety monitor should surface degraded visibility instead of preserving a nominal detection narrative.",
    reproducibilityLevel: "protocol",
    reproducibilityNotes: [
      "Capture or import real hallway frames before treating this as an asset-backed dataset.",
      "Do not record expected confidence values; confidence must be produced by the browser model during the run.",
    ],
    evidenceRequirements: ["observationWindow", "frames", "continuityTransitions", "degradation", "model"],
  },
  {
    id: "partial-visibility-occlusion-protocol",
    title: "Partial visibility and occlusion",
    scenarioType: "occlusion",
    assetStatus: "capture-required",
    datasetPath: "/datasets/perception/occlusion/",
    frameUris: [],
    degradationPresetId: "partial-visibility",
    degradation: { blur: 1, brightness: 92, occlusion: 42, noise: 12, crop: 26, motionBlur: 1 },
    lighting: "nominal or mixed light with a real object partially covered or cropped",
    temporalProperties: { targetCadenceMs: 820, minimumFrames: 12, observationWindowSeconds: 10 },
    inspectionTargets: ["class-loss transitions", "drop/recovery markers", "baseline-to-degraded class differences"],
    operationalRelevance: "Partial visibility can make single-frame detections look reliable while temporal continuity is unstable.",
    safetyCriticalRelevance: "Occlusion-prone environments need class continuity evidence rather than assumed object persistence.",
    reproducibilityLevel: "protocol",
    reproducibilityNotes: [
      "Use real uploaded frames or webcam input with a physical occluder.",
      "Continuity markers are class-level model-output observations, not identity tracking claims.",
    ],
    evidenceRequirements: ["continuityTransitions", "packet", "frames", "observationWindow"],
  },
  {
    id: "webcam-motion-instability-protocol",
    title: "Webcam motion instability",
    scenarioType: "motion",
    assetStatus: "capture-required",
    datasetPath: "/datasets/perception/motion/",
    frameUris: [],
    degradationPresetId: "motion-instability",
    degradation: { blur: 4, brightness: 92, occlusion: 12, noise: 16, crop: 10, motionBlur: 7 },
    lighting: "real webcam scene under operator movement or moving object input",
    temporalProperties: { targetCadenceMs: 820, minimumFrames: 16, observationWindowSeconds: 14 },
    inspectionTargets: ["cadence jitter", "confidence deltas", "temporal consistency changes"],
    operationalRelevance: "Motion pressure can expose unstable inference cadence and adjacent-frame detection volatility.",
    safetyCriticalRelevance: "Realtime systems need to know whether apparent detections survive movement and frame timing variation.",
    reproducibilityLevel: "protocol",
    reproducibilityNotes: [
      "Use webcam mode for real timestamps and inference cadence.",
      "Replay uses detection history only; no video frames are synthesized in the artifact.",
    ],
    evidenceRequirements: ["observationWindow", "cadenceJitterSeconds", "frames", "temporalTrace"],
  },
  {
    id: "compression-artifact-protocol",
    title: "Compression artifact sequence",
    scenarioType: "compression",
    assetStatus: "capture-required",
    datasetPath: "/datasets/perception/compression/",
    frameUris: [],
    degradationPresetId: "compressed-feed",
    degradation: { blur: 2, brightness: 86, occlusion: 10, noise: 58, crop: 8, motionBlur: 2 },
    lighting: "real local image or webcam feed with compression/noise stress applied before inference",
    temporalProperties: { targetCadenceMs: 820, minimumFrames: 12, observationWindowSeconds: 10 },
    inspectionTargets: ["frame integrity loss", "confidence variance", "observed class instability"],
    operationalRelevance: "Compressed feeds can make missed detections look like normal absence unless empty frames are counted.",
    safetyCriticalRelevance: "Robustness audit trails should preserve empty frames and confidence ranges under artifact pressure.",
    reproducibilityLevel: "protocol",
    reproducibilityNotes: [
      "Use a real source image or live feed; the noise transform is recorded as degradation metadata.",
      "No frame-integrity score is exported until model inference produces frames.",
    ],
    evidenceRequirements: ["packet", "emptyFrames", "minConfidence", "maxConfidence", "frames"],
  },
  {
    id: "overlap-continuity-protocol",
    title: "Overlapping object continuity",
    scenarioType: "continuity",
    assetStatus: "capture-required",
    datasetPath: "/datasets/perception/continuity/",
    frameUris: [],
    degradationPresetId: "partial-visibility",
    degradation: { blur: 1, brightness: 92, occlusion: 36, noise: 12, crop: 18, motionBlur: 2 },
    lighting: "real overlapping objects with partial visibility or crossing paths",
    temporalProperties: { targetCadenceMs: 820, minimumFrames: 16, observationWindowSeconds: 14 },
    inspectionTargets: ["class-change markers", "drop/recovery markers", "class persistence windows"],
    operationalRelevance: "Object overlap is a common source of continuity confusion in operational perception surfaces.",
    safetyCriticalRelevance: "Safety-critical monitoring should record disappearance and recovery instead of assuming persistence.",
    reproducibilityLevel: "protocol",
    reproducibilityNotes: [
      "Requires real captured overlap or imported sequence frames before it becomes asset-backed.",
      "Class continuity is derived from emitted classes only and does not claim object identity tracking.",
    ],
    evidenceRequirements: ["continuityTransitions", "frames", "operationalObservations", "observationWindow"],
  },
];

export function getPerceptionDatasetSequence(id: string | null | undefined) {
  return PERCEPTION_DATASET_SEQUENCES.find((sequence) => sequence.id === id) ?? null;
}

export function perceptionDatasetSummary() {
  const assetBacked = PERCEPTION_DATASET_SEQUENCES.filter((sequence) => sequence.assetStatus === "asset-backed").length;
  return {
    total: PERCEPTION_DATASET_SEQUENCES.length,
    assetBacked,
    captureRequired: PERCEPTION_DATASET_SEQUENCES.length - assetBacked,
  };
}
