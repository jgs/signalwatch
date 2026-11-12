import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { PortfolioNav, PortfolioFooter } from "@/components/portfolio/shell";
import { ProjectVisual } from "@/components/portfolio/work-index";
import { projects } from "@/lib/portfolio";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const project = projects.find(item => item.slug === slug);
  return { title: project?.name ?? "Project", description: project?.description };
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const sequential = project.slug !== "signalwatch";
  const FlowList = sequential ? "ol" : "ul";
  return (
    <main className="portfolio">
      <PortfolioNav />
      <section className="pf-case">
        <Link href="/#work" className="pf-text-link"><ArrowLeft size={16} /> Selected work</Link>
        <header>
          <span className="pf-section-label">{project.number} / {project.category}</span>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <div className="pf-tags">{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div>
        </header>
        <ProjectVisual project={project} />
        <section className="pf-case-flow" aria-labelledby="workflow-title">
          <span className="pf-section-label">{sequential ? "One documented workflow" : "Project components"}</span>
          <h2 id="workflow-title">{sequential ? "From input to output." : "Inside the system."}</h2>
          <FlowList>{project.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>{sequential && index < project.steps.length - 1 ? <ArrowRight size={16} aria-hidden="true" /> : null}</li>)}</FlowList>
        </section>
        <div className="pf-case-body">
          <div><span className="pf-section-label">The question</span><h2>{project.question}</h2></div>
          <div>
            <h3>The approach</h3><p>{project.approach}</p>
            <h3>Scope &amp; limitations</h3><p>{project.boundary}</p>
            <div className="pf-case-actions">
              <a href={project.repo} target="_blank" rel="noopener noreferrer" className="pf-text-link">Read the repository <ArrowUpRight size={18} /></a>
              {project.action ? <Link href={project.action.href} className="pf-text-link">{project.action.label}<ArrowUpRight size={18} /></Link> : null}
            </div>
          </div>
        </div>
        <Link className="pf-next-project" href={`/work/${next.slug}`}><span className="pf-section-label">Next project</span><strong>{next.name}</strong><ArrowUpRight size={32} /></Link>
      </section>
      <PortfolioFooter />
    </main>
  );
}
