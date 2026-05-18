import { Braces, FileJson } from "lucide-react";

const packetRows = [
  ["schema", "signalwatch.perception.evidence.v1"],
  ["generatedAt", "set when a real run is exported"],
  ["model", "browser-side COCO-SSD when loaded"],
  ["inferenceBoundary", "local browser inference only"],
  ["observationWindow", "derived from actual frame timestamps"],
  ["frames", "empty until frames are observed"],
  ["detections", "empty until model emits detections"],
  ["continuityTransitions", "computed from emitted class history"],
];

const packetShape = `{
  "schema": "signalwatch.perception.evidence.v1",
  "generatedAt": "<real export timestamp>",
  "model": "<loaded browser model>",
  "inferenceBoundary": "real outputs only",
  "frames": [],
  "detections": [],
  "continuityTransitions": []
}`;

export function EvidencePacketPreview({ title = "evidence packet preview" }: { title?: string }) {
  return (
    <section className="console-panel p-5">
      <div className="flex flex-col justify-between gap-3 border-b border-signal-line/60 pb-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase text-signal-green/80">
          <FileJson className="h-3.5 w-3.5" />
          {title}
        </div>
        <div className="font-mono text-[0.58rem] uppercase text-signal-dim">schema preview / values require real run</div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[.95fr_1.05fr]">
        <div className="grid gap-2">
          {packetRows.map(([field, rule]) => (
            <div key={field} className="grid grid-cols-[9.5rem_1fr] gap-3 border-l border-[#24392c] bg-[#050806]/62 px-3 py-2">
              <div className="font-mono text-[0.58rem] uppercase text-signal-green/72">{field}</div>
              <div className="text-sm leading-relaxed text-signal-muted">{rule}</div>
            </div>
          ))}
        </div>
        <div className="relative overflow-hidden border border-[#101b15] bg-[#030503] p-4">
          <div className="mb-3 flex items-center gap-2 border-b border-[#101b15] pb-3 font-mono text-[0.58rem] uppercase text-signal-dim">
            <Braces className="h-3.5 w-3.5 text-signal-green/70" />
            non-populated export shape
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[0.68rem] leading-relaxed text-signal-muted">
            {packetShape}
          </pre>
        </div>
      </div>
    </section>
  );
}
