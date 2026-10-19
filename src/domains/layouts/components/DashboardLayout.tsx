import { useState, useEffect } from "react";
import { useLocation, Outlet, Navigate } from "react-router-dom";
import { useT } from "@umituz/web-localization/react";
import { Skeleton } from "@umituz/web-design-system/atoms";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import type { DashboardLayoutConfig } from "../types/layout";
import type { DashboardNotification } from "../types/notification";
import type { DashboardUser } from "../types/user";

interface DashboardLayoutProps {
  config: DashboardLayoutConfig;
  user?: DashboardUser;
  authLoading?: boolean;
  isAuthenticated?: boolean;
  notifications?: DashboardNotification[];
  onLogout?: () => Promise<void>;
  onMarkAllRead?: () => void;
  onDismissNotification?: (id: string) => void;
  loginRoute?: string;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
  routeTransitionMs?: number;
}

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
  const t = useT();
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
