import { describe, it, expect, beforeEach } from 'vitest';
import {
  buildOnboardingResult,
  clearOnboardingProgress,
  loadOnboardingProgress,
  saveOnboardingProgress,
} from './local-storage-bridge';
import { defaultStorageKey } from './default-storage-key';

beforeEach(() => {
  window.localStorage.clear();
});

describe('local-storage-bridge round-trip', () => {
  it('saves and loads progress under the default key', () => {
    const startedAt = new Date('2026-01-01T10:00:00.000Z');
    const ok = saveOnboardingProgress(undefined, {
      currentStep: 2,
      completedSteps: ['a', 'b'],
      collected: { a: { selected: ['x'] } },
      startedAt,
      lastUpdated: new Date('2026-01-01T10:01:00.000Z'),
    });
    expect(ok).toBe(true);
    expect(localStorage.getItem(defaultStorageKey)).toContain('"version":1');

    const restored = loadOnboardingProgress(undefined);
    expect(restored).not.toBeNull();
    expect(restored?.currentStep).toBe(2);
    expect(restored?.completedSteps).toEqual(['a', 'b']);
    expect(restored?.collected).toEqual({ a: { selected: ['x'] } });
    expect(restored?.startedAt.toISOString()).toBe('2026-01-01T10:00:00.000Z');
  });

  it('honors a custom storage key without touching the default one', () => {
    saveOnboardingProgress('my-app:onboarding', {
      currentStep: 1,
      completedSteps: ['a'],
      collected: {},
      startedAt: new Date(),
      lastUpdated: new Date(),
    });
    expect(localStorage.getItem('my-app:onboarding')).not.toBeNull();
    expect(localStorage.getItem(defaultStorageKey)).toBeNull();
  });

  it('returns null and discards corrupt payloads so future saves start clean', () => {
    localStorage.setItem(defaultStorageKey, '{corrupt');
    expect(loadOnboardingProgress(undefined)).toBeNull();
    expect(localStorage.getItem(defaultStorageKey)).toBeNull();
  });

  it('returns null when nothing is stored', () => {
    expect(loadOnboardingProgress(undefined)).toBeNull();
  });

  it('clears the stored payload safely', () => {
    saveOnboardingProgress(undefined, {
      currentStep: 0,
      completedSteps: [],
      collected: {},
      startedAt: new Date(),
      lastUpdated: new Date(),
    });
    clearOnboardingProgress(undefined);
    expect(localStorage.getItem(defaultStorageKey)).toBeNull();
    expect(() => clearOnboardingProgress(undefined)).not.toThrow();
  });
});

describe('buildOnboardingResult', () => {
  it('computes the duration from start to finish', () => {
    const result = buildOnboardingResult({
      completedSteps: ['a', 'b'],
      collected: { a: 1 },
      startedAt: new Date('2026-01-01T10:00:00.000Z'),
      finishedAt: new Date('2026-01-01T10:02:30.000Z'),
    });
    expect(result.durationMs).toBe(150_000);
    expect(result.completedSteps).toEqual(['a', 'b']);
    expect(result.collected).toEqual({ a: 1 });
  });

  it('clamps negative durations to zero', () => {
    const result = buildOnboardingResult({
      completedSteps: [],
      collected: {},
      startedAt: new Date('2026-01-01T10:02:30.000Z'),
      finishedAt: new Date('2026-01-01T10:00:00.000Z'),
    });
    expect(result.durationMs).toBe(0);
  });
});
