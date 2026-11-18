"use client";

import { useRef, useState } from "react";
import { Activity, CameraOff, Check, Crosshair, Dumbbell, Play, RotateCcw, Scan } from "lucide-react";
import squatArtwork from "./thumbnails/squat.webp";
import barPathArtwork from "./thumbnails/barpath.webp";
import signalWatchArtwork from "./thumbnails/signalwatch.webp";

const points = [[20, 23], [76, 62], [34, 73], [71, 24], [48, 48], [19, 61], [80, 77], [45, 20], [67, 47]];
const artworks = [[squatArtwork, Scan], [barPathArtwork, Dumbbell], [signalWatchArtwork, Activity]] as const;

export function SignalTrail({ unlockedBy, cameraOn, onStopCamera }: { unlockedBy: "gesture" | "button"; cameraOn: boolean; onStopCamera: () => void }) {
  const [round, setRound] = useState<"ready" | "playing" | "complete">("ready");
  const [hits, setHits] = useState(0);
  const target = useRef<HTMLButtonElement>(null);
  const play = useRef<HTMLButtonElement>(null);
  const complete = round === "complete";
  const start = () => { setHits(0); setRound("playing"); requestAnimationFrame(() => target.current?.focus({ preventScroll: true })); };
  function collect() {
    if (round !== "playing") return;
    const next = hits + 1;
    setHits(next);
    if (next === points.length) { setRound("complete"); requestAnimationFrame(() => play.current?.focus({ preventScroll: true })); }
  }
  return <section className="ix-game" aria-label="Signal Trail mini game">
    <span className="ix-eyebrow">Mini game / {unlockedBy === "gesture" ? "Unlocked by hand motion" : "Camera optional"}</span>
    <h2 id="ix-dialog-title">Signal Trail<span aria-hidden="true">*</span></h2>
    <div className="ix-game-status"><span role="status">{complete ? "Trail complete" : round === "ready" ? "Ready" : "Round in progress"}</span><output aria-label="Signals collected">{String(hits).padStart(2, "0")} / {String(points.length).padStart(2, "0")}</output></div>
    <div className="ix-game-board">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points={points.slice(0, hits).map(point => point.join(",")).join(" ")} fill="none" stroke="currentColor" strokeWidth=".55" />{points.slice(0, hits).map(([x, y], index) => <circle key={index} cx={x} cy={y} r="1.2" fill="currentColor" />)}</svg>
      {round === "playing" ? <button ref={target} className="ix-game-target" data-hand-target={`game-signal-${hits}`} data-hand-dwell="140" style={{ left: `${points[hits][0]}%`, top: `${points[hits][1]}%` }} aria-label={`Collect signal ${hits + 1}`} title={`Collect signal ${hits + 1}`} onClick={collect}><Crosshair size={30} aria-hidden="true" /></button> : <div className="ix-game-center">{complete ? <Check size={38} aria-hidden="true" /> : <Crosshair size={38} aria-hidden="true" />}<button ref={play} data-hand-target={complete ? "replay-game" : "start-game"} className="ix-game-start" onClick={start}>{complete ? <RotateCcw size={18} /> : <Play size={18} />}{complete ? "Play again" : "Start round"}</button></div>}
      <span className="ix-game-board-label">Game trail / not a perception trace</span>
    </div>
    <footer className="ix-game-footer"><div className="ix-game-artworks" aria-hidden="true">{artworks.map(([artwork, Icon]) => <span key={artwork.src}><Icon size={16} /><img src={artwork.src} width={artwork.width} height={artwork.height} alt="" decoding="async" onError={event => { event.currentTarget.hidden = true; }} /></span>)}</div><span>{cameraOn ? "Camera on / local processing" : "Camera off"}</span>{cameraOn && <button data-hand-target="stop-camera-game" className="ix-icon" aria-label="Stop game camera" title="Stop camera" onClick={onStopCamera}><CameraOff size={18} /></button>}<button data-hand-target="restart-game" className="ix-icon" aria-label="Restart round" title="Restart round" onClick={start}><RotateCcw size={18} /></button></footer>
  </section>;
}
