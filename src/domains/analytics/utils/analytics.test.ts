/**
 * Tests for pure analytics utility functions.
 */

import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatPercentage,
  formatCurrency,
  calculateGrowth,
  getTrend,
  calculateConversionRate,
  calculateDropOffRate,
  calculateMovingAverage,
  detectOutliers,
  aggregateByPeriod,
  roundTo,
  createDateRangePreset,
} from "./analytics";

describe("formatNumber", () => {
  it("keeps whole numbers below 1K whole", () => {
    expect(formatNumber(999)).toBe("999");
    expect(formatNumber(42)).toBe("42");
  });

  it("abbreviates at the K/M/B thresholds", () => {
    expect(formatNumber(1000)).toBe("1.0K");
    expect(formatNumber(1500)).toBe("1.5K");
    expect(formatNumber(2_500_000)).toBe("2.5M");
    expect(formatNumber(3_000_000_000)).toBe("3.0B");
  });

  it("respects the decimals argument", () => {
    expect(formatNumber(1234, 2)).toBe("1.23K");
  });
});

describe("formatPercentage", () => {
  it("appends % to a rounded value", () => {
    expect(formatPercentage(12.345)).toBe("12.3%");
  });

  it("passes through negatives and values above 100 (generic formatter)", () => {
    expect(formatPercentage(-5)).toBe("-5.0%");
    expect(formatPercentage(120)).toBe("120.0%");
  });
});

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    expect(formatCurrency(10)).toBe("$10");
  });

  it("honors the locale parameter", () => {
    // Signature is (value, currency, decimals, locale); the assertions
    // expect 2 decimal places, which "en-US"/"de-DE" format as ,50 / ,50.
    expect(formatCurrency(1234.5, "USD", 2, "en-US")).toBe("$1,234.50");
    expect(formatCurrency(1234.5, "EUR", 2, "de-DE")).toContain("1.234,50");
  });
});

describe("calculateGrowth", () => {
  it("treats growth from zero as 100% (or 0 when nothing grew)", () => {
    expect(calculateGrowth(50, 0)).toBe(100);
    expect(calculateGrowth(0, 0)).toBe(0);
  });

  it("computes positive growth as a percentage", () => {
    expect(calculateGrowth(150, 100)).toBe(50);
  });

  it("computes negative growth", () => {
    expect(calculateGrowth(50, 100)).toBe(-50);
  });
});

describe("getTrend", () => {
  it("treats ±0.1 as stable", () => {
    expect(getTrend(0)).toBe("stable");
    expect(getTrend(0.1)).toBe("stable");
    expect(getTrend(-0.1)).toBe("stable");
  });

  it("detects up and down beyond the threshold", () => {
    expect(getTrend(0.2)).toBe("up");
    expect(getTrend(-0.2)).toBe("down");
  });
});

describe("calculateConversionRate", () => {
  it("returns 0 for an empty total", () => {
    expect(calculateConversionRate(5, 0)).toBe(0);
  });

  it("computes the percentage", () => {
    expect(calculateConversionRate(25, 100)).toBe(25);
  });
});

describe("calculateDropOffRate", () => {
  it("returns 0 when the previous step is 0", () => {
    expect(calculateDropOffRate(10, 0)).toBe(0);
  });

  it("computes drop-off between steps", () => {
    expect(calculateDropOffRate(25, 100)).toBe(75);
  });
});

describe("calculateMovingAverage", () => {
  it("throws for a non-positive window", () => {
    expect(() => calculateMovingAverage([1, 2], 0)).toThrow(RangeError);
  });

  it("returns an empty array for empty input", () => {
    expect(calculateMovingAverage([], 3)).toEqual([]);
  });

  it("emits a trailing average per point (partial windows at the start)", () => {
    expect(calculateMovingAverage([1, 2, 3], 2)).toEqual([1, 1.5, 2.5]);
  });
});

describe("detectOutliers", () => {
  it("returns [] for an empty series", () => {
    expect(detectOutliers([])).toEqual([]);
  });

  it("returns indices of values beyond 2 standard deviations", () => {
    // mean ≈ 16.7, population stdev ≈ 14.9 → only 50 exceeds 2σ.
    expect(detectOutliers([10, 10, 10, 10, 10, 50])).toEqual([5]);
  });

  it("returns no indices for a uniform series", () => {
    expect(detectOutliers([7, 7, 7, 7])).toEqual([]);
  });
});

describe("aggregateByPeriod", () => {
  it("sums numeric fields per day bucket", () => {
    const result = aggregateByPeriod(
      [
        { date: "2026-01-01", value: 10 },
        { date: "2026-01-01", value: 5 },
        { date: "2026-01-02", value: 7 },
      ],
      "day",
    );
    expect(result).toEqual([
      { date: "2026-01-01", value: 15 },
      { date: "2026-01-02", value: 7 },
    ]);
  });

  it("groups by month key when period is month", () => {
    const result = aggregateByPeriod(
      [
        { date: "2026-01-05", value: 1 },
        { date: "2026-01-25", value: 2 },
      ],
      "month",
    );
    expect(result).toEqual([{ date: "2026-01", value: 3 }]);
  });
});

describe("roundTo", () => {
  it("rounds to the given decimals", () => {
    expect(roundTo(3.14159, 2)).toBe(3.14);
  });
});

describe("createDateRangePreset", () => {
  it("resolves from/to dates around today", () => {
    const preset = createDateRangePreset("Last 7 Days", 7);
    const today = new Date().toISOString().split("T")[0];
    expect(preset.value).toBe("last-7-days");
    expect(preset.to).toBe(today);
    expect(preset.from).toBeDefined();
    expect(preset.from).not.toBe(preset.to);
  });
});
