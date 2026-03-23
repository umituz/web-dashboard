/**
 * Dashboard Hooks
 *
 * Custom React hooks for dashboard functionality
 */

import { useState, useCallback } from "react";
import type { DashboardNotification } from "../../domain/types";

/**
 * Use Notifications Hook
 *
 * Manages notification state and actions
 *
 * @param initialNotifications - Initial notification list
 * @returns Notification state and actions
 */
export function useNotifications(initialNotifications: DashboardNotification[] = []) {
  const [notifications, setNotifications] = useState<DashboardNotification[]>(initialNotifications);

  const markAllRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const add = useCallback((notification: Omit<DashboardNotification, "id">) => {
    const newNotification: DashboardNotification = {
      ...notification,
      id: Math.random().toString(36).substring(7),
      read: false,
      createdAt: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  return {
    notifications,
    markAllRead,
    markAllRead: markAllRead,
    dismiss,
    add,
  };
}

/**
 * Use Sidebar Hook
 *
 * Manages sidebar state
 *
 * @returns Sidebar state and actions
 */
export function useSidebar(initialCollapsed = false) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const openMobile = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return {
    collapsed,
    setCollapsed,
    toggle,
    mobileOpen,
    setMobileOpen: setMobileOpen,
    openMobile,
    closeMobile,
  };
}
