/**
 * Dashboard Types - Notification
 *
 * Type definitions for notification system
 */

/**
 * Notification item
 */
export interface DashboardNotification {
  /** Unique ID */
  id: string;
  /** Notification text */
  text: string;
  /** Whether notification is read */
  read: boolean;
  /** Creation timestamp */
  createdAt: Date | string | number;
}
