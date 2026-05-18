import { ExternalLink } from "lucide-react";
import { REAL_WORLD_IMAGES } from "@/lib/real-world-images";

export function RealWorldImageBand({ compact = false }: { compact?: boolean }) {
  const images = compact ? REAL_WORLD_IMAGES.slice(0, 3) : REAL_WORLD_IMAGES;

  return (
    <section className="console-panel p-5">
      <div className="flex flex-col justify-between gap-3 border-b border-signal-line/60 pb-3 md:flex-row md:items-center">
        <div className="font-mono text-[0.68rem] uppercase text-signal-green/80">real-world visual context</div>
        <div className="font-mono text-[0.58rem] uppercase text-signal-dim">illustrative photos / not model evidence</div>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-signal-muted">
        These images show the kinds of real-world conditions SIGNALWATCH is designed to explain: low light, camera deployment, motion blur, and human monitoring. They are source-attributed visual context, not detections or evaluation results.
      </p>
      <div className={`mt-5 grid gap-3 ${compact ? "md:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-4"}`}>
        {images.map((image) => (
          <article key={image.id} className="overflow-hidden border border-signal-line/70 bg-signal-panel2/52">
            <img src={image.imageUrl} alt={image.title} className="aspect-[4/3] w-full object-cover opacity-90 grayscale-[18%]" loading="lazy" />
            <div className="p-3">
              <div className="font-mono text-[0.6rem] uppercase text-signal-green/75">{image.title}</div>
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
