import { useState } from "react";
import {
  Bell, X, Sun, Moon, Menu, User, Settings, LogOut,
  ChevronDown
} from "lucide-react";
import { Button } from "@umituz/web-design-system/atoms";
import { useNavigate } from "react-router-dom";
import { useT } from "@umituz/web-localization/react";
import type { DashboardHeaderProps, HeaderProfileItem } from "../types/layout";
import type { DashboardNotification } from "../types/notification";
import type { DashboardUser } from "../types/user";
import { formatNotificationTime } from "../utils/dashboard";

interface DashboardHeaderPropsExtended extends DashboardHeaderProps {
  user?: DashboardUser;
  notifications?: DashboardNotification[];
  onLogout?: () => Promise<void>;
  onMarkAllRead?: () => void;
  onDismissNotification?: (id: string) => void;
  settingsRoute?: string;
  profileRoute?: string;
  extraProfileItems?: HeaderProfileItem[];
}

export const DashboardHeader = ({
  collapsed,
  setCollapsed,
  setMobileOpen,
  title,
  theme = "light",
  onToggleTheme,
  user,
  notifications = [],
  onLogout,
  onMarkAllRead,
  onDismissNotification,
  settingsRoute = "/dashboard/settings",
  profileRoute = "/dashboard/profile",
  extraProfileItems = [],
}: DashboardHeaderPropsExtended) => {
  const navigate = useNavigate();
  const t = useT();
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
    }
  };

  return (
    <header className="udb-header">
      <div className="udb-header__lead">
        <Button variant="ghost" size="icon" className="udb-header__mobile-toggle" onClick={() => setMobileOpen(true)}>
          <Menu className="udb-header__toggle-icon" />
        </Button>
        {collapsed && (
          <Button variant="ghost" size="icon" className="udb-header__desktop-toggle" onClick={() => setCollapsed(false)}>
            <Menu className="udb-header__toggle-icon" />
          </Button>
        )}
        <h2 className="udb-header__title">
          {title}
        </h2>
      </div>

      <div className="udb-header__actions">
        {onToggleTheme && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="udb-header__icon-btn"
            title={theme === "dark" ? t('common.tooltips.switchLight') : t('common.tooltips.switchDark')}
            aria-label={theme === "dark" ? t('common.tooltips.switchLight') : t('common.tooltips.switchDark')}
          >
            {theme === "dark" ? <Sun className="udb-header__icon" aria-hidden="true" /> : <Moon className="udb-header__icon" aria-hidden="true" />}
          </Button>
        )}

        <div className="udb-header__anchor">
          <Button
            variant="ghost"
            size="icon"
            className="udb-header__icon-btn"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
          >
            <Bell className="udb-header__icon" />
            {unreadCount > 0 && <span className="udb-header__unread"><span className="udb-header__unread-core" /></span>}
          </Button>

          {notifOpen && (
            <>
              <div className="udb-overlay" onClick={() => setNotifOpen(false)} />
              <div className="udb-menu udb-notif">
                <div className="udb-menu__header">
                  <h3 className="udb-menu__heading">{t('dashboard.notifications.title')}</h3>
                  {unreadCount > 0 && (
                    <button type="button" onClick={markAllRead} className="udb-menu__action">{t('dashboard.notifications.markAllRead')}</button>
                  )}
                </div>

                <div className="udb-notif__list">
                  {notifications.map((n) => (
                    <div key={n.id} className={`udb-notif__item${!n.read ? " udb-notif__item--unread" : ""}`}>
                      <div className="udb-notif__body">
                        <p className="udb-notif__text">{n.text}</p>
                        <p className="udb-notif__meta">
                          <span className="udb-notif__dot" />
                          {formatNotificationTime(n.createdAt, t)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDismissNotification?.(n.id)}
                        className="udb-notif__dismiss"
                      >
                        <X className="udb-notif__dismiss-icon" />
                      </button>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="udb-notif__empty">
                      <div className="udb-notif__empty-icon">
                        <Bell className="udb-notif__empty-bell" />
                      </div>
                      <p className="udb-notif__empty-text">{t('dashboard.notifications.none')}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="udb-header__divider" />

        <div className="udb-header__anchor">
          <button
            type="button"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="udb-profile-btn"
          >
            <span className="udb-avatar">
              {user?.avatar && <img src={user.avatar} alt="" className="udb-avatar__img" />}
            </span>
            <ChevronDown className={`udb-profile-btn__chevron${profileOpen ? " udb-profile-btn__chevron--open" : ""}`} />
          </button>

          {profileOpen && (
            <>
              <div className="udb-overlay" onClick={() => setProfileOpen(false)} />
              <div className="udb-menu udb-profile-menu">
                <div className="udb-profile-menu__id">
                  <p className="udb-profile-menu__name">{user?.name || t("common.roles.user")}</p>
                  <p className="udb-profile-menu__email">{user?.email}</p>
                </div>

                <div className="udb-profile-menu__items">
                  <button
                    type="button"
                    onClick={() => { navigate(profileRoute); setProfileOpen(false); }}
                    className="udb-menu__item"
                  >
                    <User className="udb-menu__item-icon" />
                    {t('common.profile')}
                  </button>
                  {extraProfileItems.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        if (item.to) navigate(item.to);
                        item.onSelect?.();
                        setProfileOpen(false);
                      }}
                      className="udb-menu__item"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => { navigate(settingsRoute); setProfileOpen(false); }}
                    className="udb-menu__item"
                  >
                    <Settings className="udb-menu__item-icon" />
                    {t('common.settings')}
                  </button>
                </div>

                <div className="udb-profile-menu__separator" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="udb-menu__item udb-menu__item--danger"
                >
                  <LogOut className="udb-menu__item-icon" />
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
