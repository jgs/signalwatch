"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { InputFrame } from "@/lib/input-controls";

const bones = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
export type PointerSignal = { x: number; y: number; at: number };

export function InputField({ pointer, landmarks, camera, paused }: {
  pointer: RefObject<PointerSignal>; landmarks: RefObject<InputFrame | null>; camera: boolean; paused: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const surface = canvas.current;
    const context = surface?.getContext("2d");
    if (!surface || !context) return;
    let width = 1, height = 1, raf = 0, last = 0, visible = true;
    let previousFrame: InputFrame | null = null, previousPointer: PointerSignal | null = null, previousCrosshair = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const draw = (now: number, force = false) => {
      const p = pointer.current;
      const sample = landmarks.current;
      const current = camera && sample?.hands.length && now - sample.at < 350 ? sample : null;
      const crosshair = !camera && now - p.at < 1800;
      if (!force && current === previousFrame && p === previousPointer && crosshair === previousCrosshair) return;
      previousFrame = current; previousPointer = p; previousCrosshair = crosshair;
      context.clearRect(0, 0, width, height);
      let renderedLandmarks = 0;
      const px = p.x * width, py = p.y * height;
      // This field is decorative geometry; only hand landmarks are model output.
      const bend = (px - width / 2) * .25;
      for (const strong of camera ? [false] : [false, true]) {
        context.beginPath();
        for (let line = 0; line < 30; line++) {
          if (!camera && (line % 5 === 0) !== strong) continue;
          const base = (line / 29) * width;
          context.moveTo(base, -40);
          context.bezierCurveTo(base + bend, height * .25, width - base - bend, height * .7, width - base, height + 40);
        }
        context.strokeStyle = `rgba(168,194,159,${camera ? .035 : strong ? .17 : .065})`;
        context.lineWidth = 1;
        context.stroke();
      }
      const frame = current;
      if (frame) {
        const scale = Math.min(width / frame.width, height / frame.height);
        const ox = (width - frame.width * scale) / 2, oy = (height - frame.height * scale) / 2;
        context.save(); context.translate(width, 0); context.scale(-1, 1);
        frame.hands.forEach((hand, handIndex) => {
          const valid = (index: number) => hand[index] && Number.isFinite(hand[index].x) && Number.isFinite(hand[index].y);
          context.strokeStyle = handIndex === 0 ? "#c0d2a3" : "#91b5c9"; context.lineWidth = 2;
          context.beginPath();
          for (const [a, b] of bones) {
            if (!valid(a) || !valid(b)) continue;
            context.moveTo(hand[a].x * scale + ox, hand[a].y * scale + oy); context.lineTo(hand[b].x * scale + ox, hand[b].y * scale + oy);
          }
          context.stroke();
          hand.forEach((point, index) => {
            if (!valid(index)) return;
            context.fillStyle = [4,8,12,16,20].includes(index) ? "#e4c78c" : "#eaf0e7";
            context.fillRect(point.x * scale + ox - 3, point.y * scale + oy - 3, 6, 6);
            renderedLandmarks++;
          });
        });
        context.restore();
      } else if (crosshair) {
        context.strokeStyle = "#e4c78c"; context.lineWidth = 1;
        context.beginPath(); context.moveTo(px - 16, py); context.lineTo(px + 16, py); context.moveTo(px, py - 16); context.lineTo(px, py + 16); context.stroke();
      }
      const count = String(renderedLandmarks);
      if (surface.dataset.renderedLandmarks !== count) surface.dataset.renderedLandmarks = count;
    };
    const frame = (now: number) => {
      if (now - last > 32) { draw(now); last = now; }
      if (visible && !document.hidden && !paused) raf = requestAnimationFrame(frame);
    };
    const sync = () => { cancelAnimationFrame(raf); draw(performance.now(), true); if (visible && !document.hidden && !paused) raf = requestAnimationFrame(frame); };
    const resize = () => {
      const bounds = surface.getBoundingClientRect(); width = bounds.width; height = bounds.height;
      const ratio = Math.min(devicePixelRatio || 1, 2); surface.width = width * ratio; surface.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0); sync();
    };
    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; sync(); });
    observer.observe(surface); intersection.observe(surface); document.addEventListener("visibilitychange", sync); reduced.addEventListener("change", sync); resize();
    return () => { cancelAnimationFrame(raf); observer.disconnect(); intersection.disconnect(); document.removeEventListener("visibilitychange", sync); reduced.removeEventListener("change", sync); };
  }, [camera, paused, pointer, landmarks]);
  return <canvas ref={canvas} className="ix-field" data-rendered-landmarks="0" aria-hidden="true" />;
}
