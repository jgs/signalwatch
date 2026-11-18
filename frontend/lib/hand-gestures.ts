import { gestureFrameReady, readPalms, type InputFrame } from "./input-controls.ts";

export const clampViewZoom = (zoom: number) => Number.isFinite(zoom) ? Math.round(Math.max(.85, Math.min(1.35, zoom)) * 100) / 100 : 1;
export type HandGestureState = {
  phase: "idle" | "apart" | "together";
  started: number;
  last: number;
  cooldownUntil: number;
  reference: number;
  samples: number;
  zoom: { span: number; value: number; started: number; samples: number } | null;
};
export const emptyHandGesture = (cooldownUntil = 0): HandGestureState => ({ phase: "idle", started: 0, last: -Infinity, cooldownUntil, reference: 0, samples: 0, zoom: null });

export function advanceHandGesture(previous: HandGestureState, frame: InputFrame, viewZoom: number, palms = readPalms(frame)) {
  if (!Number.isFinite(frame.at) || !gestureFrameReady(frame) || !Number.isFinite(frame.width) || !Number.isFinite(frame.height) || frame.width <= 0 || frame.height <= 0) return { state: emptyHandGesture(previous.cooldownUntil), twoHands: false, zoom: null, clap: false, zooming: false };
  let state = previous;
  const gap = frame.at - previous.last;
  if (frame.at < previous.last || gap > 500) state = emptyHandGesture(previous.cooldownUntil);
  else if (gap > 350) state = { ...state, zoom: null };
  const twoHands = palms.length === 2 && palms.every(palm => palm.pinchRatio !== null) && Math.abs(palms[0].y - palms[1].y) < .3;
  if (!twoHands) {
    // Sequence memory may pause during occlusion; missing hands never advance it.
    const pending = palms.length < 2 && state.phase !== "idle" && frame.at - state.last <= 500;
    return { state: pending ? { ...state, zoom: null } : emptyHandGesture(state.cooldownUntil), twoHands: false, zoom: null, clap: false, zooming: false };
  }
  const span = Math.abs(palms[0].x - palms[1].x);
  const pinched = palms.every(palm => palm.pinchRatio! < (state.zoom ? .6 : .4));
  if (pinched && span > .08) {
    const baseline = state.zoom ?? { span, value: viewZoom, started: frame.at, samples: 0 };
    const zoom = { ...baseline, samples: baseline.samples + 1 };
    const ready = zoom.samples >= 3 && frame.at - zoom.started >= 160;
    return { state: { ...emptyHandGesture(state.cooldownUntil), last: frame.at, zoom }, twoHands: true, zoom: ready ? clampViewZoom(zoom.value + (span - zoom.span) * 1.1) : null, clap: false, zooming: true };
  }
  state = { ...state, zoom: null, last: frame.at };
  if (frame.at < state.cooldownUntil) {
    return { state: { ...state, phase: "idle" as const }, twoHands: true, zoom: null, clap: false, zooming: false };
  }
  let clap = false;
  if (state.phase === "idle") {
    if (span < .06) state = { ...state, reference: 0, samples: 0 };
    else if (!state.samples || Math.abs(span - state.reference) > Math.max(.025, state.reference * .2)) {
      state = { ...state, reference: span, samples: 1, started: frame.at };
    } else {
      const samples = state.samples + 1;
      state = { ...state, reference: state.reference + (span - state.reference) / samples, samples };
      if (samples >= 3 && frame.at - state.started >= 160) state = { ...state, phase: "apart", started: frame.at };
    }
  } else if (state.phase === "apart") {
    if (span >= state.reference * .85) state = { ...state, reference: state.reference + Math.max(0, span - state.reference) * .15, started: frame.at };
    else if (frame.at - state.started > 1000) state = { ...emptyHandGesture(state.cooldownUntil), last: frame.at };
    else if (span <= state.reference * .7 && state.reference - span >= .025 && frame.at > state.started) {
      clap = true;
      state = { ...emptyHandGesture(frame.at + 2200), phase: "together", last: frame.at };
    }
  }
  return { state, twoHands: true, zoom: null, clap, zooming: false };
}
