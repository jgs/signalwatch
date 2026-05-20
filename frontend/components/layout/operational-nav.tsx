import Link from "next/link";

const navGroups = [
  {
    label: "operate",
    items: [
      { href: "/start", label: "start", key: "start" },
      { href: "/console", label: "console", key: "console" },
      { href: "/timeline", label: "timeline", key: "timeline" },
    ],
  },
  {
    label: "inspect",
    items: [
      { href: "/safety", label: "safety", key: "safety" },
      { href: "/evaluations", label: "evaluations", key: "evaluations" },
      { href: "/market-stress", label: "market stress", key: "market-stress" },
    ],
  },
  {
    label: "test",
    items: [
      { href: "/labs", label: "labs", key: "labs" },
      { href: "/labs/perception", label: "perception", key: "perception" },
      { href: "/case-studies", label: "case studies", key: "case-studies" },
    ],
  },
  {
    label: "learn",
    items: [
      { href: "/methodology", label: "methodology", key: "methodology" },
      { href: "/learn/glossary", label: "glossary", key: "glossary" },
      { href: "/learn/llm-training", label: "LLM guide", key: "llm-training" },
      { href: "/systems", label: "systems", key: "systems" },
    ],
  },
];

export function OperationalNav({ active }: { active?: string }) {
  return (
    <nav className="flex flex-col gap-4 border-b border-signal-line/60 pb-4 font-mono uppercase text-signal-dim lg:flex-row lg:items-start lg:justify-between">
      <Link href="/" className="text-signal-green/80 transition hover:text-signal-green">SIGNALWATCH</Link>
      <div className="flex flex-wrap gap-x-6 gap-y-3 lg:justify-end">
        {navGroups.map((group) => (
          <div key={group.label} className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[0.54rem] text-signal-dim/65">{group.label}</span>
            {group.items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`text-[0.66rem] ${item.key === active ? "text-signal-green/80 transition hover:text-signal-green" : "transition hover:text-signal-text"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
