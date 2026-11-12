"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export function KineticField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const phase = useRef(0);
  const pointer = useRef({ x: -1000, y: -1000 });
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const surface = canvas.parentElement;
    if (!surface) return;
    let width = 1, height = 1, frame = 0, visible = false;
    let previous = performance.now();
    setReducedMotion(reduced.matches);
    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (let x = 12; x < width; x += 28) {
        for (let y = 12; y < height; y += 28) {
          const distance = Math.hypot(x - pointer.current.x, y - pointer.current.y);
          const influence = reduced.matches ? 0 : Math.max(0, 1 - distance / 180);
          const wave = Math.sin(x * .012 + y * .009 + phase.current) * .5 + .5;
          const length = 3 + wave * 11 + influence * 18;
          context.strokeStyle = influence > .1 ? "rgba(191,213,150,.65)" : `rgba(153,171,157,${.08 + wave * .17})`;
          context.lineWidth = 1; context.beginPath();
          context.moveTo(x - length / 2, y + length / 2); context.lineTo(x + length / 2, y - length / 2); context.stroke();
        }
      }
    };
    const canAnimate = () => !paused && !reduced.matches && visible && !document.hidden;
    const animate = (now: number) => {
      if (!canAnimate()) { frame = 0; return; }
      if (now - previous >= 32) {
        phase.current += Math.min((now - previous) / 1000, .1) * .18;
        previous = now;
        draw();
      }
      frame = requestAnimationFrame(animate);
    };
    const synchronize = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = performance.now();
      draw();
      if (canAnimate()) frame = requestAnimationFrame(animate);
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect(); width = bounds.width; height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0); draw();
    };
    const move = (event: PointerEvent) => {
      if (!canAnimate()) return;
      const bounds = canvas.getBoundingClientRect();
      pointer.current.x = event.clientX - bounds.left;
      pointer.current.y = event.clientY - bounds.top;
    };
    const reset = () => { pointer.current.x = -1000; pointer.current.y = -1000; };
    const change = () => { setReducedMotion(reduced.matches); synchronize(); };
    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; synchronize(); });
    observer.observe(canvas); intersection.observe(canvas); resize();
    surface.addEventListener("pointermove", move); surface.addEventListener("pointerleave", reset);
    reduced.addEventListener("change", change); document.addEventListener("visibilitychange", synchronize);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
      surface.removeEventListener("pointermove", move); surface.removeEventListener("pointerleave", reset);
      reduced.removeEventListener("change", change); document.removeEventListener("visibilitychange", synchronize);
    };
  }, [paused]);
  const label = reducedMotion ? "Background motion disabled by reduced-motion preference" : paused ? "Resume background motion" : "Pause background motion";
  return <>
    <canvas ref={ref} className="pf-field" aria-hidden="true" />
    <button className="pf-motion-toggle" disabled={reducedMotion} aria-label={label} title={label} onClick={() => setPaused(value => !value)}>{paused || reducedMotion ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}</button>
  </>;
}
