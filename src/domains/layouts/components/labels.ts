import type { DashboardLayoutLabels } from '../types/layout';

/**
 * English shell labels — the reference text for `DashboardLayout`.
 * Hosts rendering English pass this constant instead of re-declaring the
 * thirteen strings; localized hosts build their own object from the same
 * shape.
 */
export const defaultLayoutLabels: DashboardLayoutLabels = {
  skipToContent: 'Skip to content',
  navigation: 'Navigation',
  searchResults: 'Search results',
  header: {
    switchToLight: 'Switch to light',
    switchToDark: 'Switch to dark',
    notificationsTitle: 'Notifications',
    markAllRead: 'Mark all read',
    dismissNotification: 'Dismiss',
    noNotifications: 'No notifications',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Log out',
    guestName: 'Guest',
  },
  sidebar: { system: 'System' },
};
