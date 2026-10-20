import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Home } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import type { DashboardLayoutConfig } from "../types/layout";

const config: DashboardLayoutConfig = {
  sidebarGroups: [
    {
      title: "Main",
      items: [{ path: "/", label: "Home", icon: Home, end: false }],
    },
  ],
  brandName: "Test",
  defaultTitle: "Workspace",
};

function renderAt(path: string, mainId?: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="*"
          element={
            <DashboardLayout config={config} mainId={mainId}>
              {/* children are ignored — the layout renders an Outlet */}
            </DashboardLayout>
          }
        >
          <Route path="*" element={<div>outlet-content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("DashboardLayout (shell a11y)", () => {
  it("renders a skip link targeting the main landmark", () => {
    renderAt("/");
    const skip = screen.getByRole("link", { name: /skip to content/i });
    expect(skip.getAttribute("href")).toBe("#udb-main");
    expect(document.getElementById("udb-main")).not.toBeNull();
  });

  it("honours a custom mainId on both the link and the landmark", () => {
    renderAt("/", "main-content");
    expect(screen.getByRole("link", { name: /skip to content/i }).getAttribute("href")).toBe("#main-content");
    expect(document.getElementById("main-content")).not.toBeNull();
  });

  it("renders the routed outlet inside the main landmark", () => {
    renderAt("/");
    const main = document.getElementById("udb-main");
    expect(main?.textContent).toContain("outlet-content");
  });
});
