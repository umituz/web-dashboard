import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { Home } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { defaultLayoutLabels } from "./labels";
import type { DashboardLayoutConfig } from "../types/layout";

const labels = defaultLayoutLabels;

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

function renderAt(path: string, overrides: { config?: DashboardLayoutConfig; mainId?: string } = {}) {
  const { config: cfg = config, mainId } = overrides;
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="*"
          element={
            <DashboardLayout config={cfg} labels={labels} mainId={mainId}>
              {}
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
    renderAt("/", { mainId: "main-content" });
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
    renderAt("/", { config: paletteConfig() });
    fireEvent.click(screen.getByRole("button", { name: /search commands/i }));
    expect(await screen.findByRole("dialog")).toBeTruthy();
    expect(await screen.findByRole("option", { name: "Home" })).toBeTruthy();
  });

  it("toggles the palette with ⌘K / Ctrl+K", async () => {
    renderAt("/", { config: paletteConfig() });
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(await screen.findByRole("dialog")).toBeTruthy();
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("does not bind the shortcut when shortcut: false", () => {
    renderAt("/", { config: { ...config, commandPalette: { groups: [], shortcut: false } } });
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("keeps an explicit searchAction.onActivate over the palette takeover", () => {
    const onActivate = vi.fn();
    renderAt("/", { config: paletteConfig({ searchAction: { placeholder: "Go search", onActivate } }) });
    fireEvent.click(screen.getByRole("button", { name: /go search/i }));
    expect(onActivate).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("derives navigation groups from the sidebar when includeSidebar is set", async () => {
    renderAt("/", {
      config: {
        ...config,
        commandPalette: {
          includeSidebar: true,
          groups: [{ heading: "Quick", items: [{ id: "q", label: "Quick action", onSelect: () => {} }] }],
        },
      },
    });
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(await screen.findByRole("option", { name: "Quick action" })).toBeTruthy();

    const derived = screen.getByRole("option", { name: /home/i });
    expect(derived.textContent).toContain("/");
  });

  it("omits sidebar-derived items from the palette by default", async () => {
    renderAt("/", { config: paletteConfig() });
    fireEvent.keyDown(window, { key: "k", metaKey: true });

    const own = await screen.findByRole("option", { name: "Home" });
    expect(own.textContent).toBe("Home");
  });

  it("supports a search-only palette without static groups (7.1)", async () => {
    renderAt("/", {
      config: {
        ...config,
        commandPalette: { includeSidebar: false, search: async () => [] },
      },
    });
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(await screen.findByRole("dialog")).toBeTruthy();
  });
});

describe("DashboardSidebar (secondaryLabel)", () => {
  const secondaryConfig: DashboardLayoutConfig = {
    sidebarGroups: [
      {
        title: "Main",
        items: [{ path: "/", label: "Home", icon: Home, end: false, secondaryLabel: "오늘" }],
      },
    ],
    brandName: "Test",
    defaultTitle: "Workspace",
  };

  it("renders the secondary label next to the item label", () => {
    renderAt("/", { config: secondaryConfig });
    const link = screen.getByRole("link", { name: /home/i });
    expect(link.textContent).toContain("오늘");
  });

  it("hides the secondary label when the sidebar is collapsed", () => {
    window.localStorage.setItem("udb-collapsed-test", "1");
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="*"
            element={
              <DashboardLayout config={secondaryConfig} labels={labels} collapsedStorageKey="udb-collapsed-test" />
            }
          >
            <Route path="*" element={<div>outlet-content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: /home/i });
    expect(link.textContent).not.toContain("오늘");
    window.localStorage.removeItem("udb-collapsed-test");
  });
});
