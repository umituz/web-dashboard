import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { usePageTitle } from "./dashboard";

function Probe({ title, suffix, fallback }: { title?: string; suffix?: string; fallback?: string }) {
  usePageTitle(title, { suffix, fallback });
  return null;
}

describe("usePageTitle", () => {
  it("sets `title · suffix` when both are given", () => {
    document.title = "before";
    render(<Probe title="Search" suffix="Lingora" />);
    expect(document.title).toBe("Search · Lingora");
  });

  it("sets the bare title without a suffix", () => {
    render(<Probe title="Search" />);
    expect(document.title).toBe("Search");
  });

  it("falls back when the route passes no title", () => {
    render(<Probe fallback="Lingora — English, examined properly" />);
    expect(document.title).toBe("Lingora — English, examined properly");
  });

  it("leaves the previous title untouched with neither title nor fallback", () => {
    document.title = "kept";
    render(<Probe />);
    expect(document.title).toBe("kept");
  });
});
