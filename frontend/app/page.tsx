import Link from "next/link";
import { ArrowDown, ArrowUpRight, Eye, Hand, ScanLine } from "lucide-react";
import { PortfolioNav, PortfolioFooter } from "@/components/portfolio/shell";
import { KineticField } from "@/components/portfolio/kinetic-field";
import { WorkIndex } from "@/components/portfolio/work-index";
import { profile } from "@/lib/portfolio";

export default function PortfolioPage() {
  return (
    <main className="portfolio">
      <a href="#work" className="pf-skip">Skip to selected work</a>
      <PortfolioNav />
      <section className="pf-hero">
        <KineticField />
        <div className="pf-hero-content">
          <div className="pf-hero-kicker"><span>Intelligent systems engineering student</span><span>Code / Vision / Systems</span></div>
          <h1><span>Anxo</span><span>Fandi&#241;o<span className="pf-star" aria-hidden="true">*</span></span></h1>
          <div className="pf-hero-bottom">
            <p>Computer vision, human movement,<br />and the systems behind them.</p>
            <a href="#work" className="pf-work-link">Explore my work <ArrowDown size={20} aria-hidden="true" /></a>
            <span className="pf-hero-note">Built with curiosity.<br />Shared with context.</span>
          </div>
        </div>
      </section>
      <WorkIndex />
      <section className="pf-explorations" id="explorations" aria-labelledby="explorations-title">
        <div className="pf-section-heading">
          <div><span className="pf-section-label">02 / Beyond the project page</span><h2 id="explorations-title">A closer look.</h2></div>
          <p className="pf-exploration-intro">Movement, perception, and the questions in between.</p>
        </div>
        <div className="pf-exploration-links">
          <a href="#movement-study" className="pf-exploration-link">
            <ScanLine size={24} aria-hidden="true" />
            <div><h3>Movement study</h3><p>The anatomy behind three familiar lifts.</p><span>Educational illustration / not measured activation</span></div>
            <ArrowUpRight size={24} aria-hidden="true" />
          </a>
          <Link href="/labs/perception" className="pf-exploration-link">
            <Eye size={24} aria-hidden="true" />
            <div><h3>Perception lab</h3><p>What changes when an image becomes harder to see?</p><span>Browser inference / model availability required</span></div>
            <ArrowUpRight size={24} aria-hidden="true" />
          </Link>
          <Link href="/input" className="pf-exploration-link">
            <Hand size={24} aria-hidden="true" />
            <div><h3>You&apos;re the input</h3><p>A portfolio experiment in hand-controlled navigation.</p><span>Camera optional / browser-side tracking</span></div>
            <ArrowUpRight size={24} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section className="pf-intro" id="about">
        <div className="pf-section-label">03 / The person behind the projects</div>
        <div>
          <h2>Curious about how<br />things <em>actually work.</em></h2>
          <p>I&apos;m {profile.name}, an Intelligent Systems Engineering student at Universidad Intercontinental de la Empresa. My projects bring together computer vision, human movement, and the systems that make software useful.</p>
          <p>I like following a problem from its first question to its working interface: the model, the data, the code, and how someone experiences the result.</p>
          <Link href="/about" className="pf-text-link">A little more about me <ArrowUpRight size={19} /></Link>
        </div>
      </section>
      <PortfolioFooter />
    </main>
  );
}
