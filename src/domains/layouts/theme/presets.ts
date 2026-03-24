/**
 * Dashboard Theme - Presets
 *
 * Pre-configured theme presets
 */

import type { DashboardThemePreset } from '../types/theme';
import { DEFAULT_DASHBOARD_THEME, DEFAULT_DASHBOARD_THEME_DARK } from './default';

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
