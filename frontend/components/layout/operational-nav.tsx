import Link from "next/link";

const navGroups = [
  {
    label: "Monitor",
    key: "monitor",
    items: [
      { href: "/console", label: "Live console", key: "console" },
      { href: "/timeline", label: "Timeline", key: "timeline" },
    ],
  },
  {
    label: "Learn",
    key: "learn",
    items: [
      { href: "/learn/glossary", label: "AI basics", key: "glossary" },
      { href: "/learn/llm-training", label: "LLM guide", key: "llm-training" },
      { href: "/methodology", label: "Methodology", key: "methodology" },
      { href: "/systems", label: "Systems", key: "systems" },
    ],
  },
  {
    label: "Evaluate",
    key: "evaluate",
    items: [
      { href: "/evaluations", label: "Evaluations", key: "evaluations" },
      { href: "/safety", label: "AI safety", key: "safety" },
      { href: "/labs", label: "Labs", key: "labs" },
      { href: "/labs/perception", label: "Perception lab", key: "perception" },
      { href: "/case-studies", label: "Case studies", key: "case-studies" },
    ],
  },
];

export function OperationalNav({ active }: { active?: string }) {
  return (
    <nav className="flex flex-col gap-4 border-b border-signal-line/60 pb-4 font-mono uppercase text-signal-dim lg:flex-row lg:items-center lg:justify-between">
      <Link href="/" className="text-[0.86rem] tracking-[0.18em] text-signal-green/80 transition hover:text-signal-green">SIGNALWATCH</Link>
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        <Link
          href="/start"
          className={`border border-transparent px-3 py-2 text-[0.66rem] transition hover:border-signal-line/70 hover:text-signal-text ${
            active === "start" ? "text-signal-green/85" : ""
          }`}
        >
          Start
        </Link>
        {navGroups.map((group) => (
          <NavGroup key={group.key} group={group} active={active} />
        ))}
        <Link
          href="/market-stress"
          className={`border border-transparent px-3 py-2 text-[0.66rem] transition hover:border-signal-line/70 hover:text-signal-text ${
            active === "market-stress" ? "text-signal-green/85" : ""
          }`}
        >
          Market
        </Link>
      </div>
    </nav>
  );
}

function NavGroup({
  group,
  active,
}: {
  group: { label: string; key: string; items: Array<{ href: string; label: string; key: string }> };
  active?: string;
}) {
  const activeItem = group.items.find((item) => item.key === active);
  const isActive = Boolean(activeItem);

  return (
    <details className="group relative">
      <summary
        className={`flex cursor-pointer list-none items-center gap-2 border border-transparent px-3 py-2 text-[0.66rem] transition marker:hidden hover:border-signal-line/70 hover:text-signal-text [&::-webkit-details-marker]:hidden ${
          isActive ? "text-signal-green/85" : ""
        }`}
      >
        <span>{group.label}</span>
        {activeItem ? <span className="hidden text-[0.5rem] text-signal-dim/80 sm:inline">/ {activeItem.label}</span> : null}
      </summary>
      <div className="absolute left-0 top-full z-30 mt-2 hidden min-w-56 border border-signal-line/80 bg-[#050806]/98 p-2 shadow-console group-open:grid">
        {group.items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`block border-l px-3 py-2 text-[0.62rem] transition hover:border-signal-green/50 hover:bg-signal-panel2/70 hover:text-signal-text ${
              item.key === active ? "border-signal-green/70 text-signal-green/85" : "border-signal-line/60 text-signal-dim"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
