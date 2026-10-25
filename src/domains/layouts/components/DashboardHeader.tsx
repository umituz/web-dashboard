import {
  Bell, X, Sun, Moon, Menu, User, Settings, LogOut,
  ChevronDown, Search
} from "lucide-react";
import { Button, Kbd } from "@umituz/web-design-system/atoms";
import { Avatar, AvatarImage } from "@umituz/web-design-system/molecules";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator
} from "@umituz/web-design-system/organisms";
import { useNavigate } from "react-router";
import type { ReactNode } from "react";
import type {
  DashboardHeaderProps, HeaderProfileItem, HeaderSearchAction
} from "../types/layout";
import type { DashboardNotification } from "../types/notification";
import type { DashboardUser } from "../types/user";

interface DashboardHeaderPropsExtended extends DashboardHeaderProps {
  user?: DashboardUser;
  notifications?: DashboardNotification[];
  onLogout?: () => Promise<void>;
  onMarkAllRead?: () => void;
  onDismissNotification?: (id: string) => void;
  settingsRoute?: string;
  profileRoute?: string;
  extraProfileItems?: HeaderProfileItem[];
  profileItems?: HeaderProfileItem[];
  showDefaultProfileItems?: boolean;
  searchAction?: HeaderSearchAction;
  headerExtra?: ReactNode;
  notificationsViewAll?: { label: string; to: string };
  loginRoute?: string;
}

const defaultFormatNotificationTime = (createdAt: Date | string | number): string =>
  new Date(createdAt).toLocaleString();

export const DashboardHeader = ({
  collapsed,
  setCollapsed,
  setMobileOpen,
  title,
  labels,
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
  profileItems,
  showDefaultProfileItems = true,
  searchAction,
  headerExtra,
  notificationsViewAll,
  loginRoute = "/login",
  formatNotificationTime = defaultFormatNotificationTime,
}: DashboardHeaderPropsExtended) => {
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const customItems = profileItems ?? extraProfileItems;

  const handleLogout = async () => {
    try {
      await onLogout?.();
      navigate(loginRoute);
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
        {headerExtra && <div className="udb-header__extra">{headerExtra}</div>}

        {searchAction && (
          <button type="button" className="udb-header__search" onClick={searchAction.onActivate}>
            <Search className="udb-header__search-icon" />
            <span className="udb-header__search-text">{searchAction.placeholder}</span>

            {searchAction.shortcut && <Kbd className="udb-header__search-kbd">{searchAction.shortcut}</Kbd>}

          </button>

        )}

        {onToggleTheme && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="udb-header__icon-btn"
            title={theme === "dark" ? labels.switchToLight : labels.switchToDark}
            aria-label={theme === "dark" ? labels.switchToLight : labels.switchToDark}
          >
            {theme === "dark" ? <Sun className="udb-header__icon" aria-hidden="true" /> : <Moon className="udb-header__icon" aria-hidden="true" />}
          </Button>

        )}

        {(notifications.length > 0 || onMarkAllRead) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="udb-header__icon-btn" aria-label={labels.notificationsTitle}>
                <Bell className="udb-header__icon" />
                {unreadCount > 0 && <span className="udb-header__unread"><span className="udb-header__unread-core" /></span>}

              </Button>

            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="udb-menu udb-menu--pop udb-notif">
              <div className="udb-menu__header">
                <h3 className="udb-menu__heading">{labels.notificationsTitle}</h3>

                {unreadCount > 0 && (
                  <button type="button" onClick={onMarkAllRead} className="udb-menu__action">{labels.markAllRead}</button>

                )}
              </div>

              <div className="udb-notif__list">
                {notifications.map((n) => {
                  const actionable = Boolean(n.to || n.onSelect);
                  const openNotification = () => {
                    if (n.onSelect) n.onSelect();
                    else if (n.to) navigate(n.to);
                  };
                  const body = (
                    <>
                      <p className="udb-notif__text">{n.text}</p>

                      <p className="udb-notif__meta">
                        <span className="udb-notif__dot" />
                        {formatNotificationTime(n.createdAt)}
                      </p>
                    </>
                  );
                  return (
                    <div key={n.id} className={`udb-notif__item${!n.read ? " udb-notif__item--unread" : ""}`}>
                      {actionable ? (
                        <button
                          type="button"
                          onClick={openNotification}
                          className="udb-notif__body udb-notif__body--link"
                        >
                          {body}
                        </button>
                      ) : (
                        <div className="udb-notif__body">{body}</div>
                      )}

                      <button
                        type="button"
                        onClick={() => onDismissNotification?.(n.id)}
                        className="udb-notif__dismiss"
                        aria-label={labels.dismissNotification}
                      >
                        <X className="udb-notif__dismiss-icon" />
                      </button>

                    </div>
                  );
                })}
                {notifications.length === 0 && (
                  <div className="udb-notif__empty">
                    <div className="udb-notif__empty-icon">
                      <Bell className="udb-notif__empty-bell" />
                    </div>

                    <p className="udb-notif__empty-text">{labels.noNotifications}</p>

                  </div>

                )}
              </div>

              {notificationsViewAll && (
                <DropdownMenuItem className="udb-menu__item udb-notif__view-all" onSelect={() => navigate(notificationsViewAll.to)}>
                  {notificationsViewAll.label}
                </DropdownMenuItem>

              )}
            </DropdownMenuContent>

          </DropdownMenu>

        )}

        {(user || customItems.length > 0 || showDefaultProfileItems) && (
          <>
            <div className="udb-header__divider" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="udb-profile-btn" aria-label={labels.profile}>
                  <Avatar name={user?.name} size="sm" className="udb-avatar">
                    {user?.avatar && <AvatarImage src={user.avatar} alt="" />}
                  </Avatar>

                  <ChevronDown className="udb-profile-btn__chevron" />
                </button>

              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="udb-menu udb-menu--pop udb-profile-menu">
                <div className="udb-profile-menu__id">
                  <p className="udb-profile-menu__name">{user?.name || labels.guestName}</p>

                  <p className="udb-profile-menu__email">{user?.email}</p>

                </div>

                <div className="udb-profile-menu__items">
                  {showDefaultProfileItems && (
                    <DropdownMenuItem className="udb-menu__item" onSelect={() => navigate(profileRoute)}>
                      <User className="udb-menu__item-icon" />
                      {labels.profile}
                    </DropdownMenuItem>

                  )}
                  {customItems.map((item) => (
                    <DropdownMenuItem
                      key={item.key}
                      className={item.danger ? "udb-menu__item udb-menu__item--danger" : "udb-menu__item"}
                      onSelect={() => {
                        if (item.to) navigate(item.to);
                        item.onSelect?.();
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </DropdownMenuItem>

                  ))}
                  {showDefaultProfileItems && (
                    <DropdownMenuItem className="udb-menu__item" onSelect={() => navigate(settingsRoute)}>
                      <Settings className="udb-menu__item-icon" />
                      {labels.settings}
                    </DropdownMenuItem>

                  )}
                </div>

                {onLogout && (
                  <>
                    <DropdownMenuSeparator className="udb-profile-menu__separator" />
                    <DropdownMenuItem className="udb-menu__item udb-menu__item--danger" onSelect={() => void handleLogout()}>
                      <LogOut className="udb-menu__item-icon" />
                      {labels.logout}
                    </DropdownMenuItem>

                  </>

                )}
              </DropdownMenuContent>

            </DropdownMenu>

          </>

        )}
      </div>

    </header>

  );
};
