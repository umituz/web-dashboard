import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
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
 *
 * @param props - Settings section props
 */
export const SettingsSection = ({
  section,
  currentPath,
  onNavigate,
  collapsed = false,
}: SettingsSectionProps) => {
  const filteredItems = section.items.filter((item) => item.enabled !== false);

  if (filteredItems.length === 0) return null;

  return (
    <div className="mb-6 last:mb-0">
      {!collapsed && (
        <h3 className="px-2 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {section.title}
        </h3>
      )}

      <div className="space-y-1">
        {filteredItems.map((item) => {
          const isActive = currentPath === item.path;

          const itemContent = (
            <>
              {item.icon && (
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive && "scale-110"
                  )}
                />
              )}
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                  {item.path && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </>
              )}
            </>
          );

          const itemClassName = cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 w-full",
            "hover:bg-accent hover:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground",
            collapsed ? "justify-center" : "justify-start"
          );

          if (item.path) {
            return (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => onNavigate?.(item.path!)}
                className={itemClassName}
                title={collapsed ? item.label : undefined}
              >
                {itemContent}
              </Link>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {}}
              className={itemClassName}
              title={collapsed ? item.label : undefined}
            >
              {itemContent}
            </button>
          );
        })}
      </div>
    </div>
  );
};
