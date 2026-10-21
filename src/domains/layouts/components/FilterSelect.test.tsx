import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { FilterSelect } from "./FilterSelect";

describe("FilterSelect", () => {
  const options = [
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
  ];

  it("renders the all-entry plus options and reports the chosen value", () => {
    const chosen: string[] = [];
    const html = renderToString(
      <FilterSelect
        value="open"
        options={options}
        ariaLabel="Filter by status"
        allLabel="Any status"
        onChange={(v) => chosen.push(v)}
      />,
    );
    expect(html).toContain('aria-label="Filter by status"');
    expect(html).toContain("Any status");
    expect(html).toContain("Open");
    expect(html).toContain("Closed");
    expect(chosen).toEqual([]);
  });

  it("defaults the reset entry label to All", () => {
    const html = renderToString(
      <FilterSelect value="" options={options} ariaLabel="Filter" onChange={() => {}} />,
    );
    expect(html).toContain(">All</option>");
  });
});
