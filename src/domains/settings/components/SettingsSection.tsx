import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "../../../primitives";
import type { SettingsSection as SettingsSectionType } from "../types/settings";

interface SettingsSectionProps {
  /** Section configuration */
  section: SettingsSectionType;
  /** Current path */
  currentPath?: string;
  /** On navigate callback */
  onNavigate?: (path: string) => void;
  /** Collapsed state */
  collapsed?: boolean;
}

/**
 * Settings Section Component
 *
 * Displays a section of settings items.
 * Items without a path and without an onClick handler are hidden
 * (an empty interactive element violates a11y and is dead code).
 */
export const SettingsSection = ({
  section,
  currentPath,
  onNavigate,
  collapsed = false,
}: SettingsSectionProps) => {
  const filteredItems = useMemo(
    () => section.items.filter((item) => item.enabled !== false),
    [section.items],
  );

  if (filteredItems.length === 0) return null;

  return (
    <div className="udb-settings-nav">
      {!collapsed && (
        <h3 className="udb-settings-nav__title">
          {section.title}
        </h3>
      )}

      <div className="udb-settings-nav__items">
        {filteredItems.map((item) => {
          const isActive = currentPath === item.path;
          const hasNavigation = Boolean(item.path) || Boolean(item.onClick);

          // Skip rendering items that have neither a path nor a click handler.
          if (!hasNavigation) {
            return null;
          }

          const itemContent = (
            <>
              {item.icon && (
                <item.icon className="udb-settings-nav__item-icon" />
              )}
              {!collapsed && (
                <>
                  <span className="udb-settings-nav__item-label">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className="udb-settings-nav__badge"
                      aria-label={`${item.badge} notifications`}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                  {item.path && (
                    <ChevronRight
                      className="udb-settings-nav__chevron"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </>
          );

          const itemClassName = cn(
            "udb-settings-nav__item",
            isActive && "udb-settings-nav__item--active",
          );

          if (item.path) {
            return (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => onNavigate?.(item.path as string)}
                className={itemClassName}
                title={collapsed ? item.label : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                {itemContent}
              </Link>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
              onClick={item.onClick}
              className={itemClassName}
              title={collapsed ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              {itemContent}
            </button>
          );
        })}
      </div>
    </div>
  );
};
