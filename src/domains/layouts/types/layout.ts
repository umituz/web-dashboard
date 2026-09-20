/**
 * Dashboard Types - Layout
 *
 * Type definitions for layout components
 */

/**
 * Dashboard header props
 */
export interface DashboardHeaderProps {
  /** Whether sidebar is collapsed */
  collapsed: boolean;
  /** Toggle sidebar collapsed state */
  setCollapsed: (collapsed: boolean) => void;
  /** Toggle mobile menu open state */
  setMobileOpen: (open: boolean) => void;
  /** Current page title */
  title: string;
  /** Current resolved theme; defaults to "light" rendering when omitted */
  theme?: "light" | "dark";
  /** Theme toggle handler — the toggle button is hidden when omitted */
  onToggleTheme?: () => void;
}

/**
 * Dashboard sidebar props
 */
export interface DashboardSidebarProps {
  /** Whether sidebar is collapsed */
  collapsed: boolean;
  /** Toggle sidebar collapsed state */
  setCollapsed: (collapsed: boolean) => void;
}

/**
 * Dashboard layout configuration
 */
export interface DashboardLayoutConfig {
  /** Sidebar groups */
  sidebarGroups: import('./sidebar').SidebarGroup[];
  /** Extra title mappings for routes — values may be i18n keys or literal strings */
  extraTitleMap?: Record<string, string>;
  /** Title used when no sidebar item or extra mapping matches the route (default: "Dashboard") */
  defaultTitle?: string;
  /** Brand name */
  brandName?: string;
  /** Brand tagline */
  brandTagline?: string;
}
