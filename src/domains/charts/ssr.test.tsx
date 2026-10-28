import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { BarChart } from "./components/BarChart";
import { Donut } from "./components/Donut";
import { LineChart } from "./components/LineChart";
import { ActivityHeatmap } from "./components/ActivityHeatmap";
import { ChartCard } from "./components/ChartCard";
import { HBars } from "./components/HBars";
import { Sparkline } from "./components/Sparkline";

describe("charts server rendering", () => {
  it("renders every chart primitive to static markup", () => {
    const html = [
      renderToString(
        <ChartCard title="T" tip={null}>
          <span>body</span>
        </ChartCard>,
      ),
      renderToString(<BarChart labels={["a", "b"]} series={[{ label: "A", values: [1, 2] }]} />),
      renderToString(<BarChart labels={["a"]} stacking="stacked" series={[{ label: "A", values: [2] }, { label: "B", values: [2] }]} />),
      renderToString(<Donut segments={[{ label: "A", value: 1 }]} centerValue="1" />),
      renderToString(<LineChart labels={["a", "b"]} series={[{ label: "A", values: [1, 2], areaFill: "gradient" }]} />),
      renderToString(<ActivityHeatmap cells={[{ day: "2026-01-01", value: 3 }]} />),
      renderToString(<Sparkline data={[1, 2]} />),
      renderToString(<HBars rows={[{ label: "A", value: 1 }]} />),
    ].join("");
    expect(html).toContain("udb-chartcard");
    expect(html).toContain("udb-barchart__bars--stacked");
    expect(html).toContain("udb-donut");
    expect(html).toContain("udb-linechart");
    expect(html).toContain("linearGradient");
    expect(html).toContain("udb-heatmap__cell--l");
    expect(html).toContain("udb-hbars");
  });
});
