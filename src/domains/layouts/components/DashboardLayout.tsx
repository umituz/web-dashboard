import { useState, useEffect } from "react";
import { useLocation, Outlet, Navigate } from "react-router-dom";
import { Skeleton } from "@umituz/web-design-system/atoms";
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
 * - Loading skeletons
 * - Auth protection
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
}: DashboardLayoutProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (authLoading) return null;
  if (!isAuthenticated) return <Navigate to={loginRoute} replace />;

  const activeItem = config.sidebarGroups
    .flatMap((group) => group.items)
    .find((i) => i.path === location.pathname);

  const getTitle = () => {
    if (!activeItem) return config.extraTitleMap?.[location.pathname] || "Dashboard";
    return activeItem.label; // Note: In real app, this would be translated
  };

  const currentTitle = getTitle();

  return (
    <div className="flex h-screen w-full bg-background font-sans">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-sidebar-border bg-sidebar transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
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
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-60 border-r border-sidebar-border bg-sidebar shadow-xl">
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
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
          title={currentTitle}
          user={user}
          notifications={notifications}
          onLogout={onLogout}
          onMarkAllRead={onMarkAllRead}
          onDismissNotification={onDismissNotification}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {loading ? (
            <div className="mx-auto w-full max-w-7xl space-y-6">
              <Skeleton className="h-8 w-1/3 rounded-xl" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-2xl" />
                ))}
              </div>
              <Skeleton className="h-64 rounded-[32px]" />
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
