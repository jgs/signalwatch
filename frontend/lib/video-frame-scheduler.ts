type VideoFrames = Partial<Pick<HTMLVideoElement, "requestVideoFrameCallback" | "cancelVideoFrameCallback">>;
type Timers = { set: typeof setTimeout; clear: typeof clearTimeout };

export function createVideoFrameScheduler(video: VideoFrames, callback: () => void, timers: Timers = { set: setTimeout, clear: clearTimeout }) {
  let frame: number | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let generation = 0;
  let stopped = false;
  const cancelPending = () => {
    generation++;
    if (frame !== null) video.cancelVideoFrameCallback?.(frame);
    if (timer !== null) timers.clear(timer);
    frame = null; timer = null;
  };
  return {
    schedule(delay = 0) {
      if (stopped) return;
      cancelPending();
      const id = generation;
      const run = () => {
        if (stopped || id !== generation) return;
        frame = null; timer = null;
        callback();
      };
      const queue = () => {
        if (stopped || id !== generation) return;
        timer = null;
        if (video.requestVideoFrameCallback && video.cancelVideoFrameCallback) frame = video.requestVideoFrameCallback(run);
        else timer = timers.set(run, 16);
      };
      if (delay > 0) timer = timers.set(queue, delay);
      else queue();
    },
    stop() { stopped = true; cancelPending(); },
  };
}
