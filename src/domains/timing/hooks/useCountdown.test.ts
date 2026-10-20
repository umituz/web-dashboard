import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCountdown, useStopwatch } from './useCountdown';

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('ticks down once per second while running', () => {
    const { result } = renderHook(() => useCountdown(3));
    expect(result.current.remaining).toBe(3);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.remaining).toBe(1);
    expect(result.current.running).toBe(true);
  });

  it('fires onFinish exactly once at zero and stops', () => {
    const onFinish = vi.fn();
    const { result } = renderHook(() => useCountdown(2, onFinish));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.remaining).toBe(0);
    expect(result.current.running).toBe(false);
    expect(onFinish).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('restart rewinds the clock and re-arms completion', () => {
    const onFinish = vi.fn();
    const { result } = renderHook(() => useCountdown(1, onFinish));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onFinish).toHaveBeenCalledTimes(1);
    act(() => {
      result.current.restart();
    });
    expect(result.current.remaining).toBe(1);
    expect(result.current.running).toBe(true);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onFinish).toHaveBeenCalledTimes(2);
  });

  it('pause halts the tick and start resumes it', () => {
    const { result } = renderHook(() => useCountdown(5));
    // state change and time travel must be separate acts — the interval
    // effect only re-registers after the pause() commit
    act(() => {
      result.current.pause();
    });
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.remaining).toBe(5);
    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.remaining).toBe(4);
  });
});

describe('useStopwatch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('counts up after start and freezes on stop', () => {
    const { result } = renderHook(() => useStopwatch());
    expect(result.current.elapsed).toBe(0);
    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.elapsed).toBe(3);
    act(() => {
      result.current.stop();
    });
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.elapsed).toBe(3);
    act(() => {
      result.current.reset();
    });
    expect(result.current.elapsed).toBe(0);
  });
});
