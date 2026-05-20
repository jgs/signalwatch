import { Braces, FileJson } from "lucide-react";
import { OperationalSection } from "@/components/layout/operational-section";

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
    <OperationalSection title={title} meta="schema preview / values require real run" icon={FileJson}>
      <div className="grid gap-5 lg:grid-cols-[.95fr_1.05fr]">
        <div className="grid gap-2">
          {packetRows.map(([field, rule]) => (
            <div key={field} className="grid gap-1 border-l border-signal-green/40 bg-signal-panel/62 px-3 py-2 sm:grid-cols-[9.5rem_1fr] sm:gap-3">
              <div className="font-mono text-[0.58rem] uppercase text-signal-green/72">{field}</div>
              <div className="text-sm leading-relaxed text-signal-muted">{rule}</div>
            </div>
          ))}
        </div>
        <div className="relative overflow-hidden border border-signal-line bg-[#030503] p-4">
          <div className="mb-3 flex items-center gap-2 border-b border-signal-line pb-3 font-mono text-[0.58rem] uppercase text-signal-dim">
            <Braces className="h-3.5 w-3.5 text-signal-green/70" />
            non-populated export shape
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-[0.62rem] leading-relaxed text-signal-muted sm:text-[0.68rem]">
            {packetShape}
          </pre>
        </div>
      </div>
    </OperationalSection>
  );
}
