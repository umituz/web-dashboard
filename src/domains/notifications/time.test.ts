import { describe, expect, it } from "vitest";
import { severityOf, timeAgo, timestampOf } from "./time";
import type { NotificationRecord } from "./types";

const NOW = Date.parse("2026-10-23T12:00:00Z");
const minutesAgo = (n: number) => new Date(NOW - n * 60_000).toISOString();

describe("timeAgo", () => {
  it("buckets elapsed time into the label patterns", () => {
    expect(timeAgo(minutesAgo(0.5), {}, NOW)).toBe("just now");
    expect(timeAgo(minutesAgo(5), {}, NOW)).toBe("5m ago");
    expect(timeAgo(minutesAgo(90), {}, NOW)).toBe("1h ago");
    expect(timeAgo(minutesAgo(3 * 24 * 60), {}, NOW)).toBe("3d ago");
  });

  it("falls back to the locale date beyond a week", () => {
    const old = "2026-09-01T10:00:00Z";
    expect(timeAgo(old, {}, NOW)).toBe(new Date(old).toLocaleDateString());
  });

  it("honors label overrides and returns empty for invalid input", () => {
    expect(timeAgo(minutesAgo(5), { minutesPattern: "{n} dk önce" }, NOW)).toBe("5 dk önce");
    expect(timeAgo("not-a-date", {}, NOW)).toBe("");
  });
});

describe("timestampOf", () => {
  it("prefers at over createdAt and accepts either", () => {
    expect(timestampOf({ id: "1", type: "x", at: "a", createdAt: "b" })).toBe("a");
    expect(timestampOf({ id: "2", type: "x", createdAt: "b" })).toBe("b");
    expect(timestampOf({ id: "3", type: "x" })).toBeUndefined();
  });
});

describe("severityOf", () => {
  it("normalizes critical to danger and defaults to info", () => {
    const base = { id: "1", type: "x" } as NotificationRecord;
    expect(severityOf({ ...base, severity: "critical" })).toBe("danger");
    expect(severityOf({ ...base, severity: "warning" })).toBe("warning");
    expect(severityOf(base)).toBe("info");
  });
});
