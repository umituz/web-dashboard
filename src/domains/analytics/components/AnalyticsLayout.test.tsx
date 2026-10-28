import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AnalyticsLayout } from "./AnalyticsLayout";
import { presetRange } from "@umituz/web-design-system/organisms";

const kpis = [
  { id: "rev", label: "Revenue", value: 120, previousValue: 100 },
  { id: "users", label: "Users", value: 42 },
];

describe("AnalyticsLayout", () => {
  it("renders kpis through the design-system KpiCard with deltas", () => {
    render(<AnalyticsLayout title="Analytics" kpis={kpis} />);
    expect(screen.getByText("Revenue")).toBeTruthy();
    expect(screen.getByText("120")).toBeTruthy();
    expect(screen.getByText("+20.0%")).toBeTruthy();
    expect(screen.getByText("Users")).toBeTruthy();
    expect(screen.getByText("42")).toBeTruthy();
  });

  it("formats numeric kpi values through the format hook", () => {
    render(
      <AnalyticsLayout
        title="A"
        kpis={[{ id: "rev", label: "Revenue", value: 1200, format: (v) => `${v}₺` }]}
      />,
    );
    expect(screen.getByText("1200₺")).toBeTruthy();
  });

  it("renders skeletons while loading and hides content", () => {
    const { container } = render(
      <AnalyticsLayout title="Analytics" loading kpis={kpis} charts={<div>chartbody</div>} />,
    );
    expect(container.querySelectorAll(".udb-analytics__kpi-skeleton")).toHaveLength(4);
    expect(container.querySelector(".udb-analytics__chart-skeleton")).not.toBeNull();
    expect(screen.queryByText("Revenue")).toBeNull();
    expect(screen.queryByText("chartbody")).toBeNull();
  });

  it("shows the error state with a retry action", () => {
    const onRetry = vi.fn();
    render(<AnalyticsLayout title="Analytics" error="Load failed" onRetry={onRetry} />);
    expect(screen.getByText("Load failed")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("wires refresh and export through custom labels", () => {
    const onRefresh = vi.fn();
    const onExport = vi.fn();
    render(
      <AnalyticsLayout
        title="Analytics"
        range={presetRange("30d")}
        onRangeChange={() => undefined}
        onRefresh={onRefresh}
        onExport={onExport}
        labels={{ refresh: "Yenile", export: "Dışa aktar" }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Yenile" }));
    fireEvent.click(screen.getByRole("button", { name: "Dışa aktar" }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(onExport).toHaveBeenCalledTimes(1);
  });

  it("renders the range picker, charts slot, filters slot and children", () => {
    render(
      <AnalyticsLayout
        title="A"
        range={presetRange("30d")}
        onRangeChange={() => undefined}
        filters={<div data-testid="filters">f</div>}
        charts={<div data-testid="charts">c</div>}
      >
        <div data-testid="child">x</div>
      </AnalyticsLayout>,
    );
    expect(screen.getByLabelText("Date range")).toBeTruthy();
    expect(screen.getByTestId("filters")).toBeTruthy();
    expect(screen.getByTestId("charts")).toBeTruthy();
    expect(screen.getByTestId("child")).toBeTruthy();
  });
});
