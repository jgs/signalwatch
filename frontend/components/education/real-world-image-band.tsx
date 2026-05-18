import { ExternalLink } from "lucide-react";
import { REAL_WORLD_IMAGES, type RealWorldImage } from "@/lib/real-world-images";
import { VisualProvenanceStrip } from "@/components/education/visual-provenance-strip";

type RealWorldImageBandProps = {
  compact?: boolean;
  ids?: string[];
  title?: string;
  description?: string;
};

export function RealWorldImageBand({
  compact = false,
  ids,
  title = "real-world visual context",
  description = "These images show the kinds of real-world conditions SIGNALWATCH is designed to explain: low light, camera deployment, motion blur, sensor boundaries, and human monitoring. They are source-attributed visual context, not detections or evaluation results.",
}: RealWorldImageBandProps) {
  const selectedImages = ids
    ? ids.map((id) => REAL_WORLD_IMAGES.find((image) => image.id === id)).filter((image): image is RealWorldImage => Boolean(image))
    : REAL_WORLD_IMAGES;
  const images = compact ? selectedImages.slice(0, 3) : selectedImages;

  return (
    <section className="console-panel p-5">
      <div className="flex flex-col justify-between gap-3 border-b border-signal-line/60 pb-3 md:flex-row md:items-center">
        <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">{title}</div>
        <div className="font-mono text-[0.58rem] uppercase text-signal-dim">illustrative photos / not model evidence</div>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-signal-muted">
        {description}
      </p>
      <div className="mt-4">
        <VisualProvenanceStrip compact />
      </div>
      <div className={`mt-5 grid gap-3 ${compact ? "md:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-4"}`}>
        {images.map((image) => (
          <article key={image.id} className="overflow-hidden border border-signal-line/70 bg-signal-panel2/52">
            <img src={image.imageUrl} alt={image.title} className="aspect-[4/3] w-full object-cover opacity-90 grayscale-[18%]" loading="lazy" />
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="font-mono text-[0.6rem] uppercase text-signal-green/75">{image.title}</div>
                <div className="shrink-0 border border-signal-line/70 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase text-signal-dim">{image.condition}</div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-signal-muted">{image.context}</p>
              <a href={image.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 font-mono text-[0.54rem] uppercase text-signal-dim transition hover:text-signal-text">
                <ExternalLink className="h-3 w-3" />
                Fuente: {image.sourceLabel}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
