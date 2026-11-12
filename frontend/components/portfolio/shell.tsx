import Link from "next/link";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { profile } from "@/lib/portfolio";
import { CopyEmail } from "./copy-email";

export function PortfolioNav() {
  return (
    <header className="pf-nav-frame"><nav className="pf-nav" aria-label="Portfolio navigation">
      <Link href="/" className="pf-signature" aria-label="Anxo Fandiño home">af<span aria-hidden="true">*</span></Link>
      <div className="pf-nav-links"><Link href="/#work">Work</Link><Link href="/#movement-study">Study</Link><Link href="/about">About me</Link><Link href="/#contact">Contact <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
    </nav></header>
  );
}

export function PortfolioFooter() {
  return (
    <footer className="pf-footer" id="contact">
      <div className="pf-section-label">Have something in mind?</div>
      <h2>Let&apos;s make<br />something <em>work.</em></h2>
      <p>Questions about a project, an engineering problem, or a collaboration.</p>
      <a className="pf-email" href="/about#contact-details">Get in touch <ArrowUpRight aria-hidden="true" /></a>
      <div id="contact-details" className="pf-contact-details"><span>Email</span><CopyEmail email={profile.email} /></div>
      <div className="pf-footer-bottom"><span>{profile.name}</span><div><a href={profile.github} target="_blank" rel="noopener noreferrer"><Github size={16} aria-hidden="true" /> GitHub</a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={16} aria-hidden="true" /> LinkedIn</a><a href={profile.twitter} target="_blank" rel="noopener noreferrer">X <ArrowUpRight size={14} aria-hidden="true" /></a></div><Link href="/signalwatch">Explore SIGNALWATCH <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
    </footer>
  );
}
