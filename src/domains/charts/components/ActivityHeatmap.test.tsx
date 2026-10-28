import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ActivityHeatmap } from "./ActivityHeatmap";

const cells = [
  { day: "2026-01-01", value: 0 },
  { day: "2026-01-02", value: 5 },
  { day: "2026-01-03", value: 10 },
];

describe("ActivityHeatmap", () => {
  it("levels cells by intensity against the peak", () => {
    const { container } = render(<ActivityHeatmap cells={cells} max={10} />);
    const cellEls = container.querySelectorAll(".udb-heatmap__cell");
    expect(cellEls).toHaveLength(3);
    expect(cellEls[0]!.className).toContain("udb-heatmap__cell--l0");
    expect(cellEls[1]!.className).toContain("udb-heatmap__cell--l2");
    expect(cellEls[2]!.className).toContain("udb-heatmap__cell--l4");
  });

  it("exposes each cell title visually and for screen readers", () => {
    const { container } = render(<ActivityHeatmap cells={cells} max={10} />);
    expect(container.querySelector(".udb-heatmap__cell")!.getAttribute("title")).toBe(
      "2026-01-01: 0",
    );
    expect(container.querySelector(".udb-heatmap__sr")!.textContent).toBe("2026-01-01: 0");
  });

  it("keeps the levelClassNames escape hatch", () => {
    const { container } = render(
      <ActivityHeatmap
        cells={cells}
        max={10}
        levelClassNames={["z0", "z1", "z2", "z3", "z4"]}
      />,
    );
    const cellEls = container.querySelectorAll(".udb-heatmap__cell");
    expect(cellEls[0]!.className).toContain("z0");
    expect(cellEls[0]!.className).not.toContain("udb-heatmap__cell--");
  });

  it("derives the peak from the data when max is omitted", () => {
    const { container } = render(<ActivityHeatmap cells={cells} />);
    const cellEls = container.querySelectorAll(".udb-heatmap__cell");
    expect(cellEls[1]!.className).toContain("udb-heatmap__cell--l2");
    expect(cellEls[2]!.className).toContain("udb-heatmap__cell--l4");
  });
});
