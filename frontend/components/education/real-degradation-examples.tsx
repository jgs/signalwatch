import { REAL_WORLD_IMAGES } from "@/lib/real-world-images";

const examples = [
  {
    imageId: "low-light-hallway",
    title: "Low light can hide ordinary detail",
    plain: "A person can still understand the scene. A vision model may lose confidence or miss objects.",
    implication: "Useful for hallway cameras, night routes, warehouses, and indoor robots.",
    condition: "darker input",
    degradedClass: "brightness-[42%] contrast-[118%] saturate-[82%]",
  },
  {
    imageId: "motion-blur",
    title: "Motion can smear object boundaries",
    plain: "Movement makes edges less clear, which can make detections jump or disappear between frames.",
    implication: "Useful for traffic scenes, handheld cameras, moving robots, and fast workspaces.",
    condition: "blurred input",
    degradedClass: "blur-[2.5px] brightness-[92%] contrast-[112%]",
  },
  {
    imageId: "cctv-camera",
    title: "Placement changes what the system can know",
    plain: "A camera angle can make important context visible, hidden, cropped, or too far away.",
    implication: "Useful for placement reviews, coverage audits, and blind-spot analysis.",
    condition: "cropped view",
    degradedClass: "scale-125 brightness-[92%] contrast-[106%]",
  },
  {
    imageId: "thermal-camera",
    title: "Sensors have their own boundaries",
    plain: "Specialized sensors can reveal one kind of signal while hiding other context the model may need.",
    implication: "Useful for thermal systems, calibration checks, and mixed-sensor deployments.",
    condition: "reduced context",
    degradedClass: "saturate-[65%] contrast-[132%] brightness-[86%]",
  },
  {
    imageId: "camera-cluster",
    title: "Coverage is never the whole scene",
    plain: "Multiple cameras can still leave gaps. The system can only reason from what the sensors actually see.",
    implication: "Useful for multi-camera monitoring, maintenance planning, and handoff between views.",
    condition: "partial coverage",
    degradedClass: "scale-110 brightness-[82%] contrast-[125%]",
  },
];

type RealDegradationExamplesProps = {
  title?: string;
  description?: string;
};

export function RealDegradationExamples({
  title = "real visual failure examples",
  description = "These examples use source-attributed photos to make robustness easier to understand. The right side is a visual degradation demonstration only; it is not a model output, confidence score, or benchmark result.",
}: RealDegradationExamplesProps) {
  return (
    <section className="console-panel p-5">
      <div className="flex flex-col justify-between gap-3 border-b border-signal-line/60 pb-3 md:flex-row md:items-center">
        <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">{title}</div>
        <div className="font-mono text-[0.58rem] uppercase text-signal-dim">source photos / visual demonstration only</div>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-signal-muted">{description}</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {examples.map((example) => {
          const image = REAL_WORLD_IMAGES.find((item) => item.id === example.imageId);
          if (!image) return null;

          return (
            <article key={example.title} className="overflow-hidden border border-signal-line bg-signal-panel">
              <div className="grid grid-cols-2 border-b border-signal-line">
                <ImageCell label="original" src={image.imageUrl} alt={image.title} />
                <ImageCell label={example.condition} src={image.imageUrl} alt={`${image.title} with visual degradation`} imageClass={example.degradedClass} />
              </div>
              <div className="p-4">
                <div className="font-mono text-[0.6rem] uppercase text-signal-green/75">{image.condition}</div>
                <h3 className="mt-2 text-base font-semibold leading-tight text-signal-text">{example.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-signal-muted">{example.plain}</p>
                <p className="mt-3 border-l border-signal-line bg-signal-panel2/52 px-3 py-2 text-xs leading-relaxed text-signal-dim">
                  Real-world implication: {example.implication}
                </p>
                <div className="mt-3 font-mono text-[0.54rem] uppercase text-signal-dim">source / {image.sourceLabel}</div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ImageCell({ label, src, alt, imageClass = "" }: { label: string; src: string; alt: string; imageClass?: string }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-signal-panel2">
      <img src={src} alt={alt} className={`h-full w-full object-cover ${imageClass}`} loading="lazy" />
      <div className="absolute left-2 top-2 bg-white/88 px-2 py-1 font-mono text-[0.5rem] uppercase text-signal-dim shadow-sm">{label}</div>
    </div>
  );
}
