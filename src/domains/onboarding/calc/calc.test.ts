import { describe, it, expect, vi } from 'vitest';
import {
  computeProgressFraction,
  computeProgressPercentage,
  computeRemainingSteps,
} from './progress-percentage';
import {
  advanceStepIndex,
  clampStepIndex,
  retreatStepIndex,
} from './step-index-clamp';
import {
  didCrossLeftSwipeThreshold,
  didCrossRightSwipeThreshold,
  SWIPE_DECISION_THRESHOLD_PX,
} from './swipe-gesture-curve';
import {
  clampValueToBounds,
  resolveSliderBounds,
  areSliderBoundsValid,
} from './slider-value-bounds';
import {
  getDefaultStepDurationMs,
  splitTotalDuration,
} from './duration-equal-split';
import { elapsedMillis } from './elapsed-millis';
import { formatCountWithLocale } from './count-with-locale';
import {
  getCardEnterAnimate,
  getCardEnterExit,
  getCardEnterInitial,
  getCardTransitionDurationMs,
} from './card-stack-motion-curve';

describe('progress-percentage (§22.1)', () => {
  it('computes percentages without NaN or Infinity', () => {
    expect(computeProgressPercentage(0, 5)).toBe(0);
    expect(computeProgressPercentage(5, 5)).toBe(100);
    expect(computeProgressPercentage(0, 0)).toBe(0);
    expect(computeProgressPercentage(-1, 5)).toBe(0);
    expect(computeProgressPercentage(10, 5)).toBe(100);
    expect(Number.isFinite(computeProgressPercentage(3, 7))).toBe(true);
  });

  it('computes the 0..1 fraction', () => {
    expect(computeProgressFraction(1, 4)).toBe(0.25);
    expect(computeProgressFraction(0, 0)).toBe(0);
  });

  it('counts remaining steps including the current one', () => {
    expect(computeRemainingSteps(0, 5)).toBe(5);
    expect(computeRemainingSteps(3, 5)).toBe(2);
    expect(computeRemainingSteps(9, 5)).toBe(0);
    expect(computeRemainingSteps(0, 0)).toBe(0);
  });
});

describe('step-index-clamp (§22.2)', () => {
  it('clamps arbitrary indices into range', () => {
    expect(clampStepIndex(0, 5)).toBe(0);
    expect(clampStepIndex(4, 5)).toBe(4);
    expect(clampStepIndex(10, 5)).toBe(4);
    expect(clampStepIndex(-1, 5)).toBe(0);
    expect(clampStepIndex(0, 0)).toBe(0);
  });

  it('advances without going past the last step', () => {
    expect(advanceStepIndex(3, 5)).toBe(4);
    expect(advanceStepIndex(4, 5)).toBe(4);
    expect(advanceStepIndex(0, 0)).toBe(0);
  });

  it('retreats without going below the first step', () => {
    expect(retreatStepIndex(0)).toBe(0);
    expect(retreatStepIndex(3)).toBe(2);
  });
});

describe('swipe-gesture-curve (§22.3)', () => {
  it('registers right swipes only above the threshold', () => {
    expect(didCrossRightSwipeThreshold(50)).toBe(false);
    expect(didCrossRightSwipeThreshold(120)).toBe(false);     expect(didCrossRightSwipeThreshold(150)).toBe(true);
  });

  it('registers left swipes only below the negative threshold', () => {
    expect(didCrossLeftSwipeThreshold(-50)).toBe(false);
    expect(didCrossLeftSwipeThreshold(-150)).toBe(true);
  });

  it('exposes the threshold as a single named constant', () => {
    expect(SWIPE_DECISION_THRESHOLD_PX).toBe(120);
  });
});

describe('slider-value-bounds (§22.4)', () => {
  it('clamps values into bounds', () => {
    expect(clampValueToBounds(50, 0, 100, 'x')).toBe(50);
    expect(clampValueToBounds(-5, 0, 100, 'x')).toBe(0);
    expect(clampValueToBounds(200, 0, 100, 'x')).toBe(100);
  });

  it('surfaces min > max misconfigurations via console.error, value as-is', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      expect(clampValueToBounds(50, 100, 10, 'mood')).toBe(50);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy.mock.calls[0][0]).toContain('mood');
      expect(errorSpy.mock.calls[0][0]).toContain('min > max');
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('resolves unset bounds to sensible defaults', () => {
    expect(resolveSliderBounds(undefined, undefined)).toEqual({ min: 0, max: 100 });
    expect(areSliderBoundsValid(0, 100)).toBe(true);
    expect(areSliderBoundsValid(100, 10)).toBe(false);
  });
});

describe('duration-equal-split (§22.5)', () => {
  it('splits a total duration evenly', () => {
    expect(splitTotalDuration(3000, 3)).toBe(1000);
  });

  it('falls back to the default per-step duration when unset or invalid', () => {
    expect(splitTotalDuration(0, 3)).toBe(1500);
    expect(splitTotalDuration(undefined, 3)).toBe(1500);
    expect(getDefaultStepDurationMs()).toBe(1500);
  });

  it('never divides by zero', () => {
    expect(splitTotalDuration(3000, 0)).toBe(3000);
  });
});

describe('count-with-locale (§22.6)', () => {
  it('formats counts for human display', () => {
    expect(formatCountWithLocale(250000, 'en-US')).toBe('250,000');
  });

  it('formats with an explicit non-English locale', () => {
    expect(formatCountWithLocale(250000, 'de-DE')).toBe('250.000');
  });

  it('maps non-finite input to "0"', () => {
    expect(formatCountWithLocale(Number.NaN)).toBe('0');
    expect(formatCountWithLocale(Number.POSITIVE_INFINITY)).toBe('0');
  });
});

describe('elapsed-millis (§22.7)', () => {
  it('returns the positive difference', () => {
    const start = new Date('2026-01-01T10:00:00Z');
    const end = new Date('2026-01-01T10:00:30Z');
    expect(elapsedMillis(start, end)).toBe(30_000);
  });

  it('clamps negative differences to zero', () => {
    const start = new Date('2026-01-01T10:00:30Z');
    const end = new Date('2026-01-01T10:00:00Z');
    expect(elapsedMillis(start, end)).toBe(0);
  });
});

describe('card-stack-motion-curve', () => {
  it('exposes consistent enter/exit states', () => {
    expect(getCardEnterInitial()).toEqual({ opacity: 0, scale: 0.95 });
    expect(getCardEnterAnimate()).toEqual({ opacity: 1, scale: 1 });
    expect(getCardEnterExit()).toEqual({ opacity: 0, scale: 1.05 });
    expect(getCardTransitionDurationMs()).toBeGreaterThan(0);
  });
});
