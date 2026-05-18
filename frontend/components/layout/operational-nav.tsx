import Link from "next/link";

const navItems = [
  { href: "/start", label: "start", key: "start" },
  { href: "/console", label: "console", key: "console" },
  { href: "/safety", label: "safety", key: "safety" },
  { href: "/evaluations", label: "evaluations", key: "evaluations" },
  { href: "/labs", label: "labs", key: "labs" },
  { href: "/labs/perception", label: "perception", key: "perception" },
  { href: "/case-studies", label: "case studies", key: "case-studies" },
  { href: "/methodology", label: "methodology", key: "methodology" },
  { href: "/learn/glossary", label: "glossary", key: "glossary" },
  { href: "/learn/llm-training", label: "LLM guide", key: "llm-training" },
  { href: "/timeline", label: "timeline", key: "timeline" },
  { href: "/systems", label: "systems", key: "systems" },
];

export function OperationalNav({ active }: { active?: string }) {
  return (
    <nav className="flex flex-col gap-4 border-b border-signal-line/60 pb-4 font-mono text-[0.68rem] uppercase text-signal-dim md:flex-row md:items-center md:justify-between">
      <Link href="/" className="text-signal-green/80 transition hover:text-signal-green">SIGNALWATCH</Link>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={item.key === active ? "text-signal-green/80 transition hover:text-signal-green" : "transition hover:text-signal-text"}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
