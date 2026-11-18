import test from "node:test";
import assert from "node:assert/strict";
import { advanceHold, cursorPosition, emptyHold, gestureFrameReady, handControl, handPointer, projectAt, scrollVelocity, smoothControl, stableProjectAt } from "../lib/input-controls.ts";
import { createVideoFrameScheduler } from "../lib/video-frame-scheduler.ts";

// Synthetic unit fixtures only; these are never exposed as runtime model output.
const hand = (x, y) => Array.from({ length: 21 }, (_, index) => ({ name: String(index), x, y }));
const frame = hands => ({ width: 640, height: 480, at: 100, inferenceMs: 50, hands });

test("slow or invalid inference cannot trigger gesture commands", () => {
  assert.equal(gestureFrameReady(frame([hand(100, 180)])), true);
  for (const inferenceMs of [1755, 4747, NaN, Infinity, -1]) {
    assert.equal(gestureFrameReady({ ...frame([hand(100, 180)]), inferenceMs }), false);
  }
});

test("pointer selection stays inside the three projects", () => {
  assert.deepEqual([-.2, 0, .4, .9, 1, 2].map(projectAt), [0, 0, 1, 2, 2, 2]);
});

test("project boundaries have a deadband instead of flickering between neighbors", () => {
  assert.equal(stableProjectAt(.34, 0), 0);
  assert.equal(stableProjectAt(.40, 0), 1);
  assert.equal(stableProjectAt(.32, 1), 1);
  assert.equal(stableProjectAt(.25, 1), 0);
  assert.equal(stableProjectAt(.68, 1), 1);
  assert.equal(stableProjectAt(.75, 1), 2);
  assert.equal(stableProjectAt(NaN, 1), 1);
});

test("control smoothing is time based and never bridges a lost tracking interval", () => {
  const previous = { x: .2, y: .4, at: 0 };
  const next = { x: .8, y: .6, at: 75 };
  const result = smoothControl(previous, next);
  assert.ok(result.x > .2 && result.x < .8);
  assert.ok(result.y > .4 && result.y < .6);
  assert.equal(result.at, 75);
  assert.deepEqual(smoothControl(null, next), next);
  const delayed = { ...next, at: 400 };
  assert.deepEqual(smoothControl(previous, delayed), delayed);
  assert.deepEqual(smoothControl(previous, { ...next, at: -1 }), { ...next, at: -1 });
});

test("the hand cursor reaches screen edges without moving the palm out of view", () => {
  assert.deepEqual(handPointer({ x: .12, y: .15, at: 0 }), { x: 0, y: 0 });
  const corner = handPointer({ x: .88, y: .85, at: 0 });
  assert.ok(Math.abs(corner.x - 1) < 1e-10 && Math.abs(corner.y - 1) < 1e-10);
  assert.deepEqual(handPointer({ x: .5, y: .5, at: 0 }), { x: .5, y: .5 });
  assert.deepEqual(handPointer({ x: -1, y: 2, at: 0 }), { x: 0, y: 1 });
});

test("hit testing stays on a valid viewport pixel at every edge", () => {
  assert.deepEqual(cursorPosition({ x: 1, y: 1 }, 390, 844), { x: 389, y: 843 });
  assert.deepEqual(cursorPosition({ x: -1, y: 2 }, 320, 568), { x: 0, y: 567 });
  assert.deepEqual(cursorPosition({ x: .5, y: .5 }, 1, 1), { x: 0, y: 0 });
});

function schedulingFixture() {
  let id = 0, calls = 0;
  const frames = new Map(), timers = new Map(), canceled = [];
  const video = {
    requestVideoFrameCallback(callback) { frames.set(++id, callback); return id; },
    cancelVideoFrameCallback(key) { canceled.push(key); frames.delete(key); },
  };
  const clock = {
    set(callback, delay) { timers.set(++id, { callback, delay }); return id; },
    clear(key) { timers.delete(key); },
  };
  return { video, clock, frames, timers, canceled, run: () => calls++, calls: () => calls };
}

test("inference waits for a new video frame rather than a fixed extra timer", () => {
  const f = schedulingFixture(), loop = createVideoFrameScheduler(f.video, f.run, f.clock);
  loop.schedule();
  assert.equal(f.frames.size, 1);
  assert.equal(f.timers.size, 0);
  assert.equal(f.calls(), 0);
  [...f.frames.values()][0]();
  assert.equal(f.calls(), 1);
  loop.stop();
});

test("rescheduling and stopping invalidate even a late video callback", () => {
  const f = schedulingFixture(), loop = createVideoFrameScheduler(f.video, f.run, f.clock);
  loop.schedule();
  const first = [...f.frames.values()][0];
  loop.schedule();
  first();
  assert.equal(f.calls(), 0);
  const second = [...f.frames.values()][0];
  loop.stop(); second(); loop.schedule();
  assert.equal(f.calls(), 0);
  assert.equal(f.frames.size, 0);
  assert.equal(f.canceled.length, 2);
});

test("older browsers use a cancellable timer fallback", () => {
  const f = schedulingFixture(), loop = createVideoFrameScheduler({}, f.run, f.clock);
  loop.schedule();
  const timer = [...f.timers.values()][0];
  assert.equal(timer.delay, 16);
  loop.stop(); timer.callback();
  assert.equal(f.calls(), 0);
});

test("CPU processing keeps its yielding delay and cancellation stops queued work", () => {
  const f = schedulingFixture(), loop = createVideoFrameScheduler(f.video, f.run, f.clock);
  loop.schedule(75);
  assert.equal(f.frames.size, 0);
  const timer = [...f.timers.values()][0];
  assert.equal(timer.delay, 75);
  timer.callback();
  assert.equal(f.frames.size, 1);
  loop.stop();
  assert.equal(f.frames.size, 0);
});

test("vertical scrolling has a neutral center and a bounded progressive speed", () => {
  for (const y of [.12, .3, .5, .8, .88, NaN]) assert.equal(scrollVelocity(y), 0);
  assert.equal(scrollVelocity(0), -640);
  assert.equal(scrollVelocity(1), 640);
  assert.ok(scrollVelocity(.95) > 0 && scrollVelocity(.95) < 640);
  assert.ok(scrollVelocity(.05) < 0 && scrollVelocity(.05) > -640);
  assert.equal(scrollVelocity(-1), -640);
  assert.equal(scrollVelocity(2), 640);
});
test("missing, partial, nonfinite, or offscreen hands cannot control the interface", () => {
  assert.equal(handControl(frame([])), null);
  assert.equal(handControl(frame([hand(100, 180).slice(0, 5)])), null);
  assert.equal(handControl(frame([hand(NaN, 180)])), null);
  assert.equal(handControl(frame([hand(-100, 180)])), null);
  assert.equal(handControl({ ...frame([hand(100, 180)]), width: 0 }), null);
  assert.equal(handControl({ ...frame([hand(100, 180)]), height: NaN }), null);
});
test("palm input is mirrored and does not require shoulders or a raised wrist", () => {
  assert.equal(handControl(frame([hand(100, 400)])).project, 2);
  assert.equal(handControl(frame([hand(540, 400)])).project, 0);
});
test("opening requires two separated hands at a similar height", () => {
  assert.equal(handControl(frame([hand(100, 220), hand(540, 220)])).open, true);
  assert.equal(handControl(frame([hand(300, 220), hand(340, 220)])).open, false);
  assert.equal(handControl(frame([hand(100, 20), hand(540, 460)])).open, false);
  assert.equal(handControl(frame([hand(100, 220)])).open, false);
});
test("the controlling palm remains stable when detector ordering changes", () => {
  assert.equal(handControl(frame([hand(100, 220), hand(540, 220)]), .2).project, 0);
  assert.equal(handControl(frame([hand(540, 220), hand(100, 220)]), .2).project, 0);
});
test("dwell requires continuous input and resets on missing data", () => {
  let state = emptyHold();
  for (const now of [0, 200, 400, 600, 800, 1000]) state = advanceHold(state, "open", now, 1000);
  assert.equal(state.progress, 1);
  assert.equal(advanceHold(state, null, 1100, 1000).progress, 0);
  assert.equal(advanceHold(state, "open", 2600, 1000).progress, 0);
  assert.equal(advanceHold(state, "other", 1100, 1000).progress, 0);
  assert.equal(advanceHold(state, "open", 900, 1000).progress, 0);
});
test("slow inference can complete a hold without treating one late sample as confirmation", () => {
  let state = advanceHold(emptyHold(), "open", 0, 1000);
  state = advanceHold(state, "open", 600, 1000);
  assert.ok(state.progress < 1);
  state = advanceHold(state, "open", 1200, 1000);
  assert.equal(state.progress, 1);
  const lateSecondSample = advanceHold(advanceHold(emptyHold(), "open", 0, 1000), "open", 1100, 1000);
  assert.ok(lateSecondSample.progress < 1);
});
