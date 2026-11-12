import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PortfolioNav, PortfolioFooter } from "@/components/portfolio/shell";
import { profile } from "@/lib/portfolio";

export const metadata: Metadata = { title: "About me", description: "Anxo Fandiño: Intelligent Systems Engineering student building projects across computer vision, movement analysis, and operational software." };

export default function AboutPage() {
  return <main className="portfolio"><div className="pf-dark-header"><PortfolioNav /></div><section className="pf-about-page"><span className="pf-section-label">About me</span><h1>Anxo Fandi&#241;o.<br /><em>Always curious.</em></h1><div className="pf-about-body"><h2>From a camera frame<br />to a working system.</h2><div><p>I study Intelligent Systems Engineering at Universidad Intercontinental de la Empresa. I build projects to explore how software can interpret movement, process visual information, and make system behavior easier to understand.</p><p>That has taken me from squat analysis and barbell tracking to source monitoring and perception experiments. The common thread is the whole process: finding a question, building something, then making its behavior and limitations inspectable.</p><p>My work spans Python, OpenCV, FastAPI, Next.js, WebSockets, and Docker. Each project is a chance to connect the parts and explain the decisions behind them.</p><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="pf-text-link">My background on LinkedIn <ArrowUpRight size={18} /></a></div></div><div className="pf-about-interests"><span className="pf-section-label">Areas I explore</span><ul><li>Computer vision</li><li>Movement &amp; biomechanics</li><li>Real-time systems</li><li>Interfaces &amp; observability</li></ul><Link href="/#work" className="pf-text-link">See the projects <ArrowUpRight size={18} /></Link></div></section><PortfolioFooter /></main>;
}
