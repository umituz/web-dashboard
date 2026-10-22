import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import {
  FilterPanel,
  FilterSection,
  CheckFilterList,
  SingleSelectFilterList,
} from "./FilterPanel";

describe("FilterPanel", () => {
  it("renders the header, clear action and sections", () => {
    const html = renderToString(
      <FilterPanel title="Program filters" onClear={() => undefined}>
        <FilterSection title="Status">
          <span>body</span>
        </FilterSection>
      </FilterPanel>,
    );
    expect(html).toContain('aria-label="Program filters"');
    expect(html).toContain("Program filters");
    expect(html).toContain("Clear all");
    expect(html).toContain("Status");
  });

  it("can disable and label the clear action", () => {
    const html = renderToString(
      <FilterPanel onClear={() => undefined} clearDisabled clearLabel="Temizle">
        <span>body</span>
      </FilterPanel>,
    );
    expect(html).toContain("Temizle");
    expect(html).toContain("disabled");
  });
});

describe("CheckFilterList", () => {
  const options = Array.from({ length: 10 }, (_, i) => ({
    value: `v${i}`,
    label: `Option ${i}`,
  }));

  it("marks selected options checked", () => {
    const html = renderToString(
      <CheckFilterList options={options.slice(0, 3)} selected={["v1"]} onToggle={() => undefined} />,
    );
    expect(html).toContain('aria-checked="true"');
    expect(html).toContain("Option 1");
  });

  it("caps visible options, keeps hidden selected ones and notes the rest", () => {
    const html = renderToString(
      <CheckFilterList options={options} selected={["v9"]} onToggle={() => undefined} maxVisible={4} />,
    );
    expect(html).toContain("Option 3");
    expect(html).toContain("Option 9");
    expect(html).not.toContain("Option 5<");
    expect(html).toContain("+5 more");
  });
});

describe("SingleSelectFilterList", () => {
  const options = [
    { value: "all", label: "All", count: 42 },
    { value: "open", label: "Open", count: 7 },
  ];

  it("marks the active option as the checked radio", () => {
    const html = renderToString(
      <SingleSelectFilterList options={options} value="open" onChange={() => undefined} />,
    );
    expect(html).toContain('role="radio"');
    expect(html).toContain('aria-checked="true"');
    expect(html).toContain(">7</span>");
  });
});

import { BarChart } from "../../charts/components";

describe("BarChart per-bar accents", () => {
  it("paints bars with accent overrides falling back to the series tone", () => {
    const html = renderToString(
      <BarChart
        labels={["Mon", "Tue"]}
        series={[
          {
            label: "load",
            values: [3, 5],
            tone: "#111111",
            accents: ["#ff0000", undefined],
          },
        ]}
      />,
    );
    expect(html).toContain("#ff0000");
    expect(html).toContain("#111111");
  });
});
