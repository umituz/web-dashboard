import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { BarChart } from "./BarChart";

const labels = ["Oca", "Şub", "Mar"];

describe("BarChart", () => {
  it("renders one column per label with a bar per grouped series", () => {
    const { container } = render(
      <BarChart
        labels={labels}
        series={[
          { label: "A", values: [1, 2, 3] },
          { label: "B", values: [3, 2, 1] },
        ]}
      />,
    );
    const cols = container.querySelectorAll(".udb-barchart__col");
    expect(cols).toHaveLength(3);
    expect(cols[0]!.querySelectorAll(".udb-barchart__bar")).toHaveLength(2);
  });

  it("scales grouped heights against the global max", () => {
    const { container } = render(
      <BarChart labels={labels} series={[{ label: "A", values: [4, 1, 2] }]} />,
    );
    const bars = [...container.querySelectorAll(".udb-barchart__bar")] as HTMLElement[];
    expect(bars.map((b) => b.style.height)).toEqual(["100%", "25%", "50%"]);
  });

  it("scales stacked segments against column totals", () => {
    const { container } = render(
      <BarChart
        labels={labels}
        stacking="stacked"
        series={[
          { label: "A", values: [2, 1, 0] },
          { label: "B", values: [2, 3, 2] },
        ]}
      />,
    );
    const cols = container.querySelectorAll(".udb-barchart__col");
    const first = [...cols[0]!.querySelectorAll(".udb-barchart__bar")] as HTMLElement[];
    expect(first.map((b) => b.style.height)).toEqual(["50%", "50%"]);
    const third = [...cols[2]!.querySelectorAll(".udb-barchart__bar")] as HTMLElement[];
    expect(third[0]!.style.height).toBe("0%");
  });

  it("shows per-series rows plus a total row in the stacked tooltip", () => {
    const { container } = render(
      <BarChart
        labels={labels}
        stacking="stacked"
        totalLabel="Toplam"
        series={[
          { label: "A", values: [2, 1, 0] },
          { label: "B", values: [2, 3, 2] },
        ]}
      />,
    );
    fireEvent.mouseEnter(container.querySelectorAll(".udb-barchart__col")[0]!);
    const tip = container.querySelector(".udb-barchart__tip");
    expect(tip).not.toBeNull();
    expect(tip!.textContent).toContain("A");
    expect(tip!.textContent).toContain("B");
    expect(tip!.textContent).toContain("Toplam");
    expect(tip!.querySelector(".udb-barchart__tiprow--total")!.textContent).toContain("4");
  });

  it("positions the goal line relative to the max", () => {
    const { container } = render(
      <BarChart
        labels={labels}
        goalLine={{ value: 2, label: "Hedef" }}
        series={[{ label: "A", values: [4, 4, 4] }]}
      />,
    );
    const goal = container.querySelector(".udb-barchart__goal") as HTMLElement;
    expect(goal.style.bottom).toBe("50%");
    expect(goal.textContent).toContain("Hedef");
  });

  it("colors series through the --udb-chart tokens by default", () => {
    const { container } = render(
      <BarChart labels={labels} series={[{ label: "A", values: [1, 2, 3] }]} />,
    );
    const bar = container.querySelector(".udb-barchart__bar") as HTMLElement;
    expect(bar.style.background).toContain("var(--udb-chart-1");
    expect(bar.style.background).toContain("#357344");
  });
});
