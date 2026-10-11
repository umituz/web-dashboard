import { useState, useEffect } from "react";
import { useLocation, Outlet, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../../primitives";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import type { DashboardLayoutConfig } from "../types/layout";
import type { DashboardNotification } from "../types/notification";
import type { DashboardUser } from "../types/user";

interface DashboardLayoutProps {
  /** Layout configuration */
  config: DashboardLayoutConfig;
  /** Auth user */
  user?: DashboardUser;
  /** Auth loading state */
  authLoading?: boolean;
  /** Authenticated state */
  isAuthenticated?: boolean;
  /** Notifications */
  notifications?: DashboardNotification[];
  /** Logout function */
  onLogout?: () => Promise<void>;
  /** Mark all as read function */
  onMarkAllRead?: () => void;
  /** Dismiss notification function */
  onDismissNotification?: (id: string) => void;
  /** Login route for redirect */
  loginRoute?: string;
  /** Current theme, forwarded to the header toggle (default: "light") */
  theme?: "light" | "dark";
  /** Theme toggle handler — header toggle is hidden when omitted */
  onToggleTheme?: () => void;
  /**
   * Artificial route-transition skeleton duration in ms (default: 0 = off).
   * Content renders immediately by default; set > 0 only if you want
   * a skeleton to mask route swaps.
   */
  routeTransitionMs?: number;
}

/**
 * Dashboard Layout Component
 *
 * Main layout wrapper for dashboard pages.
 * Provides sidebar, header, and content area with responsive design.
 *
 * Features:
 * - Collapsible sidebar
 * - Mobile menu overlay
 * - Breadcrumb page titles
 * - Loading skeletons (opt-in via routeTransitionMs)
 * - Auth protection
 *
 * All styling comes from `udb-*` classes in the package stylesheet
 * (`@umituz/web-dashboard/styles.css`) — no utility framework required.
 *
 * @param props - Dashboard layout props
 */
export const DashboardLayout = ({
  config,
  user,
  authLoading = false,
  isAuthenticated = true,
  notifications = [],
  onLogout,
  onMarkAllRead,
  onDismissNotification,
  loginRoute = "/login",
  theme,
  onToggleTheme,
  routeTransitionMs = 0,
}: DashboardLayoutProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(routeTransitionMs > 0);

  useEffect(() => {
    if (routeTransitionMs <= 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), routeTransitionMs);
    return () => clearTimeout(timer);
  }, [location.pathname, routeTransitionMs]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (authLoading) return null;
  if (!isAuthenticated) return <Navigate to={loginRoute} replace />;

  const activeItem = config.sidebarGroups
    .flatMap((group) => group.items)
    .find((i) => i.path === location.pathname);

  const getTitle = () => {
    if (activeItem) return t(activeItem.label);
    const extraTitle = config.extraTitleMap?.[location.pathname];
    if (extraTitle) return t(extraTitle);
    return config.defaultTitle ?? "Dashboard";
  };

  const currentTitle = getTitle();

  return (
    <div className="udb-root udb-layout">
      {/* Desktop Sidebar */}
      <aside
        className={`udb-layout__sidebar ${collapsed ? "udb-layout__sidebar--collapsed" : ""}`}
      >
        <DashboardSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          sidebarGroups={config.sidebarGroups}
          brandName={config.brandName}
          brandTagline={config.brandTagline}
          user={user}
        />
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="udb-layout__mobile">
          <div className="udb-layout__backdrop" onClick={() => setMobileOpen(false)} />
          <aside className="udb-layout__mobile-sidebar">
            <DashboardSidebar
              collapsed={false}
              setCollapsed={() => setMobileOpen(false)}
              sidebarGroups={config.sidebarGroups}
              brandName={config.brandName}
              brandTagline={config.brandTagline}
              user={user}
            />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="udb-layout__main">
        <DashboardHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
          title={currentTitle}
          theme={theme}
          onToggleTheme={onToggleTheme}
          user={user}
          notifications={notifications}
          onLogout={onLogout}
          onMarkAllRead={onMarkAllRead}
          onDismissNotification={onDismissNotification}
        />

        <main className="udb-layout__content">
          {loading ? (
            <div className="udb-page-skeleton">
              <Skeleton className="udb-skeleton--title" />
              <div className="udb-skeleton-grid">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="udb-skeleton--card" />
                ))}
              </div>
              <Skeleton className="udb-skeleton--section" />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
