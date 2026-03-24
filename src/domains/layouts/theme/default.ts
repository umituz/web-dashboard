/**
 * Dashboard Theme - Default Themes
 *
 * Default light and dark theme configurations
 */

import type { DashboardTheme } from '../types/theme';

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
