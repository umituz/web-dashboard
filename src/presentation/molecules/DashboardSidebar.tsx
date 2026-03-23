import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@umituz/web-design-system/atoms";
import { BrandLogo } from "./BrandLogo";
import { PenTool, Menu, ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import type { DashboardUser, SidebarGroup } from "../../domain/types";
import type { DashboardSidebarProps } from "../../domain/types";

interface DashboardSidebarPropsExtended extends DashboardSidebarProps {
  /** Sidebar groups configuration */
  sidebarGroups: SidebarGroup[];
  /** Brand name */
  brandName?: string;
  /** Brand tagline */
  brandTagline?: string;
  /** Create post route */
  createPostRoute?: string;
  /** Auth user */
  user?: DashboardUser;
}

/**
 * Dashboard Sidebar Component
 *
 * Displays collapsible sidebar with navigation menu items.
 * Supports app-based filtering (mobile/web) and collapsible groups.
 *
 * @param props - Dashboard sidebar props
 */
export const DashboardSidebar = ({
  collapsed,
  setCollapsed,
  sidebarGroups,
  brandName = "App",
  brandTagline = "grow smarter",
  createPostRoute = "/dashboard/create",
  user,
}: DashboardSidebarPropsExtended) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="flex h-full flex-col">
      {/* Brand Section */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4 transition-all duration-300">
        <BrandLogo size={32} />
        {!collapsed && (
          <div className="flex flex-col -gap-1">
            <span className="text-2xl font-black text-sidebar-foreground tracking-tighter leading-none">{brandName}</span>
            <span className="text-[11px] font-bold text-primary/70 lowercase tracking-tight mt-2 ml-1 select-none underline decoration-primary/40 underline-offset-[6px] decoration-2">
              {brandTagline}
            </span>
          </div>
        )}
      </div>

      {/* Create Button */}
      <div className="px-3 py-4 border-b border-sidebar-border/50">
        <Link to={createPostRoute}>
          <Button
            variant="default"
            className={`w-full gap-3 shadow-glow transition-all active:scale-95 group overflow-hidden rounded-xl ${
              collapsed ? "px-0 justify-center h-10 w-10 mx-auto" : "justify-start px-4 h-11"
            }`}
            title={collapsed ? t('sidebar.createPost') : undefined}
          >
            <PenTool className={`shrink-0 transition-transform duration-300 ${collapsed ? "h-5 w-5" : "h-4 w-4 group-hover:scale-110"}`} />
            {!collapsed && <span className="font-bold tracking-tight">{t('sidebar.createPost')}</span>}
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-hide">
        <div className="space-y-6">
          {sidebarGroups.map((group) => {
            const filteredItems = group.items.filter(item => {
              // Skip disabled items (enabled: false or undefined defaults to true)
              if (item.enabled === false) return false;
              // Skip items that require specific app types
              if (!item.requiredApp) return true;
              if (item.requiredApp === 'mobile') return (user as any)?.hasMobileApp;
              if (item.requiredApp === 'web') return (user as any)?.hasWebApp;
              return true;
            });

            if (filteredItems.length === 0) return null;

            const isGroupCollapsed = collapsedGroups[group.title];

            return (
              <div key={group.title} className="space-y-1">
                {!collapsed && (
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="w-full flex items-center justify-between px-3 mb-2 group/header"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40 group-hover/header:text-sidebar-foreground/70 transition-colors">
                      {group.title === "sidebar.ai" ? `${brandName} AI` : t(group.title)}
                    </span>
                    {isGroupCollapsed ? (
                      <ChevronRight className="h-3 w-3 text-sidebar-foreground/30 flex-shrink-0 group-hover/header:text-sidebar-foreground/50 transition-colors" />
                    ) : (
                      <ChevronDown className="h-3 w-3 text-sidebar-foreground/30 flex-shrink-0 group-hover/header:text-sidebar-foreground/50 transition-colors" />
                    )}
                  </button>
                )}

                {(!isGroupCollapsed || collapsed) && filteredItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                      } ${collapsed ? "justify-center" : ""}`}
                      title={collapsed ? t(item.label) : undefined}
                    >
                      <item.icon className={`h-4 w-4 shrink-0 transition-transform ${active && "scale-110"}`} />
                      {!collapsed && <span>{t(item.label)}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-sidebar-border p-3">
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/40 font-bold px-2">
              {t('sidebar.system')}
            </p>
          )}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="text-sidebar-foreground/70">
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
