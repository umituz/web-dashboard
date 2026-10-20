import { useEffect, useRef, useState } from 'react';

/** Ticking countdown in seconds; fires onFinish once at zero. */
export function useCountdown(seconds: number | null, onFinish?: () => void) {
  const [remaining, setRemaining] = useState(seconds ?? 0);
  const [running, setRunning] = useState(seconds != null);
  const finishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    setRemaining(seconds ?? 0);
    setRunning(seconds != null);
    finishedRef.current = false;
  }, [seconds]);

  const restart = () => {
    finishedRef.current = false;
    setRemaining(seconds ?? 0);
    setRunning(seconds != null);
  };

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((r) => (r <= 1 ? 0 : r - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  // Completion fires in an effect, not inside the setRemaining updater —
  // updaters must stay pure (StrictMode double-invokes them).
  useEffect(() => {
    if (running && remaining === 0 && !finishedRef.current) {
      finishedRef.current = true;
      setRunning(false);
      onFinishRef.current?.();
    }
  }, [running, remaining]);

  return {
    remaining,
    running,
    start: () => setRunning(true),
    pause: () => setRunning(false),
    stop: () => {
      setRunning(false);
      finishedRef.current = true;
    },
    restart,
  };
}

/** Stopwatch for open practice (writing time, speaking response windows). */
export function useStopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  return {
    elapsed,
    running,
    start: () => setRunning(true),
    stop: () => setRunning(false),
    reset: () => {
      setRunning(false);
      setElapsed(0);
    },
  };
}
