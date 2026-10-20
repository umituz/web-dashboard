import { useState, useEffect, type ReactNode } from "react";
import { useLocation, Outlet, Navigate } from "react-router-dom";
import { useT } from "@umituz/web-localization/react";
import { Skeleton } from "@umituz/web-design-system/atoms";
import { CommandPalette } from "@umituz/web-design-system/organisms";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { getActiveSidebarItem } from "../utils/dashboard";
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
  /** Persists the sidebar collapse state under this localStorage key ('1'/'0'). */
  collapsedStorageKey?: string;
  /** Optional page footer rendered under the outlet column. */
  footer?: ReactNode;
  /** id of the main landmark — also the skip-link target. */
  mainId?: string;
  /** Skip-link label (a11y); defaults to the localized "Skip to content". */
  skipToContentLabel?: string;
}

const readCollapsed = (key?: string): boolean => {
  if (!key || typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};

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
  collapsedStorageKey,
  footer,
  mainId = "udb-main",
  skipToContentLabel,
}: DashboardLayoutProps) => {
  const location = useLocation();
  const t = useT();
  const [collapsed, setCollapsed] = useState(() => readCollapsed(collapsedStorageKey));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(routeTransitionMs > 0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const palette = config.commandPalette;

  useEffect(() => {
    if (!collapsedStorageKey || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(collapsedStorageKey, collapsed ? "1" : "0");
    } catch {
      /* storage unavailable — state stays in-memory only */
    }
  }, [collapsed, collapsedStorageKey]);

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

  useEffect(() => {
    if (!palette || palette.shortcut === false) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [palette]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("udb-scroll-lock", mobileOpen);
    return () => document.documentElement.classList.remove("udb-scroll-lock");
  }, [mobileOpen]);

  if (authLoading) return null;
  if (!isAuthenticated) return <Navigate to={loginRoute} replace />;

  const activeItem = getActiveSidebarItem(location.pathname, config.sidebarGroups);

  const getTitle = () => {
    if (activeItem) return activeItem.raw ? activeItem.label : t(activeItem.label);
    const extraTitle = config.extraTitleMap?.[location.pathname];
    if (extraTitle) return t(extraTitle);
    return config.defaultTitle ?? "Dashboard";
  };

  const currentTitle = getTitle();

  const sidebarProps = {
    sidebarGroups: config.sidebarGroups,
    brandName: config.brandName,
    brandTagline: config.brandTagline,
    brand: config.brand,
    sidebarAction: config.sidebarAction,
    sidebarFooter: config.sidebarFooter,
    user,
  };

  return (
    <div className="udb-root udb-layout">
      <a href={`#${mainId}`} className="udb-skip-link">
        {skipToContentLabel ?? t("Skip to content")}
      </a>

      <aside
        className={`udb-layout__sidebar ${collapsed ? "udb-layout__sidebar--collapsed" : ""}`}
      >
        <DashboardSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          {...sidebarProps}
        />
      </aside>

      {mobileOpen && (
        <div className="udb-layout__mobile">
          <div className="udb-layout__backdrop" onClick={() => setMobileOpen(false)} />
          <aside
            className="udb-layout__mobile-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label={config.brandName ? `${config.brandName} — ${t("Navigation")}` : t("Navigation")}
          >
            <DashboardSidebar
              collapsed={false}
              setCollapsed={() => setMobileOpen(false)}
              {...sidebarProps}
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
          loginRoute={loginRoute}
          searchAction={
            palette
              ? // The palette owns the header search unless the app gave an explicit action.
                { placeholder: palette.placeholder, shortcut: "⌘K", ...config.searchAction, onActivate: config.searchAction?.onActivate ?? (() => setPaletteOpen(true)) }
              : config.searchAction
          }
          headerExtra={config.headerExtra}
          profileItems={config.profileItems}
          showDefaultProfileItems={config.showDefaultProfileItems}
          notificationsViewAll={config.notificationsViewAll}
        />

        <main id={mainId} tabIndex={-1} className="udb-layout__content">
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

        {footer && <footer className="udb-layout__footer">{footer}</footer>}
      </div>

      {palette && (
        <CommandPalette
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
          groups={palette.groups}
          placeholder={palette.placeholder}
          emptyLabel={palette.emptyLabel}
          label={palette.label}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
