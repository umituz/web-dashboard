import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useT } from "@umituz/web-localization/react";

import { Button } from "@umituz/web-design-system/atoms";
import { cn } from "@umituz/web-design-system/utils/cn";
import { BrandLogo } from "./BrandLogo";
import { PenTool, Menu, ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import type { DashboardSidebarProps, SidebarAction } from "../types/layout";
import type { DashboardUser } from "../types/user";
import type { SidebarGroup } from "../types/sidebar";
import { filterSidebarItems } from "../utils/dashboard";

interface DashboardSidebarPropsExtended extends DashboardSidebarProps {
  sidebarGroups: SidebarGroup[];
  brandName?: string;
  brandTagline?: string;
  /** Custom brand mark — replaces the built-in logo (text block still follows brandName). */
  brand?: ReactNode;
  /** Generic primary action — replaces the legacy create-post button. */
  sidebarAction?: SidebarAction;
  /** Extra node above the collapse button in the footer (hidden while collapsed). */
  sidebarFooter?: ReactNode;
  createPostRoute?: string;
  showCreatePost?: boolean;
  user?: DashboardUser;
}

export const DashboardSidebar = ({
  collapsed,
  setCollapsed,
  sidebarGroups,
  brandName = "App",
  brandTagline = "grow smarter",
  brand,
  sidebarAction,
  sidebarFooter,
  createPostRoute = "/dashboard/create",
  showCreatePost = true,
  user,
}: DashboardSidebarPropsExtended) => {
  const location = useLocation();
  const t = useT();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const renderAction = (label: string, icon: ReactNode, linkProps?: { to: string }) => {
    const button = (
      <Button
        variant="default"
        className={cn("udb-sidebar__create-btn", collapsed && "udb-sidebar__create-btn--collapsed")}
        title={collapsed ? label : undefined}
        {...(linkProps ? {} : { onClick: () => sidebarAction?.onClick?.() })}
      >
        {icon}
        {!collapsed && <span className="udb-sidebar__create-label">{label}</span>}
      </Button>
    );
    return linkProps ? <Link to={linkProps.to}>{button}</Link> : button;
  };

  return (
    <div className={cn("udb-sidebar", collapsed && "udb-sidebar--collapsed")}>
      <div className="udb-sidebar__brand">
        {brand ?? <BrandLogo size={32} />}
        {!collapsed && brandName !== "" && (
          <div className="udb-sidebar__brand-text">
            <span className="udb-sidebar__brand-name">{brandName || "App"}</span>
            <span className="udb-sidebar__brand-tagline">{brandTagline}</span>
          </div>
        )}
      </div>

      {sidebarAction ? (
        <div className="udb-sidebar__create">
          {renderAction(
            sidebarAction.label,
            sidebarAction.icon ? <sidebarAction.icon className="udb-sidebar__create-icon" /> : null,
            sidebarAction.to ? { to: sidebarAction.to } : undefined
          )}
        </div>
      ) : (
        showCreatePost && createPostRoute && (
          <div className="udb-sidebar__create">
            {renderAction(
              t('sidebar.createPost'),
              <PenTool className="udb-sidebar__create-icon" />,
              { to: createPostRoute }
            )}
          </div>
        )
      )}

      <nav className="udb-sidebar__nav">
        <div className="udb-sidebar__groups">
          {sidebarGroups.map((group) => {
            const filteredItems = filterSidebarItems(group.items, user);

            if (filteredItems.length === 0) return null;

            const isGroupCollapsed = collapsedGroups[group.title];

            return (
              <div key={group.title} className="udb-sidebar__group">
                {!collapsed && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.title)}
                    className="udb-sidebar__group-toggle"
                  >
                    <span className="udb-sidebar__group-title">
                      {t(group.title, { brand: brandName })}
                    </span>
                    <span className="udb-sidebar__group-chevron">
                      {isGroupCollapsed ? (
                        <ChevronRight className="udb-sidebar__chevron-icon" />
                      ) : (
                        <ChevronDown className="udb-sidebar__chevron-icon" />
                      )}
                    </span>
                  </button>
                )}

                {(!isGroupCollapsed || collapsed) && filteredItems.map((item) => {
                  const active =
                    location.pathname === item.path ||
                    (item.end === false && location.pathname.startsWith(item.path + "/"));
                  const labelText = item.raw ? item.label : t(item.label);
                  const collapsedTitle =
                    item.badge !== undefined && item.badge !== ""
                      ? `${labelText} (${item.badge})`
                      : labelText;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn("udb-sidebar__item", active && "udb-sidebar__item--active")}
                      title={collapsed ? collapsedTitle : undefined}
                    >
                      <item.icon className="udb-sidebar__item-icon" />
                      {!collapsed && <span>{labelText}</span>}
                      {!collapsed && item.badge !== undefined && item.badge !== "" && (
                        <span className="udb-sidebar__item-badge">{item.badge}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="udb-sidebar__footer">
        {sidebarFooter && <div className="udb-sidebar__footer-slot">{sidebarFooter}</div>}
        {!collapsed && (
          <p className="udb-sidebar__footer-label">
            {t('sidebar.system')}
          </p>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="udb-sidebar__footer-btn">
          {collapsed ? <Menu className="udb-sidebar__footer-icon" /> : <ChevronLeft className="udb-sidebar__footer-icon" />}
        </Button>
      </div>
    </div>
  );
};
