"use client";

export type WebcamState = "idle" | "requesting" | "active" | "blocked" | "unsupported";

export function WebcamStatus({ state, message }: { state: WebcamState; message?: string }) {
  return (
    <div className="border border-signal-line bg-signal-panel/70 p-3 font-mono text-[0.62rem] uppercase text-signal-dim">
      <div className="flex items-center justify-between gap-3">
        <span>webcam route</span>
        <span className={state === "active" ? "text-signal-green/80" : "text-signal-dim"}>{state}</span>
      </div>
      {message ? <div className="mt-2 normal-case leading-relaxed text-signal-muted">{message}</div> : null}
    </div>
  );
}
