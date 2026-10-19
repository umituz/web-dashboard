import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useOnboardingProgress } from './useOnboardingProgress';
import { defaultStorageKey } from '../../utils/default-storage-key';
import type { OnboardingScreen } from '../../types/screens';

function makeScreens(count: number): OnboardingScreen[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `s${i}`,
    type: 'welcome',
    title: `Step ${i}`,
  }));
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('useOnboardingProgress — state machine (§1.1, §1.2)', () => {
  it('starts on the first screen', () => {
    const { result } = renderHook(() =>
      useOnboardingProgress({ screens: makeScreens(3) }),
    );
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(false);
    expect(result.current.isFinished).toBe(false);
    expect(result.current.totalSteps).toBe(3);
  });

  it('advances, records completion, and collects data', () => {
    const { result } = renderHook(() =>
      useOnboardingProgress({ screens: makeScreens(3), ephemeral: true }),
    );
    act(() => result.current.next({ selected: ['x'] }));
    expect(result.current.currentStep).toBe(1);
    expect(result.current.completedSteps).toEqual(['s0']);
    expect(result.current.collected).toEqual({ s0: { selected: ['x'] } });
    expect(result.current.isFirst).toBe(false);
  });

  it('retreats with prev and stops at the first screen', () => {
    const { result } = renderHook(() =>
      useOnboardingProgress({ screens: makeScreens(3), ephemeral: true }),
    );
    act(() => result.current.next());
    act(() => result.current.next());
    act(() => result.current.prev());
    expect(result.current.currentStep).toBe(1);
    act(() => result.current.prev());
    act(() => result.current.prev()); // below zero — must clamp
    expect(result.current.currentStep).toBe(0);
  });

  it('finish() marks the flow finished and returns a result', () => {
    const { result } = renderHook(() =>
      useOnboardingProgress({ screens: makeScreens(2), ephemeral: true }),
    );
    act(() => result.current.next());
    let returned: ReturnType<typeof result.current.finish> | undefined;
    act(() => {
      returned = result.current.finish({ final: true });
    });
    expect(result.current.isFinished).toBe(true);
    expect(result.current.result).not.toBeNull();
    expect(result.current.result?.durationMs).toBeGreaterThanOrEqual(0);
    expect(returned?.collected).toEqual({ s1: { final: true } });
  });

  it('next() on the last screen finishes the flow', () => {
    const { result } = renderHook(() =>
      useOnboardingProgress({ screens: makeScreens(2), ephemeral: true }),
    );
    act(() => result.current.next());
    act(() => result.current.next()); // last screen -> finish
    expect(result.current.isFinished).toBe(true);
    expect(result.current.completedSteps).toEqual(['s0', 's1']);
  });

  it('reset() rewinds and clears stored progress (§16.1)', () => {
    const { result } = renderHook(() =>
      useOnboardingProgress({ screens: makeScreens(3), storageKey: 'k' }),
    );
    act(() => result.current.next({ selected: ['x'] }));
    expect(JSON.parse(localStorage.getItem('k') ?? '{}').currentStep).toBe(1);
    act(() => result.current.reset());
    expect(result.current.currentStep).toBe(0);
    expect(result.current.completedSteps).toEqual([]);
    expect(result.current.collected).toEqual({});
    // The stale checkpoint is gone; the persist effect re-saves a fresh one.
    const stored = JSON.parse(localStorage.getItem('k') ?? 'null');
    expect(stored).not.toBeNull();
    expect(stored.currentStep).toBe(0);
    expect(stored.completedSteps).toEqual([]);
  });

  it('goTo() clamps out-of-range indices', () => {
    const { result } = renderHook(() =>
      useOnboardingProgress({ screens: makeScreens(3), ephemeral: true }),
    );
    act(() => result.current.goTo(99));
    expect(result.current.currentStep).toBe(2);
    act(() => result.current.goTo(-5));
    expect(result.current.currentStep).toBe(0);
  });
});

describe('useOnboardingProgress — persistence (§1.4, §1.5, §1.6)', () => {
  it('persists after each transition and rehydrates on a fresh mount', () => {
    const screens = makeScreens(4);
    const first = renderHook(() => useOnboardingProgress({ screens, storageKey: 'resume' }));
    act(() => first.result.current.next({ selected: ['a'] }));
    act(() => first.result.current.next());
    first.unmount();
    expect(JSON.parse(localStorage.getItem('resume') ?? '{}').currentStep).toBe(2);

    const second = renderHook(() => useOnboardingProgress({ screens, storageKey: 'resume' }));
    expect(second.result.current.currentStep).toBe(2);
    expect(second.result.current.collected).toEqual({ s0: { selected: ['a'] } });
    second.unmount();
  });

  it('never touches storage in ephemeral mode', () => {
    const { result } = renderHook(() =>
      useOnboardingProgress({ screens: makeScreens(2), ephemeral: true }),
    );
    act(() => result.current.next());
    expect(localStorage.getItem(defaultStorageKey)).toBeNull();
  });

  it('rehydration past the end of a shortened flow starts fresh', () => {
    // Progress stored for 4 screens; the app now ships 2. currentStep=3 is
    // out of bounds and must not be restored.
    localStorage.setItem(
      'short',
      JSON.stringify({
        version: 1,
        currentStep: 3,
        completedSteps: ['s0', 's1', 's2'],
        collected: {},
        startedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      }),
    );
    const { result } = renderHook(() =>
      useOnboardingProgress({ screens: makeScreens(2), storageKey: 'short' }),
    );
    expect(result.current.currentStep).toBe(0);
  });
});
