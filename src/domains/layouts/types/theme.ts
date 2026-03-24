/**
 * Dashboard Types - Theme
 *
 * Type definitions for theme system
 */

/**
 * Dashboard theme configuration
 * Extends CSS variables for customization
 */
export interface DashboardTheme {
  /** Primary color (CSS variable compatible) */
  primary?: string;
  /** Secondary color */
  secondary?: string;
  /** Sidebar background */
  sidebarBackground?: string;
  /** Sidebar foreground */
  sidebarForeground?: string;
  /** Sidebar border */
  sidebarBorder?: string;
  /** Header background */
  headerBackground?: string;
  /** Background color */
  background?: string;
  /** Foreground color */
  foreground?: string;
  /** Border color */
  border?: string;
  /** Accent color */
  accent?: string;
  /** Accent foreground */
  accentForeground?: string;
  /** Destructive color */
  destructive?: string;
  /** Destructive foreground */
  destructiveForeground?: string;
  /** Muted background */
  muted?: string;
  /** Muted foreground */
  mutedForeground?: string;
  /** Card background */
  card?: string;
  /** Card foreground */
  cardForeground?: string;
  /** Popover background */
  popover?: string;
  /** Popover foreground */
  popoverForeground?: string;
  /** Radius (border-radius) */
  radius?: string;
}

/**
 * Theme preset for quick setup
 */
export interface DashboardThemePreset {
  /** Preset name */
  name: string;
  /** Theme configuration */
  theme: DashboardTheme;
  /** Whether this is a dark theme */
  dark?: boolean;
}
