"use client";

export type CalibrationSample = {
  id: string;
  label: string;
  detail: string;
  svg: string;
};

const samples: CalibrationSample[] = [
  {
    id: "street-occlusion",
    label: "street occlusion",
    detail: "synthetic geometry fixture; not dataset evidence",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><rect width="960" height="540" fill="#f4f7f2"/><rect x="0" y="330" width="960" height="210" fill="#e8eee8"/><path d="M420 330h120l70 210H350z" fill="#cdd8cf"/><rect x="120" y="240" width="170" height="86" rx="8" fill="#8ca095"/><circle cx="165" cy="334" r="24" fill="#526057"/><circle cx="250" cy="334" r="24" fill="#526057"/><rect x="650" y="205" width="52" height="125" fill="#8fa199"/><circle cx="676" cy="172" r="34" fill="#9caf9f"/><rect x="760" y="135" width="120" height="280" fill="#748176" opacity=".42"/><rect x="42" y="42" width="876" height="456" fill="none" stroke="#c6d0c8" stroke-width="2"/></svg>`,
  },
  {
    id: "workspace-lowlight",
    label: "low-light workspace",
    detail: "synthetic geometry fixture; not dataset evidence",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><rect width="960" height="540" fill="#eef3ee"/><circle cx="740" cy="110" r="170" fill="#c9d8cc" opacity=".72"/><rect x="150" y="310" width="660" height="36" fill="#b8c5bc"/><rect x="240" y="180" width="120" height="130" rx="8" fill="#8fa199"/><rect x="455" y="210" width="62" height="102" rx="18" fill="#9caf9f"/><rect x="575" y="160" width="160" height="150" rx="4" fill="#a8b8ad"/><rect x="595" y="180" width="120" height="92" fill="#f6f8f4"/><path d="M170 346h580l70 120H100z" fill="#d7dfd8"/><rect x="42" y="42" width="876" height="456" fill="none" stroke="#c6d0c8" stroke-width="2"/></svg>`,
  },
  {
    id: "biomech-pose",
    label: "pose silhouette",
    detail: "synthetic geometry fixture; no joints fabricated",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><rect width="960" height="540" fill="#f4f7f2"/><rect x="120" y="428" width="720" height="4" fill="#c6d0c8"/><circle cx="470" cy="130" r="42" fill="#9caf9f"/><path d="M462 174h52l28 124-36 116h-46l18-104-58 104h-52l82-136z" fill="#748176"/><path d="M505 205l104 48-18 38-96-34z" fill="#6f7d73"/><path d="M438 218l-120 24 10 40 114-18z" fill="#6f7d73"/><rect x="42" y="42" width="876" height="456" fill="none" stroke="#c6d0c8" stroke-width="2"/></svg>`,
  },
];

export function CalibrationSamples({ onSelect }: { onSelect: (url: string, id: string) => void }) {
  return (
    <div className="space-y-2">
      <div className="font-mono text-[0.58rem] uppercase text-signal-dim">
        calibration fixtures / synthetic geometry only / excluded from dataset registry
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        {samples.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => onSelect(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(sample.svg)}`, sample.id)}
            className="border border-signal-line bg-signal-panel/70 p-3 text-left transition hover:border-signal-green/45"
          >
            <div className="font-mono text-[0.6rem] uppercase text-signal-green/75">{sample.label}</div>
            <div className="mt-2 text-xs leading-relaxed text-signal-dim">{sample.detail}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
