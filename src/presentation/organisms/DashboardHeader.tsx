import React, { useState, useCallback } from "react";
import {
  Bell, X, Sun, Moon, Menu, User, Settings, LogOut,
  ChevronDown, CreditCard
} from "lucide-react";
import { Button } from "@umituz/web-design-system/atoms";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { DashboardHeaderProps, DashboardUser, DashboardNotification } from "../../domain/types";
import { formatNotificationTime } from "../../infrastructure/utils";

interface DashboardHeaderPropsExtended extends DashboardHeaderProps {
  /** Auth user */
  user?: DashboardUser;
  /** Notifications */
  notifications?: DashboardNotification[];
  /** Logout function */
  onLogout?: () => Promise<void>;
  /** Mark all as read function */
  onMarkAllRead?: () => void;
  /** Dismiss notification function */
  onDismissNotification?: (id: string) => void;
  /** Format date function */
  formatDate?: (date: Date | string | number) => string;
  /** Settings route */
  settingsRoute?: string;
  /** Profile route */
  profileRoute?: string;
  /** Billing route */
  billingRoute?: string;
}

/**
 * Dashboard Header Component
 *
 * Displays top navigation bar with theme toggle, notifications,
 * user menu, and organisation selector.
 *
 * @param props - Dashboard header props
 */
export const DashboardHeader = ({
  collapsed,
  setCollapsed,
  setMobileOpen,
  title,
  user,
  notifications = [],
  onLogout,
  onMarkAllRead,
  onDismissNotification,
  formatDate,
  settingsRoute = "/dashboard/settings",
  profileRoute = "/dashboard/profile",
  billingRoute = "/dashboard/billing",
}: DashboardHeaderPropsExtended) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    onMarkAllRead?.();
  };

  const handleLogout = async () => {
    try {
      await onLogout?.();
      navigate("/login");
    } catch {
      // Error handling can be added by parent component
    }
  };

  // Placeholder components - these should be provided by the consuming app
  const ThemeToggle = () => {
    const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("light");

    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setResolvedTheme(resolvedTheme === "light" ? "dark" : "light")}
        className="text-muted-foreground h-9 w-9"
        title={resolvedTheme === "dark" ? t('common.tooltips.switchLight') : t('common.tooltips.switchDark')}
      >
        {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    );
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card/50 backdrop-blur-md px-4 shrink-0 z-30">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        {collapsed && (
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={() => setCollapsed(false)}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h2 className="text-sm font-semibold text-foreground">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground relative h-9 w-9"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
              </span>
            )}
          </Button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute top-12 right-0 w-80 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">{t('dashboard.notifications.title')}</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[10px] font-bold text-primary hover:underline uppercase">{t('dashboard.notifications.markAllRead')}</button>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-border last:border-0 flex items-start gap-3 transition-colors hover:bg-muted/30 ${!n.read ? "bg-primary/5" : ""}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground leading-snug">{n.text}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                          <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/30" />
                          {formatTimeAgo(n.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => onDismissNotification?.(n.id)}
                        className="text-muted-foreground/50 hover:text-foreground shrink-0 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="px-4 py-10 text-center">
                      <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Bell className="h-5 w-5 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm text-muted-foreground">{t('dashboard.notifications.none')}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1 pl-1 rounded-full hover:bg-muted transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden border border-primary/20 ring-primary/20 group-hover:ring-4 transition-all">
              {user?.avatar && <img src={user.avatar} alt="User" className="w-full h-full object-cover" />}
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${profileOpen && "rotate-180"}`} />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute top-12 right-0 w-56 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1.5">
                <div className="px-3 py-2 border-b border-border/50 mb-1">
                  <p className="text-sm font-bold text-foreground">{user?.name || t("common.roles.user")}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => { navigate(profileRoute); setProfileOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    {t('common.profile')}
                  </button>
                  <button
                    onClick={() => { navigate(billingRoute); setProfileOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    {t('common.billing')}
                  </button>
                  <button
                    onClick={() => { navigate(settingsRoute); setProfileOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    {t('common.settings')}
                  </button>
                </div>

                <div className="h-px bg-border my-1.5" />

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  {t('common.logout')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
