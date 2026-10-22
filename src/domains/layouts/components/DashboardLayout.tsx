import { Suspense, useState, useEffect, useRef, type ReactNode } from "react";
import { useLocation, useNavigate, Outlet, Navigate } from "react-router";
import { Skeleton } from "@umituz/web-design-system/atoms";
import { CommandPalette, type CommandGroup, type CommandItem } from "@umituz/web-design-system/organisms";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { getActiveSidebarItem } from "../utils/dashboard";
import type { DashboardLayoutConfig, DashboardLayoutLabels } from "../types/layout";
import type { DashboardNotification } from "../types/notification";
import type { DashboardUser } from "../types/user";

interface DashboardLayoutProps {
  config: DashboardLayoutConfig;
  labels: DashboardLayoutLabels;
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
  collapsedStorageKey?: string;
  footer?: ReactNode;
  mainId?: string;
  contentFallback?: ReactNode;
  formatNotificationTime?: (createdAt: Date | string | number) => string;
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
  labels,
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
  contentFallback,
  formatNotificationTime,
}: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => readCollapsed(collapsedStorageKey));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(routeTransitionMs > 0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchItems, setSearchItems] = useState<CommandItem[]>([]);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchSeq = useRef(0);
  const palette = config.commandPalette;
  const paletteSearch = palette?.search;

  useEffect(() => {
    if (!collapsedStorageKey || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(collapsedStorageKey, collapsed ? "1" : "0");
    } catch {
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

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );

  const handlePaletteQuery = (q: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    const seq = ++searchSeq.current;
    if (!paletteSearch || q.trim() === "") {
      setSearchItems([]);
      return;
    }
    searchTimer.current = setTimeout(() => {
      paletteSearch(q)
        .then((items) => {
          if (seq === searchSeq.current) setSearchItems(items);
        })
        .catch(() => {
          if (seq === searchSeq.current) setSearchItems([]);
        });
    }, 180);
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("udb-scroll-lock", mobileOpen);
    return () => document.documentElement.classList.remove("udb-scroll-lock");
  }, [mobileOpen]);

  if (authLoading) return null;
  if (!isAuthenticated) return <Navigate to={loginRoute} replace />;

  const activeItem = getActiveSidebarItem(location.pathname, config.sidebarGroups);

  const currentTitle =
    (activeItem?.label ?? config.extraTitleMap?.[location.pathname] ?? config.defaultTitle) || "";

  const searchGroup: CommandGroup | null =
    paletteSearch && searchItems.length > 0
      ? {
          heading: palette?.searchResultsHeading ?? labels.searchResults,
          items: searchItems.map((item) => ({ ...item, prefiltered: true })),
        }
      : null;
  const basePaletteGroups = searchGroup ? [searchGroup, ...(palette?.groups ?? [])] : (palette?.groups ?? []);

  const paletteGroups = palette?.includeSidebar
    ? [
        ...basePaletteGroups,
        ...config.sidebarGroups.map((group) => ({
          heading: group.title,
          items: group.items.map((item) => ({
            id: `nav-${item.path.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
            label: item.label,
            icon: <item.icon size={16} aria-hidden="true" />,
            hint: item.path,
            onSelect: () => navigate(item.path),
          })),
        })),
      ]
    : undefined;

  const sidebarProps = {
    sidebarGroups: config.sidebarGroups,
    brandName: config.brandName,
    brandTagline: config.brandTagline,
    brand: config.brand,
    sidebarAction: config.sidebarAction,
    sidebarFooter: config.sidebarFooter,
    user,
    labels: config.sidebarLabels ?? labels.sidebar,
  };

  return (
    <div className="udb-root udb-layout">
      <a href={`#${mainId}`} className="udb-skip-link">
        {labels.skipToContent}
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
            aria-label={config.brandName ? `${config.brandName} — ${labels.navigation}` : labels.navigation}
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
          labels={labels.header}
          theme={theme}
          onToggleTheme={onToggleTheme}
          user={user}
          notifications={notifications}
          onLogout={onLogout}
          onMarkAllRead={onMarkAllRead}
          onDismissNotification={onDismissNotification}
          loginRoute={loginRoute}
          formatNotificationTime={formatNotificationTime}
          searchAction={
            palette
              ? { placeholder: palette.placeholder, shortcut: "⌘K", ...config.searchAction, onActivate: config.searchAction?.onActivate ?? (() => setPaletteOpen(true)) }
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
            <div className="udb-layout__page">
              <Suspense fallback={contentFallback ?? null}>
                <Outlet />
              </Suspense>
            </div>
          )}
        </main>

        {footer && <footer className="udb-layout__footer">{footer}</footer>}

      </div>

      {palette && (
        <CommandPalette
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
          groups={paletteGroups ?? basePaletteGroups}
          placeholder={palette.placeholder}
          emptyLabel={palette.emptyLabel}
          label={palette.label}
          onQueryChange={paletteSearch ? handlePaletteQuery : undefined}
        />
      )}
    </div>

  );
};

export default DashboardLayout;
