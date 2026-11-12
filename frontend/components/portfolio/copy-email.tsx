"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "unavailable">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; if (timer.current) clearTimeout(timer.current); };
  }, []);

  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      if (!mounted.current) return;
      setState("copied");
      timer.current = setTimeout(() => setState("idle"), 2500);
    } catch {
      if (mounted.current) setState("unavailable");
    }
  }

  return <div>
    <div className="pf-contact-address"><span className="pf-address">{email}</span><button type="button" className="pf-copy-email" aria-label="Copy email address" title="Copy email address" onClick={() => void copy()}>{state === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}</button></div>
    <div className="pf-copy-feedback" role="status">{state === "copied" ? "Email copied." : state === "unavailable" ? "Copy unavailable. You can select the address above." : ""}</div>
  </div>;
}
