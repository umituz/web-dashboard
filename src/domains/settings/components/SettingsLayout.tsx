import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Skeleton, Button } from "../../../primitives";
import { ChevronLeft, Menu } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import type { SettingsConfig } from "../types/settings";

interface SettingsLayoutProps {
  /** Settings configuration */
  config: SettingsConfig;
  /**
   * Artificial route-transition skeleton duration in ms (default: 0 = off).
   * Content renders immediately by default; set > 0 only if you want
   * a skeleton to mask route swaps.
   */
  routeTransitionMs?: number;
}

/**
 * Settings Layout Component
 *
 * Main layout wrapper for settings pages.
 * Provides sidebar navigation and content area. Styling is entirely
 * `udb-settings*` classes from the package stylesheet.
 */
export const SettingsLayout = ({
  config,
  routeTransitionMs = 0,
}: SettingsLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(routeTransitionMs > 0);

  // Optional route-change skeleton. Cleanup is essential: setTimeout must be
  // cancelled on unmount/route change. With routeTransitionMs = 0 (default)
  // no artificial delay is applied at all.
  useEffect(() => {
    if (routeTransitionMs <= 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), routeTransitionMs);
    return () => clearTimeout(timer);
  }, [location.pathname, routeTransitionMs]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const renderSidebarHeader = (onMenuClick: () => void, showMenuButton: boolean) => (
    <div className="udb-settings__sidebar-header">
      {!collapsed && (
        <h2 className="udb-settings__sidebar-title">
          {config.brandName}
        </h2>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="udb-settings__sidebar-toggle"
        aria-label={showMenuButton ? "Open sidebar" : "Toggle sidebar"}
      >
        {showMenuButton ? (
          <Menu className="udb-settings__toggle-icon" />
        ) : collapsed ? (
          <Menu className="udb-settings__toggle-icon" />
        ) : (
          <ChevronLeft className="udb-settings__toggle-icon" />
        )}
      </Button>
    </div>
  );

  return (
    <div className="udb-root udb-settings">
      {/* Desktop Sidebar */}
      <aside className={`udb-settings__sidebar${collapsed ? " udb-settings__sidebar--collapsed" : ""}`}>
        {renderSidebarHeader(() => setCollapsed((prev) => !prev), false)}
        <nav className="udb-settings__nav">
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
        <div className="udb-settings__mobile">
          <div
            className="udb-backdrop"
            onClick={() => setMobileOpen(false)}
            role="presentation"
          />
          <aside className="udb-settings__mobile-sidebar">
            {renderSidebarHeader(() => setMobileOpen(false), true)}
            <nav className="udb-settings__nav">
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
      <div className="udb-settings__main">
        {/* Mobile Header */}
        <header className="udb-settings__mobile-header">
          <div className="udb-settings__mobile-lead">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu className="udb-settings__toggle-icon-lg" />
            </Button>
            <h2 className="udb-settings__mobile-title">
              {config.brandName}
            </h2>
          </div>
        </header>

        <main className="udb-settings__content">
          {loading ? (
            <div className="udb-settings__skeleton">
              <Skeleton className="udb-skeleton--title" />
              <div className="udb-settings__skeleton-list">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="udb-settings__skeleton-row" />
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
