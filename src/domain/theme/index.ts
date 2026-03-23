/**
 * Dashboard Theme System
 *
 * Provides theme configuration and presets for the dashboard layout.
 * Themes are applied via CSS variables, allowing runtime customization.
 */

import type { DashboardTheme, DashboardThemePreset } from "../types";

// =============================================================================
// Default Theme
// =============================================================================

/**
 * Default dashboard theme (light mode)
 */
export const DEFAULT_DASHBOARD_THEME: DashboardTheme = {
  primary: "hsl(222.2 47.4% 11.2%)",
  secondary: "hsl(217.2 32.6% 17.5%)",
  sidebarBackground: "hsl(222.2 47.4% 11.2%)",
  sidebarForeground: "hsl(210 40% 98%)",
  sidebarBorder: "hsl(217.2 32.6% 17.5%)",
  headerBackground: "hsla(0, 0%, 100%, 0.8)",
  background: "hsl(0 0% 100%)",
  foreground: "hsl(222.2 84% 4.9%)",
  border: "hsl(214.3 31.8% 91.4%)",
  accent: "hsl(217.2 91.2% 59.8%)",
  accentForeground: "hsl(0 0% 100%)",
  destructive: "hsl(0 84.2% 60.2%)",
  destructiveForeground: "hsl(0 0% 98%)",
  muted: "hsl(210 40% 96.1%)",
  mutedForeground: "hsl(215.4 16.3% 46.9%)",
  card: "hsl(0 0% 100%)",
  cardForeground: "hsl(222.2 84% 4.9%)",
  popover: "hsl(0 0% 100%)",
  popoverForeground: "hsl(222.2 84% 4.9%)",
  radius: "0.5rem",
};

/**
 * Default dashboard theme (dark mode)
 */
export const DEFAULT_DASHBOARD_THEME_DARK: DashboardTheme = {
  primary: "hsl(217.2 91.2% 59.8%)",
  secondary: "hsl(217.2 32.6% 17.5%)",
  sidebarBackground: "hsl(222.2 47.4% 11.2%)",
  sidebarForeground: "hsl(210 40% 98%)",
  sidebarBorder: "hsl(217.2 32.6% 17.5%)",
  headerBackground: "hsla(222.2 47.4% 11.2%, 0.8)",
  background: "hsl(222.2 84% 4.9%)",
  foreground: "hsl(210 40% 98%)",
  border: "hsl(217.2 32.6% 17.5%)",
  accent: "hsl(217.2 91.2% 59.8%)",
  accentForeground: "hsl(0 0% 100%)",
  destructive: "hsl(0 62.8% 30.6%)",
  destructiveForeground: "hsl(0 0% 98%)",
  muted: "hsl(217.2 32.6% 17.5%)",
  mutedForeground: "hsl(215 20.2% 65.1%)",
  card: "hsl(222.2 84% 4.9%)",
  cardForeground: "hsl(210 40% 98%)",
  popover: "hsl(222.2 84% 4.9%)",
  popoverForeground: "hsl(210 40% 98%)",
  radius: "0.5rem",
};

// =============================================================================
// Theme Presets
// =============================================================================

/**
 * Available theme presets
 */
export const DASHBOARD_THEME_PRESETS: DashboardThemePreset[] = [
  {
    name: "default",
    theme: DEFAULT_DASHBOARD_THEME,
    dark: false,
  },
  {
    name: "default-dark",
    theme: DEFAULT_DASHBOARD_THEME_DARK,
    dark: true,
  },
  {
    name: "blue",
    theme: {
      ...DEFAULT_DASHBOARD_THEME,
      primary: "hsl(221.2 83.2% 53.3%)",
      accent: "hsl(221.2 83.2% 53.3%)",
    },
    dark: false,
  },
  {
    name: "blue-dark",
    theme: {
      ...DEFAULT_DASHBOARD_THEME_DARK,
      primary: "hsl(221.2 83.2% 53.3%)",
      accent: "hsl(221.2 83.2% 53.3%)",
    },
    dark: true,
  },
  {
    name: "purple",
    theme: {
      ...DEFAULT_DASHBOARD_THEME,
      primary: "hsl(271.5 81.3% 55.9%)",
      accent: "hsl(271.5 81.3% 55.9%)",
    },
    dark: false,
  },
  {
    name: "purple-dark",
    theme: {
      ...DEFAULT_DASHBOARD_THEME_DARK,
      primary: "hsl(271.5 81.3% 55.9%)",
      accent: "hsl(271.5 81.3% 55.9%)",
    },
    dark: true,
  },
  {
    name: "green",
    theme: {
      ...DEFAULT_DASHBOARD_THEME,
      primary: "hsl(142.1 76.2% 36.3%)",
      accent: "hsl(142.1 76.2% 36.3%)",
    },
    dark: false,
  },
  {
    name: "green-dark",
    theme: {
      ...DEFAULT_DASHBOARD_THEME_DARK,
      primary: "hsl(142.1 76.2% 36.3%)",
      accent: "hsl(142.1 76.2% 36.3%)",
    },
    dark: true,
  },
  {
    name: "orange",
    theme: {
      ...DEFAULT_DASHBOARD_THEME,
      primary: "hsl(24.6 95% 53.1%)",
      accent: "hsl(24.6 95% 53.1%)",
    },
    dark: false,
  },
  {
    name: "orange-dark",
    theme: {
      ...DEFAULT_DASHBOARD_THEME_DARK,
      primary: "hsl(24.6 95% 53.1%)",
      accent: "hsl(24.6 95% 53.1%)",
    },
    dark: true,
  },
];

// =============================================================================
// Theme Utilities
// =============================================================================

/**
 * Apply theme to document root via CSS variables
 *
 * @param theme - Theme configuration to apply
 */
export function applyDashboardTheme(theme: DashboardTheme): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // Map theme keys to CSS variable names
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

  // Apply CSS variables
  Object.entries(cssVars).forEach(([key, value]) => {
    if (value) {
      root.style.setProperty(key, value);
    }
  });
}

/**
 * Get theme preset by name
 *
 * @param name - Preset name
 * @returns Theme preset or undefined
 */
export function getDashboardThemePreset(name: string): DashboardThemePreset | undefined {
  return DASHBOARD_THEME_PRESETS.find((preset) => preset.name === name);
}

/**
 * Merge custom theme with default theme
 *
 * @param customTheme - Custom theme configuration
 * @param dark - Whether to use dark mode base
 * @returns Merged theme configuration
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
