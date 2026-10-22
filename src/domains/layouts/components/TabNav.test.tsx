import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { TabNav } from "./TabNav";

describe("TabNav", () => {
  const items = [
    { to: "/events", label: "Events", end: true },
    { to: "/events/program", label: "Program" },
  ];

  it("renders nav links with the accessible label", () => {
    const html = renderToString(
      <MemoryRouter>
        <TabNav items={items} />
      </MemoryRouter>,
    );
    expect(html).toContain('aria-label="Section tabs"');
    expect(html).toContain("Events");
    expect(html).toContain("Program");
    expect(html).toContain('href="/events"');
    expect(html).toContain('href="/events/program"');
  });

  it("marks the matching route active", () => {
    const html = renderToString(
      <MemoryRouter initialEntries={["/events/program"]}>
        <TabNav items={items} />
      </MemoryRouter>,
    );
    expect(html).toContain("udb-tabnav__tab--active");
  });
});
