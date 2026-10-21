import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { FilterBar } from "./FilterBar";

describe("FilterBar", () => {
  it("renders search, children and actions in their slots", () => {
    const html = renderToString(
      <FilterBar
        search={{ value: "", onChange: () => {}, placeholder: "Find…" }}
        actions={<button type="button">Sort</button>}

      >
        <span>a chip</span>

      </FilterBar>

    );
    expect(html).toContain("udb-filter-bar");
    expect(html).toContain("udb-filter-bar__search");
    expect(html).toContain("udb-filter-bar__fields");
    expect(html).toContain("a chip");
    expect(html).toContain("udb-filter-bar__actions");
    expect(html).toContain("Sort");
  });

  it("omits absent slots entirely", () => {
    const html = renderToString(<FilterBar />);
    expect(html).toContain("udb-filter-bar");
    expect(html).not.toContain("udb-filter-bar__search");
    expect(html).not.toContain("udb-filter-bar__fields");
    expect(html).not.toContain("udb-filter-bar__actions");
  });
});
