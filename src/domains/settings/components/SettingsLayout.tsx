import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SettingsSection } from "./SettingsSection";
import type { SettingsConfig } from "../types/settings";
import { Skeleton } from "@umituz/web-design-system/atoms";
import { ChevronLeft, Menu } from "lucide-react";
import { Button } from "@umituz/web-design-system/atoms";

interface SettingsLayoutProps {
  /** Settings configuration */
  config: SettingsConfig;
}

/**
 * Settings Layout Component
 *
 * Main layout wrapper for settings pages.
 * Provides sidebar navigation and content area.
 *
 * @param props - Settings layout props
 */
export const SettingsLayout = ({
  config,
}: SettingsLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate loading on route change
  useState(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  });

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-background font-sans">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-border bg-card transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-foreground">
              {config.brandName || "Settings"}
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {config.sections.map((section) => (
            <SettingsSection
              key={section.key}
              section={section}
              currentPath={location.pathname}
              onNavigate={handleNavigate}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-border bg-card shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <h2 className="text-lg font-semibold text-foreground">
                {config.brandName || "Settings"}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <Menu className="h-4 w-4" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto p-2">
              {config.sections.map((section) => (
                <SettingsSection
                  key={section.key}
                  section={section}
                  currentPath={location.pathname}
                  onNavigate={handleNavigate}
                />
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card/50 backdrop-blur-md px-4 shrink-0 md:hidden">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-sm font-semibold text-foreground">
              {config.brandName || "Settings"}
            </h2>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {loading ? (
            <div className="mx-auto w-full max-w-4xl space-y-6">
              <Skeleton className="h-8 w-1/3 rounded-xl" />
              <div className="grid gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsLayout;
