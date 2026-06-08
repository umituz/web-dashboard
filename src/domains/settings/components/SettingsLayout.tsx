import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "@umituz/web-design-system/atoms";
import { Button } from "@umituz/web-design-system/atoms";
import { ChevronLeft, Menu } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import type { SettingsConfig } from "../types/settings";

interface SettingsLayoutProps {
  /** Settings configuration */
  config: SettingsConfig;
}

/**
 * Skeleton display duration while route transition simulates load.
 * Single source of truth so it can be tuned in one place.
 */
const ROUTE_LOADING_DELAY_MS = 200;

/**
 * Settings Layout Component
 *
 * Main layout wrapper for settings pages.
 * Provides sidebar navigation and content area.
 */
export const SettingsLayout = ({
  config,
}: SettingsLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Route change triggers a brief loading skeleton to mask content swap.
  // Cleanup is essential: setTimeout must be cancelled on unmount/route change.
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), ROUTE_LOADING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const renderSidebarHeader = (onMenuClick: () => void, showMenuButton: boolean) => (
    <div className="flex h-14 items-center justify-between border-b border-border px-4">
      {!collapsed && (
        <h2 className="text-lg font-semibold text-foreground">
          {config.brandName}
        </h2>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="ml-auto"
        aria-label={showMenuButton ? "Open sidebar" : "Toggle sidebar"}
      >
        {showMenuButton ? (
          <Menu className="h-4 w-4" />
        ) : collapsed ? (
          <Menu className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-background font-sans">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-border bg-card transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {renderSidebarHeader(() => setCollapsed((prev) => !prev), false)}
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
            role="presentation"
          />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-border bg-card shadow-xl">
            {renderSidebarHeader(() => setMobileOpen(false), true)}
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-sm font-semibold text-foreground">
              {config.brandName}
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
