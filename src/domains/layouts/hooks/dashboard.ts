import { useState, useCallback, useEffect } from "react";
import type { DashboardNotification } from "../types/notification";

export interface UsePageTitleOptions {
  suffix?: string;
  fallback?: string;
  separator?: string;
}

export function usePageTitle(title?: string, options: UsePageTitleOptions = {}) {
  const { suffix, fallback, separator = "·" } = options;

  useEffect(() => {
    if (title && suffix) document.title = [title, suffix].join(` ${separator} `);
    else if (title) document.title = title;
    else if (fallback) document.title = fallback;
  }, [title, suffix, fallback, separator]);
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
