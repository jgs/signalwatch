export type InputPoint = { name?: string; x: number; y: number };
export type InputFrame = { hands: InputPoint[][]; width: number; height: number; at: number; inferenceMs: number };
export type HandControl = { x: number; y: number; project: number; open: boolean };
export type HoldState = { key: string | null; since: number; last: number; progress: number; samples: number };
export type ControlPoint = { x: number; y: number; at: number };

export const emptyHold = (): HoldState => ({ key: null, since: 0, last: 0, progress: 0, samples: 0 });
export const MAX_GESTURE_INTERVAL_MS = 1200;
export const gestureFrameReady = (frame: InputFrame) => Number.isFinite(frame.inferenceMs) && frame.inferenceMs >= 0 && frame.inferenceMs <= MAX_GESTURE_INTERVAL_MS;
export const projectAt = (x: number) => Number.isFinite(x) ? Math.min(2, Math.max(0, Math.floor(x * 3))) : 1;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function stableProjectAt(x: number, current: number) {
  if (!Number.isFinite(x)) return current;
  const margin = .055;
  if (x >= current / 3 - margin && x <= (current + 1) / 3 + margin) return current;
  return projectAt(x);
}

// Only the interface signal is filtered; displayed model landmarks stay unmodified.
export function smoothControl(previous: ControlPoint | null, next: ControlPoint): ControlPoint {
  const elapsed = previous ? next.at - previous.at : 0;
  if (!previous || elapsed <= 0 || elapsed > 350) return next;
  const weight = 1 - Math.exp(-elapsed / 75);
  return { x: previous.x + (next.x - previous.x) * weight, y: previous.y + (next.y - previous.y) * weight, at: next.at };
}

export const handPointer = (point: ControlPoint) => ({ x: clamp((point.x - .12) / .76), y: clamp((point.y - .15) / .7) });
export const cursorPosition = (point: { x: number; y: number }, width: number, height: number) => ({
  x: clamp(point.x) * Math.max(0, width - 1),
  y: clamp(point.y) * Math.max(0, height - 1),
});
export function scrollVelocity(y: number) {
  if (!Number.isFinite(y)) return 0;
  if (y < .12) return -640 * clamp((.12 - y) / .12) ** 2;
  if (y > .88) return 640 * clamp((y - .88) / .12) ** 2;
  return 0;
}

export function readPalms(frame: InputFrame) {
  if (!Number.isFinite(frame.width) || !Number.isFinite(frame.height) || frame.width <= 0 || frame.height <= 0) return [];
  return frame.hands.filter(hand => hand.length === 21 && hand.every(p => Number.isFinite(p.x) && Number.isFinite(p.y))).map(hand => {
    const center = [hand[0], hand[5], hand[9], hand[13], hand[17]];
    const distance = (a: number, b: number) => Math.hypot(hand[a].x - hand[b].x, hand[a].y - hand[b].y);
    const scale = Math.max(distance(0, 9), distance(5, 17));
    return { x: 1 - center.reduce((sum, p) => sum + p.x, 0) / (5 * frame.width), y: center.reduce((sum, p) => sum + p.y, 0) / (5 * frame.height), pinchRatio: scale > 5 ? distance(4, 8) / scale : null };
  }).filter(p => p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1);
}

export function handControl(frame: InputFrame, previousX = .5, palms = readPalms(frame)): HandControl | null {
  if (!palms.length) return null;
  const palm = palms.reduce((a, b) => Math.abs(a.x - previousX) < Math.abs(b.x - previousX) ? a : b);
  const bothOpen = palms.length === 2 && Math.abs(palms[0].x - palms[1].x) > .4 && Math.abs(palms[0].y - palms[1].y) < .3;
  return { ...palm, project: projectAt(palm.x), open: bothOpen };
}

export function advanceHold(previous: HoldState, key: string | null, now: number, duration: number): HoldState {
  if (key === null || !Number.isFinite(now)) return emptyHold();
  if (previous.key !== key || now < previous.last || now - previous.last > MAX_GESTURE_INTERVAL_MS) return { key, since: now, last: now, progress: 0, samples: 1 };
  const samples = previous.samples + 1;
  return { ...previous, last: now, samples, progress: Math.min(samples >= 3 ? 1 : .9, Math.max(0, (now - previous.since) / duration)) };
}
