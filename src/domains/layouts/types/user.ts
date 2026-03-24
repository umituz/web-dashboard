/**
 * Dashboard Types - User
 *
 * Type definitions for user profile
 */

/**
 * User profile info for header
 */
export interface DashboardUser {
  /** User ID */
  id: string;
  /** Display name */
  name?: string;
  /** Email address */
  email?: string;
  /** Avatar URL */
  avatar?: string;
  /** Whether user has mobile app access */
  hasMobileApp?: boolean;
  /** Whether user has web app access */
  hasWebApp?: boolean;
}

/**
 * Navigation item for user menu
 */
export interface UserNavMenuItem {
  /** Display label */
  label: string;
  /** Icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** Route path */
  path: string;
}
