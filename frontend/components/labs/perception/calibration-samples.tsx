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
    detail: "road-like geometry with partial visibility",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><rect width="960" height="540" fill="#111712"/><rect x="0" y="330" width="960" height="210" fill="#1d211f"/><path d="M420 330h120l70 210H350z" fill="#2a2f2c"/><rect x="120" y="240" width="170" height="86" rx="8" fill="#55615b"/><circle cx="165" cy="334" r="24" fill="#0a0d0b"/><circle cx="250" cy="334" r="24" fill="#0a0d0b"/><rect x="650" y="205" width="52" height="125" fill="#6d756f"/><circle cx="676" cy="172" r="34" fill="#77837a"/><rect x="760" y="135" width="120" height="280" fill="#050705" opacity=".68"/><rect x="42" y="42" width="876" height="456" fill="none" stroke="#26382d" stroke-width="2"/></svg>`,
  },
  {
    id: "workspace-lowlight",
    label: "low-light workspace",
    detail: "dim indoor scene with object silhouettes",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><rect width="960" height="540" fill="#080b09"/><circle cx="740" cy="110" r="170" fill="#26382d" opacity=".35"/><rect x="150" y="310" width="660" height="36" fill="#3c443f"/><rect x="240" y="180" width="120" height="130" rx="8" fill="#66716a"/><rect x="455" y="210" width="62" height="102" rx="18" fill="#768078"/><rect x="575" y="160" width="160" height="150" rx="4" fill="#424b45"/><rect x="595" y="180" width="120" height="92" fill="#101511"/><path d="M170 346h580l70 120H100z" fill="#151a17"/><rect x="42" y="42" width="876" height="456" fill="none" stroke="#26382d" stroke-width="2"/></svg>`,
  },
  {
    id: "biomech-pose",
    label: "pose silhouette",
    detail: "movement-analysis placeholder; no joints fabricated",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><rect width="960" height="540" fill="#070a08"/><rect x="120" y="428" width="720" height="4" fill="#26382d"/><circle cx="470" cy="130" r="42" fill="#7b857d"/><path d="M462 174h52l28 124-36 116h-46l18-104-58 104h-52l82-136z" fill="#657069"/><path d="M505 205l104 48-18 38-96-34z" fill="#5c6760"/><path d="M438 218l-120 24 10 40 114-18z" fill="#5c6760"/><rect x="42" y="42" width="876" height="456" fill="none" stroke="#26382d" stroke-width="2"/></svg>`,
  },
];

export function CalibrationSamples({ onSelect }: { onSelect: (url: string, id: string) => void }) {
  return (
    <div className="grid gap-2 md:grid-cols-3">
      {samples.map((sample) => (
        <button
          key={sample.id}
          type="button"
          onClick={() => onSelect(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(sample.svg)}`, sample.id)}
          className="border border-[#101b15] bg-[#050806]/70 p-3 text-left transition hover:border-[#2f4a39]"
        >
          <div className="font-mono text-[0.6rem] uppercase text-signal-green/75">{sample.label}</div>
          <div className="mt-2 text-xs leading-relaxed text-signal-dim">{sample.detail}</div>
        </button>
      ))}
    </div>
  );
}
