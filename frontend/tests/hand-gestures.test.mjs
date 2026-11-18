import test from "node:test";
import assert from "node:assert/strict";
import { advanceHandGesture, clampViewZoom, emptyHandGesture } from "../lib/hand-gestures.ts";

// Unit fixtures only. No synthetic landmarks enter the webcam or runtime UI.
function hand(x, pinched = false, y = 220) {
  const points = Array.from({ length: 21 }, () => ({ x, y }));
  points[0] = { x, y: y + 60 }; points[5] = { x: x - 40, y };
  points[9] = { x, y }; points[13] = { x: x + 20, y }; points[17] = { x: x + 40, y };
  points[4] = { x: x - 60, y: y - 60 }; points[8] = { x: pinched ? x - 55 : x + 40, y: y - 60 };
  return points;
}
const frame = (span, at, pinched = false) => ({ width: 640, height: 480, inferenceMs: 40, at, hands: [hand(320 - span * 320, pinched), hand(320 + span * 320, pinched)] });
function armed(span = .6) {
  let result, state = emptyHandGesture();
  for (const at of [0, 80, 160]) { result = advanceHandGesture(state, frame(span, at), 1); state = result.state; }
  assert.equal(result.state.phase, "apart");
  return result.state;
}

test("view scale has explicit bounds and a finite reset value", () => {
  assert.equal(clampViewZoom(.1), .85);
  assert.equal(clampViewZoom(3), 1.35);
  assert.equal(clampViewZoom(NaN), 1);
  assert.equal(clampViewZoom(1.123), 1.12);
});
test("zoom requires two pinches, three real samples, and a stable baseline", () => {
  let result = advanceHandGesture(emptyHandGesture(), frame(.4, 0, true), 1);
  assert.equal(result.zoom, null);
  result = advanceHandGesture(result.state, frame(.5, 80, true), 1);
  assert.equal(result.zoom, null);
  result = advanceHandGesture(result.state, frame(.6, 180, true), 1);
  assert.equal(result.zoom, 1.22);
  assert.equal(result.clap, false);
  const released = advanceHandGesture(result.state, frame(.6, 250), result.zoom);
  assert.equal(released.state.zoom, null);
});
test("zoom cannot unlock the game, even when pinched hands move together and apart", () => {
  let state = emptyHandGesture();
  for (const [span, at] of [[.6, 0], [.2, 150], [.6, 300]]) {
    const result = advanceHandGesture(state, frame(span, at, true), 1);
    assert.equal(result.clap, false); state = result.state;
  }
});
test("game unlocks on an observed contraction without waiting for reopening", () => {
  let result = advanceHandGesture(armed(), frame(.19, 300), 1);
  assert.equal(result.clap, true);
  assert.equal(result.state.phase, "together");
  let state = result.state;
  for (const [span, at] of [[.6, 550], [.19, 700], [.5, 850]]) {
    result = advanceHandGesture(state, frame(span, at), 1); state = result.state;
    assert.equal(result.clap, false);
  }
});

test("a fast observed clap is not discarded by an arbitrary minimum closure time", () => {
  const result = advanceHandGesture(armed(), frame(.19, 200), 1);
  assert.equal(result.clap, true);
});

test("brief occlusion pauses the armed gesture and cannot unlock it", () => {
  let state = armed(), result;
  for (const [hands, at] of [[[], 250], [[hand(320)], 350]]) {
    result = advanceHandGesture(state, { ...frame(.2, at), hands }, 1); state = result.state;
    assert.equal(result.clap, false);
    assert.equal(result.twoHands, false);
    assert.equal(result.state.phase, "apart");
    assert.equal(result.state.last, 160);
  }
  result = advanceHandGesture(state, frame(.19, 500), 1);
  assert.equal(result.clap, true);
});

test("an occlusion without an observed closure never becomes a clap", () => {
  let result = advanceHandGesture(armed(), { ...frame(.1, 250), hands: [hand(320)] }, 1);
  result = advanceHandGesture(result.state, frame(.5, 350), 1);
  assert.equal(result.clap, false);
});

test("sequence memory expires after a long loss and never invents missing positions", () => {
  let result = advanceHandGesture(armed(), { ...frame(.1, 800), hands: [] }, 1);
  assert.equal(result.state.phase, "idle");
  assert.equal(result.clap, false);
  result = advanceHandGesture(result.state, frame(.19, 850), 1);
  assert.equal(result.clap, false);
});

test("one uncertain finger pinch does not erase a non-zoom hand-motion sequence", () => {
  const closed = frame(.19, 250); closed.hands[0] = hand(260, true);
  const result = advanceHandGesture(armed(), closed, 1);
  assert.equal(result.clap, true);
});

test("compact initial spacing calibrates without a fixed image-width requirement", () => {
  for (const span of [.12, .18, .24, .5]) {
    const result = advanceHandGesture(armed(span), frame(span * .6, 230), 1);
    assert.equal(result.clap, true);
  }
});

test("calibration requires stable observations before a motion can unlock", () => {
  let state = emptyHandGesture();
  for (const [span, at] of [[.18, 0], [.1, 60], [.18, 120]]) {
    const result = advanceHandGesture(state, frame(span, at), 1);
    state = result.state; assert.equal(result.clap, false);
  }
});

test("small changes around a calibrated spacing do not count as a clap", () => {
  let state = armed(.24);
  for (const [span, at] of [[.23, 230], [.22, 300], [.25, 400]]) {
    const result = advanceHandGesture(state, frame(span, at), 1);
    state = result.state; assert.equal(result.clap, false);
  }
});

test("the spacing reference does not chase a gradual closing motion", () => {
  let state = armed(.24), unlocked = false;
  for (let step = 1; step <= 60; step++) {
    assert.ok(state.reference >= .239);
    const result = advanceHandGesture(state, frame(.24 - step * .0015, 160 + step * 20), 1);
    state = result.state;
    if (result.clap) { unlocked = true; break; }
  }
  assert.equal(unlocked, true);
});
test("static hands, incomplete sequences, and missing outputs cannot unlock", () => {
  for (const sequence of [[[.2, 0], [.6, 150]], [[.6, 0], [.6, 100], [.6, 200]], [[.6, 0], [.2, 600], [.6, 800]]]) {
    let state = emptyHandGesture();
    for (const [span, at] of sequence) {
      const result = advanceHandGesture(state, frame(span, at), 1); state = result.state;
      assert.equal(result.clap, false);
    }
  }
  let result = advanceHandGesture(emptyHandGesture(), frame(.6, 0), 1);
  result = advanceHandGesture(result.state, { ...frame(.2, 100), hands: [] }, 1);
  result = advanceHandGesture(result.state, frame(.6, 200), 1);
  assert.equal(result.clap, false);
});
test("slow, invalid, or vertically unrelated hands cannot issue a two-hand command", () => {
  const base = frame(.5, 0, true);
  for (const input of [{ ...base, at: NaN }, { ...base, inferenceMs: 2000 }, { ...base, width: 0 }, { ...base, hands: [hand(150, true), hand(450, true, 450)] }]) {
    const result = advanceHandGesture(emptyHandGesture(), input, 1);
    assert.equal(result.twoHands, false); assert.equal(result.zoom, null); assert.equal(result.clap, false);
  }
});

test("a single pinch cannot change scale and a tracking gap resets the baseline", () => {
  let result = advanceHandGesture(emptyHandGesture(), frame(.6, 0, true), 1);
  const partial = frame(.4, 100, true); partial.hands[1] = hand(448, false);
  result = advanceHandGesture(result.state, partial, 1);
  assert.equal(result.zoom, null); assert.equal(result.state.zoom, null);
  result = advanceHandGesture(result.state, frame(.4, 500, true), 1.1);
  assert.equal(result.zoom, null);
  assert.equal(result.state.zoom.value, 1.1);
});

test("moving pinched hands closer decreases scale and respects the lower bound", () => {
  let state = emptyHandGesture(), result;
  for (const [span, at] of [[.6, 0], [.4, 80], [.15, 180]]) {
    result = advanceHandGesture(state, frame(span, at, true), 1); state = result.state;
  }
  assert.equal(result.zoom, .85);
});
