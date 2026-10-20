import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

function renderAt(path: string, mainId?: string, configOverride?: DashboardLayoutConfig) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="*"
          element={
            <DashboardLayout config={configOverride ?? config} mainId={mainId}>
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

describe("DashboardLayout (command palette)", () => {
  const paletteConfig = (extra?: Partial<DashboardLayoutConfig>): DashboardLayoutConfig => ({
    ...config,
    commandPalette: {
      groups: [{ heading: "Go to", items: [{ id: "home", label: "Home", onSelect: () => {} }] }],
      placeholder: "Search commands…",
    },
    ...extra,
  });

  it("renders the palette's search button in the header and opens it on click", async () => {
    renderAt("/", undefined, paletteConfig());
    fireEvent.click(screen.getByRole("button", { name: /search commands/i }));
    expect(await screen.findByRole("dialog")).toBeTruthy();
    expect(await screen.findByRole("option", { name: "Home" })).toBeTruthy();
  });

  it("toggles the palette with ⌘K / Ctrl+K", async () => {
    renderAt("/", undefined, paletteConfig());
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(await screen.findByRole("dialog")).toBeTruthy();
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("does not bind the shortcut when shortcut: false", () => {
    renderAt("/", undefined, {
      ...config,
      commandPalette: { groups: [], shortcut: false },
    });
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("keeps an explicit searchAction.onActivate over the palette takeover", () => {
    const onActivate = vi.fn();
    renderAt("/", undefined, paletteConfig({ searchAction: { placeholder: "Go search", onActivate } }));
    fireEvent.click(screen.getByRole("button", { name: /go search/i }));
    expect(onActivate).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
