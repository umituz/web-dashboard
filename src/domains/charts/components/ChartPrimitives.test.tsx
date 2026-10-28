import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ChartCard } from "./ChartCard";
import { Legend } from "./Legend";
import { HBars } from "./HBars";
import { Sparkline } from "./Sparkline";
import type { TipState } from "../utils";

describe("ChartCard", () => {
  const tip: TipState = { x: 10, y: 20, title: "bugün", rows: [{ label: "A", value: "7", color: "#111111" }] };

  it("renders the heading, tools, body and tooltip", () => {
    const { container } = render(
      <ChartCard
        title="Gelir"
        subtitle="son 30 gün"
        legend={<Legend items={[{ label: "A", color: "#111111", value: "7" }]} />}
        actions={<button type="button">act</button>}
        tip={tip}
      >
        <div>plot</div>
      </ChartCard>,
    );
    expect(container.querySelector(".udb-chartcard__title")!.textContent).toBe("Gelir");
    expect(container.querySelector(".udb-chartcard__sub")!.textContent).toBe("son 30 gün");
    expect(container.querySelector(".udb-chartlegend__value")!.textContent).toBe("7");
    expect(container.querySelector(".udb-chartcard__tools button")).not.toBeNull();
    expect(container.querySelector(".udb-charttip__title")!.textContent).toBe("bugün");
    expect(container.querySelector(".udb-charttip")!.textContent).toContain("7");
  });

  it("omits the tooltip when tip is null and zeroes body padding when bare", () => {
    const { container } = render(
      <ChartCard title="T" tip={null} bare>
        <div>x</div>
      </ChartCard>,
    );
    expect(container.querySelector(".udb-charttip")).toBeNull();
    expect(container.querySelector<HTMLElement>(".udb-chartcard__body")!.style.padding).toBe("0px");
  });
});

describe("Legend", () => {
  it("renders items with optional value and hint", () => {
    const { container } = render(
      <Legend
        items={[
          { label: "A", color: "#111111", value: "3" },
          { label: "B", color: "#222222", hint: "tahmini" },
        ]}
      />,
    );
    const items = container.querySelectorAll(".udb-chartlegend__item");
    expect(items).toHaveLength(2);
    expect(items[0]!.textContent).toContain("3");
    expect(items[1]!.textContent).toContain("tahmini");
  });
});

describe("HBars", () => {
  it("scales fill widths against the largest row and applies tones", () => {
    const { container } = render(
      <HBars
        rows={[
          { label: "A", value: 5 },
          { label: "B", value: 10, tone: "#00ff00" },
        ]}
        formatValue={(n) => `${n}₺`}
      />,
    );
    const fills = [...container.querySelectorAll(".udb-hbars__fill")] as HTMLElement[];
    expect(fills.map((f) => f.style.width)).toEqual(["50%", "100%"]);
    expect(fills[1]!.style.background).toBe("rgb(0, 255, 0)");
    expect(container.querySelector(".udb-hbars__value")!.textContent).toBe("5₺");
  });
});

describe("Sparkline", () => {
  it("renders a gradient area, line and end dot", () => {
    const { container } = render(<Sparkline data={[1, 5, 3]} />);
    expect(container.querySelector("linearGradient")).not.toBeNull();
    expect(container.querySelector("circle")).not.toBeNull();
    expect(container.querySelectorAll("path")).toHaveLength(2);
  });

  it("renders nothing for fewer than two points", () => {
    const { container } = render(<Sparkline data={[1]} />);
    expect(container.firstChild).toBeNull();
  });
});
