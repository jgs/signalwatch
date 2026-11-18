"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { advanceHold, cursorPosition, emptyHold, gestureFrameReady, handControl, handPointer, readPalms, scrollVelocity, smoothControl, stableProjectAt, type ControlPoint, type InputFrame } from "@/lib/input-controls";
import { advanceHandGesture, emptyHandGesture } from "@/lib/hand-gestures";

type Options = {
  active: boolean;
  selected: number;
  onSelect: (index: number) => void;
  motionEnabled: boolean;
  zoom: number;
  onZoom: (zoom: number) => void;
  onClap: () => void;
  dialogOpen: RefObject<boolean>;
  dialog: RefObject<HTMLDialogElement | null>;
  scene: RefObject<HTMLElement | null>;
};

export function useHandNavigation(options: Options) {
  const settings = useRef(options);
  settings.current = options;
  const pointer = useRef<ControlPoint>({ x: .5, y: .5, at: -10000 });
  const smoothed = useRef<ControlPoint | null>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const cursorProgress = useRef<HTMLProgressElement>(null);
  const statusProgress = useRef<HTMLProgressElement>(null);
  const hovered = useRef<HTMLElement | null>(null);
  const hoverKey = useRef("");
  const activated = useRef<HTMLElement | null>(null);
  const selectionGate = useRef(emptyHold());
  const actionGate = useRef(emptyHold());
  const scrollGate = useRef(emptyHold());
  const scroll = useRef({ velocity: 0, at: -10000 });
  const motion = useRef(emptyHandGesture());
  const [signal, setSignal] = useState("No hands detected");
  const [action, setAction] = useState("");
  const [gesturePhase, setGesturePhase] = useState("idle");

  const setHold = useCallback((value: number) => {
    if (cursorProgress.current && cursorProgress.current.value !== value) cursorProgress.current.value = value;
    if (statusProgress.current && statusProgress.current.value !== value) statusProgress.current.value = value;
  }, []);

  const clearHover = useCallback(() => {
    if (!hovered.current && !activated.current && actionGate.current.key === null) return;
    hovered.current?.removeAttribute("data-hand-hover");
    hovered.current = null;
    hoverKey.current = "";
    activated.current = null;
    actionGate.current = emptyHold();
    setAction("");
  }, []);
  const reset = useCallback((preserveGesture = false) => {
    smoothed.current = null;
    selectionGate.current = emptyHold(); scrollGate.current = emptyHold();
    if (!preserveGesture) { motion.current = emptyHandGesture(motion.current.cooldownUntil); setGesturePhase("idle"); }
    scroll.current = { velocity: 0, at: -10000 };
    if (cursor.current) cursor.current.hidden = true;
    clearHover(); setHold(0);
  }, [clearHover, setHold]);

  const onFrame = useCallback((frame: InputFrame | null) => {
    const current = settings.current;
    if (!current.active) { reset(); return; }
    if (frame && !gestureFrameReady(frame)) {
      reset(); setSignal("Tracking too slow for gestures / use buttons"); return;
    }
    if (!frame) { reset(); setSignal("No hands detected"); return; }
    const palms = readPalms(frame);
    if (current.motionEnabled) {
      const command = advanceHandGesture(motion.current, frame, current.zoom, palms);
      motion.current = command.state;
      setGesturePhase(command.zooming ? "zoom" : command.state.phase);
      if (command.twoHands) {
        scroll.current = { velocity: 0, at: frame.at };
        scrollGate.current = emptyHold(); selectionGate.current = emptyHold();
        clearHover(); setHold(0);
        if (cursor.current) cursor.current.hidden = true;
        setSignal(command.clap ? "Hand motion recognized / game unlocked" : command.zooming ? "Two-hand zoom" : command.state.phase === "together" ? "Hand motion / moved together" : command.state.phase === "apart" ? "Hand motion / ready" : "Two hands visible");
        if (command.zoom !== null && command.zoom !== current.zoom) current.onZoom(command.zoom);
        if (command.clap) current.onClap();
        return;
      }
      if (command.state.phase !== "idle") { reset(true); setSignal("Gesture paused / both hands required"); return; }
    } else { motion.current = emptyHandGesture(motion.current.cooldownUntil); setGesturePhase("idle"); }
    const input = handControl(frame, pointer.current.x, palms);
    if (!input) { reset(); setSignal(frame.hands.length ? "Hand estimate incomplete" : "No hands detected"); return; }
    const filtered = smoothControl(smoothed.current, { x: input.x, y: input.y, at: frame.at });
    smoothed.current = filtered;
    pointer.current = filtered;
    const point = handPointer(filtered);
    const { x, y } = cursorPosition(point, window.innerWidth, window.innerHeight);
    const target = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-hand-target]") ?? null;
    const available = target && !target.matches(":disabled, [aria-disabled='true']") &&
      (current.dialogOpen.current ? current.dialog.current?.contains(target) : !target.closest("dialog"));
    if (cursor.current) {
      cursor.current.hidden = false;
      cursor.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      cursor.current.dataset.horizontal = x < 90 ? "left" : x > window.innerWidth - 90 ? "right" : "center";
      cursor.current.dataset.vertical = y > window.innerHeight - 100 ? "above" : "below";
    }
    const velocity = available ? 0 : scrollVelocity(point.y);
    scrollGate.current = advanceHold(scrollGate.current, velocity ? String(Math.sign(velocity)) : null, frame.at, 160);
    scroll.current = { velocity: scrollGate.current.progress === 1 ? velocity : 0, at: frame.at };
    if (velocity) {
      clearHover(); selectionGate.current = emptyHold(); setHold(scrollGate.current.progress);
      setSignal(velocity > 0 ? "Scroll down" : "Scroll up"); return;
    }

    if (available) {
      const key = target.dataset.handTarget || "activate";
      if (hovered.current !== target || hoverKey.current !== key) {
        clearHover(); hovered.current = target; hoverKey.current = key; target.setAttribute("data-hand-hover", "true");
        setAction(target.getAttribute("aria-label") || target.getAttribute("title") || target.textContent?.trim() || "Activate");
      }
      selectionGate.current = emptyHold();
      setSignal("Hand cursor");
      const requestedDwell = Number(target.dataset.handDwell);
      const dwell = Number.isFinite(requestedDwell) && requestedDwell >= 140 && requestedDwell <= 1500 ? requestedDwell : 650;
      actionGate.current = advanceHold(actionGate.current, key, frame.at, dwell);
      setHold(actionGate.current.progress);
      if (actionGate.current.progress === 1 && activated.current !== target) {
        activated.current = target;
        target.click();
      }
      return;
    }
    clearHover();
    if (current.dialogOpen.current) { selectionGate.current = emptyHold(); setHold(0); setSignal("Hand cursor"); return; }
    setHold(0); setSignal("Hand input");
    const bounds = current.scene.current?.getBoundingClientRect();
    if (!bounds || bounds.bottom < window.innerHeight * .5) { selectionGate.current = emptyHold(); return; }
    const next = stableProjectAt(filtered.x, current.selected);
    selectionGate.current = advanceHold(selectionGate.current, String(next), frame.at, 160);
    if (selectionGate.current.progress === 1 && next !== current.selected) current.onSelect(next);
  }, [clearHover, reset, setHold]);

  useEffect(() => {
    if (!options.active) { reset(); return; }
    let raf = 0, previous = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(50, now - previous); previous = now;
      const fresh = now - scroll.current.at < 350 && !document.hidden;
      if (!fresh && cursor.current && !cursor.current.hidden) { reset(); setSignal("Waiting for fresh hand input"); }
      if (fresh && scroll.current.velocity) {
        const distance = scroll.current.velocity * elapsed / 1000;
        const current = settings.current;
        if (current.dialogOpen.current) current.dialog.current?.scrollBy({ top: distance, behavior: "instant" });
        else window.scrollBy({ top: distance, behavior: "instant" });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); reset(); };
  }, [options.active, reset]);

  return { onFrame, pointer, cursor, cursorProgress, statusProgress, signal, action, reset, gesturePhase };
}
