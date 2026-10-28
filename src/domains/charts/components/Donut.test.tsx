import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { Donut } from "./Donut";

describe("Donut", () => {
  it("renders one segment per entry with computed percentages", () => {
    const { container } = render(
      <Donut
        segments={[
          { label: "A", value: 3 },
          { label: "B", value: 1 },
        ]}
        centerValue="4"
        centerLabel="total"
      />,
    );
    expect(container.querySelectorAll(".udb-donut__seg")).toHaveLength(2);
    expect(container.querySelectorAll(".udb-donut__item")).toHaveLength(2);
    expect(container.querySelector(".udb-donut__pct")!.textContent).toBe("75%");
    expect(container.querySelector(".udb-donut__value")!.textContent).toBe("4");
    expect(container.querySelector(".udb-donut__label")!.textContent).toBe("total");
  });

  it("swaps the center readout to the hovered segment", () => {
    const { container } = render(
      <Donut
        segments={[
          { label: "A", value: 3 },
          { label: "B", value: 1 },
        ]}
        centerValue="4"
      />,
    );
    fireEvent.mouseEnter(container.querySelectorAll(".udb-donut__seg")[1]!);
    expect(container.querySelector(".udb-donut__value")!.textContent).toBe("1");
    expect(container.querySelector(".udb-donut__label")!.textContent).toBe("B");
  });

  it("colors segments through the --udb-chart tokens by default", () => {
    const { container } = render(<Donut segments={[{ label: "A", value: 1 }]} />);
    const seg = container.querySelector(".udb-donut__seg")!;
    expect(seg.getAttribute("stroke")).toContain("var(--udb-chart-1");
  });

  it("lets an explicit tone win over the series tokens", () => {
    const { container } = render(
      <Donut segments={[{ label: "A", value: 1, tone: "#ff0000" }]} />,
    );
    expect(container.querySelector(".udb-donut__seg")!.getAttribute("stroke")).toBe("#ff0000");
  });
});
