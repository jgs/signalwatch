"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowUpRight, Github, Grid2X2, List, Pause, Play } from "lucide-react";
import { projects, type PortfolioProject } from "@/lib/portfolio";
import { MovementStudy } from "./movement-study";

export function ProjectVisual({ project }: { project: PortfolioProject }) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  if (project.slug === "squat-judge") return <MovementStudy />;

  const source = playing ? project.image : project.poster ?? project.image;
  return (
    <div className={`pf-project-visual pf-visual-${project.slug}`}>
      {source && !failed ? (
        <img src={source} alt={project.imageAlt} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="pf-project-type">
          <span>{project.category}</span>
          <strong>{project.name}</strong>
          <span role="status">Preview unavailable. Open the repository for the original.</span>
        </div>
      )}
      {project.slug === "barpath-ai" && !failed ? (
        <button
          className="pf-preview-control"
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? "Stop recorded BarPath demo" : "Play recorded BarPath demo"}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
          {playing ? "Stop demo" : "Play recorded demo"}
        </button>
      ) : null}
      <span className="pf-media-label">
        {failed ? "Project preview unavailable" : project.poster && !playing ? "Still from the recorded project demo" : project.mediaLabel}
      </span>
    </div>
  );
}

export function WorkIndex() {
  const [view, setView] = useState<"gallery" | "index">("gallery");
  return (
    <section id="work" className="pf-work" tabIndex={-1} aria-labelledby="work-title">
      <div className="pf-work-heading">
      <div className="pf-section-heading">
        <div>
          <span className="pf-section-label">01 / A selection of things I build</span>
          <h2 id="work-title">Selected work<span className="pf-count"> / {String(projects.length).padStart(2, "0")}</span></h2>
        </div>
        <div className="pf-view-switch" role="group" aria-label="Project layout">
          <button aria-label="Gallery view" title="Gallery view" aria-pressed={view === "gallery"} onClick={() => setView("gallery")}><Grid2X2 size={18} /></button>
          <button aria-label="Index view" title="Index view" aria-pressed={view === "index"} onClick={() => setView("index")}><List size={20} /></button>
        </div>
      </div>
      </div>
      <div className="pf-work-inner">
      {view === "gallery" ? <nav className="pf-project-directory" aria-label="Jump to a project">
        {projects.map(project => <a key={project.slug} href={`#project-${project.slug}`}><span>{project.number}</span><strong>{project.name}</strong><ArrowDown size={16} aria-hidden="true" /></a>)}
      </nav> : null}
      <div className={`pf-projects pf-projects-${view}`}>
        {projects.map(project => (
          <article id={`project-${project.slug}`} className={`pf-project pf-project-${project.slug} ${project.slug === "squat-judge" ? "pf-project-study" : ""}`} key={project.slug}>
            <div className="pf-project-top">
              <span>{project.number} / {project.category}</span>
              <Link href={`/work/${project.slug}`} aria-label={`Read about ${project.name}`}><ArrowUpRight size={22} /></Link>
            </div>
            <div className="pf-project-content">
              <div className="pf-project-copy">
                <div className="pf-project-title">
                  <Link href={`/work/${project.slug}`}><h3>{project.name}<ArrowUpRight size={24} /></h3></Link>
                  <p>{project.summary}</p>
                </div>
                <div className="pf-project-context">
                  <p>{project.description}</p>
                  <div className="pf-tags">{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div>
                  <div className="pf-project-actions">
                    <Link href={`/work/${project.slug}`} aria-label={`Inside the ${project.name} project`}>Inside the project <ArrowUpRight size={15} aria-hidden="true" /></Link>
                    <a href={project.repo} aria-label={`Source code for ${project.name}`} target="_blank" rel="noopener noreferrer"><Github size={15} aria-hidden="true" /> Source code</a>
                  </div>
                </div>
              </div>
              {view === "gallery" ? <div id={project.slug === "squat-judge" ? "movement-study" : undefined} className="pf-project-preview"><ProjectVisual project={project} /></div> : project.slug === "squat-judge" ? (
                <div id="movement-study" className="pf-study-shortcut">
                  <button onClick={() => {
                    setView("gallery");
                    requestAnimationFrame(() => document.getElementById("movement-study")?.scrollIntoView({ block: "start" }));
                  }}>Open movement study <ArrowUpRight size={15} aria-hidden="true" /></button>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
