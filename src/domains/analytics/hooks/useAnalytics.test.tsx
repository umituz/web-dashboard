import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { presetRange } from "@umituz/web-design-system/organisms";
import type { DateRange } from "@umituz/web-design-system/organisms";
import { useAnalytics, createStubAnalyticsApiClient } from "./useAnalytics";
import type { AnalyticsPayload } from "./useAnalytics";

const payload: AnalyticsPayload = {
  kpis: [{ id: "rev", label: "Revenue", value: 5 }],
  series: [{ date: "2026-01-01", value: 5 }],
};

describe("useAnalytics", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("loads analytics for the default 30d range on mount", async () => {
    const loadAnalytics = vi.fn(async (_range: DateRange) => payload);
    const apiClient = { loadAnalytics };
    const { result } = renderHook(() => useAnalytics({ apiClient }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(loadAnalytics).toHaveBeenCalledTimes(1);
    const range = loadAnalytics.mock.calls[0]![0];
    expect(range.preset).toBe("30d");
    expect(range.to).toBe(new Date().toISOString().slice(0, 10));
    expect(result.current.kpis).toEqual(payload.kpis);
    expect(result.current.series).toEqual(payload.series);
    expect(result.current.error).toBeNull();
  });

  it("honors an explicit initial range", async () => {
    const loadAnalytics = vi.fn(async (_range: DateRange) => payload);
    const initial = presetRange("7d");
    const apiClient = { loadAnalytics };
    const { result } = renderHook(() =>
      useAnalytics({ apiClient, initialRange: initial }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(loadAnalytics.mock.calls[0]![0]).toEqual(initial);
  });

  it("refetches when the range changes", async () => {
    const loadAnalytics = vi.fn(async (_range: DateRange) => payload);
    const apiClient = { loadAnalytics };
    const { result } = renderHook(() => useAnalytics({ apiClient }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.updateRange(presetRange("7d")));
    await waitFor(() => expect(loadAnalytics).toHaveBeenCalledTimes(2));
    expect(loadAnalytics.mock.calls[1]![0].preset).toBe("7d");
  });

  it("surfaces load errors", async () => {
    const apiClient = {
      loadAnalytics: async () => {
        throw new Error("boom");
      },
    };
    const { result } = renderHook(() => useAnalytics({ apiClient }));
    await waitFor(() => expect(result.current.error).toBe("boom"));
    expect(result.current.isLoading).toBe(false);
  });

  it("discards a stale response that resolves after a newer one", async () => {
    let resolveSlow!: (p: AnalyticsPayload) => void;
    const slow = new Promise<AnalyticsPayload>((resolve) => {
      resolveSlow = resolve;
    });
    let call = 0;
    const loadAnalytics = vi.fn((_range: DateRange) => {
      call += 1;
      return call === 1 ? slow : Promise.resolve({ kpis: [], series: [{ date: "d", value: 2 }] });
    });
    const apiClient = { loadAnalytics };
    const { result } = renderHook(() => useAnalytics({ apiClient }));

    act(() => result.current.updateRange(presetRange("7d")));
    await waitFor(() => expect(result.current.series).toEqual([{ date: "d", value: 2 }]));

    await act(async () => {
      resolveSlow({ kpis: [], series: [{ date: "stale", value: 9 }] });
    });
    expect(result.current.series).toEqual([{ date: "d", value: 2 }]);
  });

  it("refuses to export when the client has no exporter", async () => {
    const apiClient = { loadAnalytics: async () => payload };
    const { result } = renderHook(() => useAnalytics({ apiClient }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await expect(result.current.exportData({ format: "csv" })).rejects.toThrow(
      "AnalyticsApiClient.exportAnalytics not configured",
    );
  });

  it("downloads the blob produced by the client exporter", async () => {
    const createObjectURL = vi.fn(() => "blob:csv");
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, "createObjectURL", { value: createObjectURL, configurable: true });
    Object.defineProperty(URL, "revokeObjectURL", { value: revokeObjectURL, configurable: true });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const exportAnalytics = vi.fn(async () => new Blob(["a,b"], { type: "text/csv" }));

    const apiClient = { loadAnalytics: async () => payload, exportAnalytics };
    const { result } = renderHook(() => useAnalytics({ apiClient }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.exportData({ format: "csv", filename: "report.csv" });
    });
    expect(exportAnalytics).toHaveBeenCalledWith(payload, { format: "csv", filename: "report.csv" });
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:csv");
  });

  it("stubs reject until configured", async () => {
    const stub = createStubAnalyticsApiClient();
    await expect(stub.loadAnalytics(presetRange("30d"))).rejects.toThrow(
      "AnalyticsApiClient not configured",
    );
  });
});
