/**
 * Dashboard Theme - Utilities
 *
 * Theme utility functions
 */

import type { DashboardTheme, DashboardThemePreset } from '../types/theme';
import { DEFAULT_DASHBOARD_THEME, DEFAULT_DASHBOARD_THEME_DARK } from './default';
import { DASHBOARD_THEME_PRESETS } from './presets';

/**
 * Apply theme to document root via CSS variables
 */
export function applyDashboardTheme(theme: DashboardTheme): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  const cssVars: Record<string, string | undefined> = {
    "--primary": theme.primary,
    "--secondary": theme.secondary,
    "--sidebar": theme.sidebarBackground,
    "--sidebar-foreground": theme.sidebarForeground,
    "--sidebar-border": theme.sidebarBorder,
    "--background": theme.background,
    "--foreground": theme.foreground,
    "--border": theme.border,
    "--accent": theme.accent,
    "--accent-foreground": theme.accentForeground,
    "--destructive": theme.destructive,
    "--destructive-foreground": theme.destructiveForeground,
    "--muted": theme.muted,
    "--muted-foreground": theme.mutedForeground,
    "--card": theme.card,
    "--card-foreground": theme.cardForeground,
    "--popover": theme.popover,
    "--popover-foreground": theme.popoverForeground,
    "--radius": theme.radius,
  };

  Object.entries(cssVars).forEach(([key, value]) => {
    if (value) {
      root.style.setProperty(key, value);
    }
  });
}

/**
 * Get theme preset by name
 */
export function getDashboardThemePreset(name: string): DashboardThemePreset | undefined {
  return DASHBOARD_THEME_PRESETS.find((preset) => preset.name === name);
}

/**
 * Merge custom theme with default theme
 */
export function mergeDashboardTheme(
  customTheme: Partial<DashboardTheme>,
  dark = false
): DashboardTheme {
  const baseTheme = dark ? DEFAULT_DASHBOARD_THEME_DARK : DEFAULT_DASHBOARD_THEME;
  return {
    ...baseTheme,
    ...customTheme,
  } as DashboardTheme;
}
