"use client";

export type DegradationState = {
  blur: number;
  brightness: number;
  occlusion: number;
  noise: number;
  crop: number;
  motionBlur: number;
};

export function DegradationControls({
  value,
  onChange,
}: {
  value: DegradationState;
  onChange: (value: DegradationState) => void;
}) {
  return (
    <div className="space-y-4">
      <Control label="blur" value={value.blur} setValue={(blur) => onChange({ ...value, blur })} max={8} />
      <Control label="low light" value={value.brightness} setValue={(brightness) => onChange({ ...value, brightness })} min={35} max={120} />
      <Control label="occlusion" value={value.occlusion} setValue={(occlusion) => onChange({ ...value, occlusion })} max={52} />
      <Control label="compression/noise" value={value.noise} setValue={(noise) => onChange({ ...value, noise })} max={80} />
      <Control label="crop instability" value={value.crop} setValue={(crop) => onChange({ ...value, crop })} max={38} />
      <Control label="motion blur" value={value.motionBlur} setValue={(motionBlur) => onChange({ ...value, motionBlur })} max={8} />
    </div>
  );
}

function Control({ label, value, setValue, min = 0, max = 100 }: { label: string; value: number; setValue: (value: number) => void; min?: number; max?: number }) {
  return (
    <label className="block font-mono text-[0.68rem] uppercase text-signal-dim">
      <div className="mb-2 flex justify-between">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input className="w-full accent-[#89e3ad]" type="range" min={min} max={max} value={value} onChange={(event) => setValue(Number(event.target.value))} />
    </label>
  );
}
