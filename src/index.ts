/**
 * @umituz/web-dashboard
 *
 * Dashboard Layout System - Customizable, themeable dashboard layouts
 *
 * @packageDocumentation
 */

// =============================================================================
// Components
// =============================================================================

export { DashboardLayout } from './presentation/organisms/DashboardLayout';
export { default as DashboardLayoutDefault } from './presentation/organisms/DashboardLayout';

export { DashboardHeader } from './presentation/organisms/DashboardHeader';
export { DashboardSidebar } from './presentation/molecules/DashboardSidebar';
export { BrandLogo } from './presentation/molecules/BrandLogo';

// =============================================================================
// Types
// =============================================================================

export type {
  SidebarItem,
  SidebarGroup,
  DashboardHeaderProps,
  DashboardSidebarProps,
  DashboardLayoutConfig,
  DashboardTheme,
  DashboardThemePreset,
  DashboardNotification,
  DashboardUser,
  UserNavMenuItem,
} from './domain/types';

// =============================================================================
// Theme
// =============================================================================

export {
  DEFAULT_DASHBOARD_THEME,
  DEFAULT_DASHBOARD_THEME_DARK,
  DASHBOARD_THEME_PRESETS,
} from './domain/theme';

export {
  applyDashboardTheme,
  getDashboardThemePreset,
  mergeDashboardTheme,
} from './domain/theme';

// =============================================================================
// Hooks
// =============================================================================

export {
  useNotifications,
  useSidebar,
} from './infrastructure/hooks';

// =============================================================================
// Utilities
// =============================================================================

export {
  formatNotificationTime,
  isPathActive,
  getPageTitle,
  filterSidebarItems,
  generateNotificationId,
} from './infrastructure/utils';
