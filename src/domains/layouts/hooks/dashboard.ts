import { useState, useCallback, useEffect } from "react";
import type { DashboardNotification } from "../types/notification";

export interface UsePageTitleOptions {
  /** Appended as `title · suffix` (e.g. the product name). */
  suffix?: string;
  /** Used when the route passes no title (e.g. the home route). */
  fallback?: string;
}

/** Document title per route — `usePageTitle("Search", { suffix: "Lingora" })`
 *  → "Search · Lingora". Restores nothing on unmount (the next route sets it). */
export function usePageTitle(title?: string, options: UsePageTitleOptions = {}) {
  const { suffix, fallback } = options;

  useEffect(() => {
    if (title && suffix) document.title = `${title} · ${suffix}`;
    else if (title) document.title = title;
    else if (fallback) document.title = fallback;
  }, [title, suffix, fallback]);
}

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
      id: crypto.randomUUID(),
      read: false,
      createdAt: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  return {
    notifications,
    markAllRead,
    dismiss,
    add,
  };
}

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
