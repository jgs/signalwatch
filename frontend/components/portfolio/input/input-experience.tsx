"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Camera, CameraOff, ChevronLeft, ChevronRight, Gamepad2, Info, MousePointer2, RotateCcw, ShieldCheck, X, ZoomIn, ZoomOut } from "lucide-react";
import { profile, projects } from "@/lib/portfolio";
import { InputField } from "./input-field";
import { useCameraInput } from "./use-camera-input";
import { useHandNavigation } from "./use-hand-navigation";
import { clampViewZoom } from "@/lib/hand-gestures";
import { SignalTrail } from "./signal-trail";

type Mode = "mouse" | "camera" | null;
const previews = ["/portfolio/anatomy/male-front-dark.webp", "/portfolio/barpath-poster.png", "/visual-context/ai-infrastructure-context.png"];
const previewLabels = ["Educational anatomy illustration / not a model output", "Still from the recorded project demo", "Generated project artwork / not telemetry"];

export function InputExperience() {
  const [mode, setMode] = useState<Mode>(null);
  const [selected, setSelected] = useState(0);
  const [dialog, setDialog] = useState<"project" | "privacy" | "game" | null>(null);
  const [viewZoom, setViewZoom] = useState(1);
  const [unlockedBy, setUnlockedBy] = useState<"gesture" | "button" | null>(null);
  const selectedRef = useRef(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogOpen = useRef(false);
  const modeRef = useRef<Mode>(null);
  const scene = useRef<HTMLElement>(null);
  const experiment = useRef<HTMLElement>(null);
  const story = useRef<HTMLElement>(null);

  const select = useCallback((index: number) => {
    const next = (index + projects.length) % projects.length;
    selectedRef.current = next; setSelected(next);
  }, []);
  const navigation = useHandNavigation({ active: mode === "camera", selected, onSelect: select, motionEnabled: dialog !== "game" && dialog !== "privacy", zoom: viewZoom, onZoom: setViewZoom, onClap: () => openGame("gesture"), dialogOpen, dialog: dialogRef, scene });
  const { pointer, signal } = navigation;
  const camera = useCameraInput(navigation.onFrame);

  const choose = (next: Mode) => {
    camera.stop(); navigation.reset(); modeRef.current = next; setMode(next);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (next) requestAnimationFrame(() => scene.current?.focus({ preventScroll: true }));
    if (next === "camera") void camera.start();
  };
  const open = (kind: "project" | "privacy" | "game") => { dialogOpen.current = true; setDialog(kind); };
  const openGame = (source: "gesture" | "button") => { setUnlockedBy(previous => previous ?? source); open("game"); };
  const close = () => { dialogOpen.current = false; setDialog(null); navigation.reset(); };
  useEffect(() => {
    const element = dialogRef.current;
    if (dialog && element) { if (!element.open) element.showModal(); element.scrollTop = 0; }
    else if (!dialog && element?.open) element.close();
  }, [dialog]);
  useEffect(() => {
    const element = experiment.current;
    if (!element) return;
    const observer = new IntersectionObserver(entries => { if (!entries[0]?.isIntersecting) camera.stop("Camera stopped outside the experiment."); });
    observer.observe(element);
    return () => observer.disconnect();
  }, [camera.stop]);

  function move(event: PointerEvent<HTMLElement>) {
    if (modeRef.current === "camera" || dialogOpen.current) return;
    if ((event.target as HTMLElement).closest("a,button,dialog,input,select,textarea")) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    pointer.current = { x, y: (event.clientY - bounds.top) / bounds.height, at: performance.now() };
  }
  function keys(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if ((event.target as HTMLElement).closest("a,button,dialog,input,select,textarea")) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); select(selectedRef.current + (event.key === "ArrowRight" ? 1 : -1)); }
    if (event.key === "Enter" && modeRef.current) { event.preventDefault(); open("project"); }
  }
  const project = projects[selected];
  const status = mode !== "camera" ? "Camera off" : camera.phase === "permission" ? "Waiting for permission" : camera.phase === "loading" ? "Loading hand model" : camera.phase === "live" ? camera.diagnostics.blank ? "Camera frame is blank" : camera.handCount ? signal : "No hands detected" : camera.phase === "unavailable" ? "Input unavailable" : "Camera off";

  const videoVisible = mode === "camera" && (camera.phase === "live" || camera.phase === "loading");
  return <main ref={experiment} className={`portfolio ix-experience ${mode ? "ix-active" : ""} ${mode === "camera" ? "ix-camera-mode" : ""}`}>
    <div className={`ix-input-layer ${videoVisible ? "ix-input-live" : ""}`}><video ref={camera.video} className={`ix-video-source ${videoVisible ? "ix-camera-video" : ""}`} data-preview-visible={videoVisible} muted playsInline aria-hidden="true" />
    <InputField pointer={pointer} landmarks={camera.landmarks} camera={videoVisible} paused={false} /></div>
    <header className="ix-header"><Link data-hand-target="portfolio-home" href="/" className="pf-signature" aria-label="Anxo Fandiño portfolio">af<span>*</span></Link><span>Independent experiment / 01</span><Link data-hand-target="exit-experiment" href="/" className="ix-exit"><ArrowLeft size={16} aria-hidden="true" /> Portfolio</Link></header>
    {mode && <div className="ix-utility"><div className="ix-zoom-controls" role="group" aria-label="View scale"><button data-hand-target="zoom-out" className="ix-icon" title="Zoom out" aria-label="Zoom out" disabled={viewZoom <= .85} onClick={() => setViewZoom(value => clampViewZoom(value - .05))}><ZoomOut size={18} /></button><output aria-label="View scale">{Math.round(viewZoom * 100)}%</output><button data-hand-target="zoom-in" className="ix-icon" title="Zoom in" aria-label="Zoom in" disabled={viewZoom >= 1.35} onClick={() => setViewZoom(value => clampViewZoom(value + .05))}><ZoomIn size={18} /></button><button data-hand-target="reset-zoom" className="ix-icon" title="Reset view scale" aria-label="Reset view scale" disabled={viewZoom === 1} onClick={() => setViewZoom(1)}><RotateCcw size={16} /></button></div><button data-hand-target="open-game" className={`ix-icon ix-game-launch ${unlockedBy ? "is-unlocked" : ""}`} aria-label="Open mini game" title="Open mini game" onClick={() => openGame("button")}><Gamepad2 size={21} /></button></div>}
    <div className="ix-content" style={{ zoom: mode ? viewZoom : 1 }}>
    <section className="ix-scene" ref={scene} onPointerMove={move} onKeyDown={keys} tabIndex={mode ? 0 : -1} aria-label={mode ? "Interactive project field" : "Choose your input"}>
      <div className="ix-opening">
        <div className="ix-kicker"><span>Code / Vision / Human movement</span></div>
        <h1 className="ix-name" aria-label={"Anxo Fandi\u00f1o"}><span>Anxo</span><span>Fandi&#241;o<i aria-hidden="true">*</i></span></h1>
        {!mode && <div className="ix-entry">
          <h2>You&apos;re the input.</h2>
          <div className="ix-entry-options">
            <button onClick={() => choose("mouse")}><MousePointer2 size={21} aria-hidden="true" /><span>Explore with mouse</span><ArrowUpRight size={20} aria-hidden="true" /></button>
            <button onClick={() => choose("camera")} aria-describedby="ix-camera-boundary"><Camera size={21} aria-hidden="true" /><span>Step in with camera</span><ArrowUpRight size={20} aria-hidden="true" /></button>
          </div>
          <p id="ix-camera-boundary">Camera optional. No recording. Video and hand tracking stay in your browser.</p>
        </div>}
      </div>
      {mode && <div className="ix-workspace">
        <div className="ix-topline"><span>You&apos;re the input.</span><div className="ix-modes" role="group" aria-label="Input mode"><button data-hand-target="mouse-mode" aria-pressed={mode === "mouse"} onClick={() => choose("mouse")}><MousePointer2 size={16} aria-hidden="true" /> Mouse</button><button aria-pressed={mode === "camera"} onClick={() => choose("camera")}><Camera size={16} aria-hidden="true" /> Camera</button></div>{mode === "camera" && (camera.phase === "live" || camera.phase === "permission" || camera.phase === "loading") && <button data-hand-target="stop-camera-top" className="ix-icon" onClick={() => camera.stop()} title="Turn camera off" aria-label="Turn camera off"><CameraOff size={18} /></button>}<button data-hand-target="privacy-details" className="ix-icon" onClick={() => open("privacy")} title="Camera privacy and motion controls" aria-label="Camera privacy and motion controls"><Info size={19} /></button></div>
        <div className="ix-project-stage">
          <div className="ix-project-description" aria-live="polite" key={project.slug}><span className="ix-eyebrow">{project.number} / {project.category}</span><h2>{project.name}</h2><p>{project.summary}</p><div className="ix-stage-actions"><button data-hand-target="open-project" className="ix-explore" onClick={() => open("project")}>Explore project <ArrowUpRight size={23} aria-hidden="true" /></button><button data-hand-target="read-project" className="ix-icon" title="Read project below" aria-label="Read project below" onClick={() => story.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" })}><ArrowDown size={20} /></button></div></div>
          <button data-hand-target="preview-project" className={`ix-preview ix-preview-${project.slug}`} onClick={() => open("project")} aria-label={`Explore ${project.name}`}><img key={project.slug} src={previews[selected]} alt={project.slug === "squat-judge" ? "Original educational anatomy illustration" : project.imageAlt} /><span>{previewLabels[selected]}</span></button>
        </div>
        <div className="ix-project-navigation"><button data-hand-target="previous-project" className="ix-icon" onClick={() => select(selected - 1)} aria-label="Previous project" title="Previous project"><ChevronLeft size={23} /></button><nav aria-label="Select a project">{projects.map((item, index) => <button data-hand-target={`select-${item.slug}`} key={item.slug} aria-pressed={selected === index} onClick={() => select(index)}><span>{item.number}</span><strong>{item.name}</strong></button>)}</nav><button data-hand-target="next-project" className="ix-icon" onClick={() => select(selected + 1)} aria-label="Next project" title="Next project"><ChevronRight size={23} /></button></div>
        <div className="ix-status-row"><div><span className={`ix-status-mark ${camera.phase === "live" && mode === "camera" ? "is-live" : ""}`} /><span role="status" data-gesture-phase={navigation.gesturePhase}>{status}</span>{camera.phase === "live" && mode === "camera" && <><span className="ix-frame-count">{camera.handCount} hands tracked</span><span className="ix-frame-count">{camera.frames} frames analyzed</span></>}</div><div>{mode === "camera" && camera.phase !== "off" && <button onClick={() => camera.stop()} className="ix-stop"><CameraOff size={16} aria-hidden="true" /> Stop camera</button>}{mode === "camera" && (camera.phase === "off" || camera.phase === "unavailable") && <button onClick={() => void camera.start()} className="ix-stop"><Camera size={16} aria-hidden="true" /> Retry camera</button>}<button className="ix-icon" onClick={() => choose(null)} aria-label="Return to input choice" title="Return to input choice"><X size={18} /></button></div></div>
        {mode === "camera" && <>
          <fieldset className="ix-camera-options" aria-label="Camera settings"><label>Camera<select aria-label="Camera device" value={camera.options.deviceId} disabled={camera.phase === "permission" || camera.phase === "loading"} onChange={event => void camera.start({ deviceId: event.currentTarget.value })}><option value="">System default</option>{camera.devices.map(device => <option key={device.id} value={device.id}>{device.label}</option>)}</select></label><label title="Use CPU processing if accelerated tracking does not respond"><input type="checkbox" checked={camera.options.compatible} disabled={camera.phase === "permission" || camera.phase === "loading"} onChange={event => void camera.start({ compatible: event.currentTarget.checked })} />Compatibility mode</label></fieldset>
          <div className="ix-camera-message"><p>{camera.message || (camera.phase === "live" ? `MediaPipe Hands / ${camera.diagnostics.model} / ${camera.diagnostics.backend.toUpperCase()}${camera.diagnostics.size ? ` / ${camera.diagnostics.size}` : ""}${camera.diagnostics.inferenceMs !== null ? ` / ${camera.diagnostics.inferenceMs} ms` : ""}${camera.source ? ` / ${camera.source}` : ""} / no recording` : "Model files download from TensorFlow Hub. No video is uploaded.")}</p><progress ref={navigation.statusProgress} value={0} max={1} aria-label="Gesture hold" /></div>
        </>}
      </div>}
    </section>
    {mode && <section ref={story} className="ix-story" aria-labelledby="ix-story-title">
      <header><span className="ix-eyebrow">Inside the project / {project.number}</span><button data-hand-target="back-to-projects" className="ix-icon" title="Back to projects" aria-label="Back to projects" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}><ArrowUp size={20} /></button></header>
      <h2 id="ix-story-title">{project.name}</h2><p className="ix-story-question">{project.question}</p>
      <div className="ix-story-columns"><div><h3>The project</h3><p>{project.description}</p><h3>The approach</h3><p>{project.approach}</p><div className="ix-story-stack">{project.stack.map(item => <span key={item}>{item}</span>)}</div></div><div><img src={previews[selected]} alt={project.slug === "squat-judge" ? "Educational anatomy illustration, not a live analysis" : project.imageAlt} /><span className="ix-eyebrow">{previewLabels[selected]}</span></div></div>
      <div className="ix-story-boundary"><h3>Scope &amp; limitations</h3><p>{project.boundary}</p></div>
      <div className="ix-story-links"><Link data-hand-target="full-project-story" href={`/work/${project.slug}`} className="ix-explore" onClick={() => camera.stop()}>Full project <ArrowUpRight size={20} /></Link><a data-hand-target="source-story" href={project.repo} target="_blank" rel="noopener noreferrer" className="ix-explore" onClick={() => camera.stop()}>Source code <ArrowUpRight size={20} /></a></div>
      <footer><span className="ix-eyebrow">{profile.name} / Computer vision &amp; systems</span><a data-hand-target="github-profile" href={profile.github} target="_blank" rel="noopener noreferrer" onClick={() => camera.stop()}>GitHub <ArrowUpRight size={16} /></a><a data-hand-target="linkedin-profile" href={profile.linkedin} target="_blank" rel="noopener noreferrer" onClick={() => camera.stop()}>LinkedIn <ArrowUpRight size={16} /></a></footer>
    </section>}
    </div>
    {mode === "camera" && camera.phase === "live" && camera.handCount === 2 && !dialog && (navigation.gesturePhase === "apart" || navigation.gesturePhase === "together") && <output className="ix-motion-state" aria-label="Game gesture state"><Gamepad2 size={17} aria-hidden="true" /><span>{navigation.gesturePhase === "apart" ? "Gesture ready" : "Hands moved together"}</span></output>}
    {mode === "camera" && <>{createPortal(<div ref={navigation.cursor} className="ix-hand-cursor" hidden aria-hidden="true"><span /><progress ref={navigation.cursorProgress} value={0} max={1} />{navigation.action && <small>{navigation.action}</small>}</div>, dialog && dialogRef.current ? dialogRef.current : document.body)}{camera.phase === "live" && <><div className="ix-scroll-edge ix-scroll-edge-top" aria-hidden="true"><ArrowUp size={15} /></div><div className="ix-scroll-edge ix-scroll-edge-bottom" aria-hidden="true"><ArrowDown size={15} /></div><button data-hand-target="stop-camera-global" className="ix-camera-safety ix-stop" onClick={() => camera.stop()} title="Stop camera" aria-label="Stop camera from toolbar"><CameraOff size={16} /> Stop camera</button></>}</>}
    <dialog ref={dialogRef} className={`ix-dialog ${dialog === "game" ? "ix-game-dialog" : ""}`} onCancel={close} onClick={event => { if (event.target === event.currentTarget) close(); }} aria-labelledby="ix-dialog-title">
      <div className="ix-dialog-content" style={{ zoom: dialog === "game" ? 1 : viewZoom }}><button data-hand-target="close-details" className="ix-icon ix-dialog-close" onClick={close} aria-label="Close details" title="Close details"><X size={22} /></button>
        {dialog === "game" ? <SignalTrail unlockedBy={unlockedBy ?? "button"} cameraOn={videoVisible} onStopCamera={() => camera.stop()} /> : dialog === "privacy" ? <><ShieldCheck size={29} aria-hidden="true" /><span className="ix-eyebrow">Input boundaries</span><h2 id="ix-dialog-title">Your movement.<br />Your device.</h2>
          <p>Camera video and hand landmarks are processed in this browser. This experiment does not record, store, or upload them. Model files are downloaded from TensorFlow Hub.</p><p>Switching to mouse, leaving this page, or hiding the tab stops the camera. Permission is requested only when you choose camera mode. Microphone access is never requested.</p>
          <dl><dt>Palm position</dt><dd>A filtered palm signal controls the cursor. Project selection has a small boundary buffer to prevent flicker; the hand landmarks themselves are not smoothed.</dd><dt>Control activation</dt><dd>A stable cursor over a highlighted control activates it after 650 ms. Game targets use a shorter 140 ms hold. One hold performs one action; leaving the control rearms it.</dd><dt>Vertical movement</dt><dd>The upper and lower cursor edges scroll the page or the open details. Moving back to the center stops scrolling. Missing or stale input stops it as well.</dd><dt>Two-hand zoom</dt><dd>Pinch thumb and index finger on both hands, then change the distance between your palms. This scales the local content from 85% to 135%, not browser chrome, the camera feed, or model landmarks. Releasing either pinch ends the adjustment.</dd><dt>Hands-together game gesture</dt><dd>Hold your open hands apart until Gesture ready appears, then bring them closer to open Signal Trail. There is no reopening step. This is an experimental visual gesture, not sound detection or proof of physical contact. Zoom and unlock gestures are disabled inside the game.</dd><dt>Mouse and keyboard</dt><dd>Scale buttons and the gamepad button offer the same actions without a camera. Opening a full project page or an external source stops this local camera experiment.</dd></dl>
          <p className="ix-small">Gesture controls are experimental interface commands, not an exercise assessment, identity system, or measurement of performance. Missing hands remain missing.</p><a data-hand-target="tracking-documentation" href="https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection" target="_blank" rel="noopener noreferrer" className="ix-explore" onClick={() => camera.stop()}>Hand tracking documentation <ArrowUpRight size={17} aria-hidden="true" /></a>
        </> : <><span className="ix-eyebrow">{project.category}</span><h2 id="ix-dialog-title">{project.name}</h2><p>{project.description}</p><h3>The approach</h3><p>{project.approach}</p><h3>Scope &amp; limitations</h3><p>{project.boundary}</p><div className="ix-dialog-actions"><Link data-hand-target="full-project-dialog" href={`/work/${project.slug}`} className="ix-explore" onClick={() => camera.stop()}>Full project <ArrowRight size={20} aria-hidden="true" /></Link><a data-hand-target="source-dialog" href={project.repo} target="_blank" rel="noopener noreferrer" onClick={() => camera.stop()}>Source code <ArrowUpRight size={17} aria-hidden="true" /></a></div></>}
      </div>
    </dialog>
  </main>;
}
