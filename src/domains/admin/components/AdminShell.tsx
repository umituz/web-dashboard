import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import { cn } from '@umituz/web-design-system/utils';
import type { AdminNavItem } from '../types';

export interface AdminShellProps {
  readonly title: string;
  readonly description?: string;
  readonly badge?: ReactNode;
  readonly actions?: ReactNode;
  readonly navItems?: readonly AdminNavItem[];
  readonly activeNavId?: string;
  readonly onNavChange?: (item: AdminNavItem) => void;
  readonly children: ReactNode;
  readonly className?: string;
}

export function AdminShell({
  title,
  description,
  badge,
  actions,
  navItems,
  activeNavId,
  onNavChange,
  children,
  className,
}: AdminShellProps) {
  return (
    <div className={cn('udb-admin-shell', className)}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">{title}</h1>
            {badge}
          </div>
          {description && <p className="mt-1 text-sm text-ink-2 leading-relaxed">{description}</p>}
        </div>
        {actions && <div className="mt-3 flex items-center gap-2 sm:mt-0">{actions}</div>}
      </div>

      {navItems && navItems.length > 0 && (
        <nav aria-label="Admin sections" className="udb-admin-subnav">
          {navItems.map((item) => {
            if (onNavChange) {
              const isActive = activeNavId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavChange(item)}
                  className={cn('udb-admin-subnav-item', isActive && 'is-active')}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge}
                </button>
              );
            }

            return (
              <NavLink
                key={item.id}
                to={item.href}
                end={item.exact}
                className={({ isActive }) => cn('udb-admin-subnav-item', isActive && 'is-active')}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge}
              </NavLink>
            );
          })}
        </nav>
      )}

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
