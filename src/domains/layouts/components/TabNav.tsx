import { NavLink } from 'react-router';

export interface TabNavItem {
  to: string;
  label: string;
  /** Should the route match only exactly (e.g. the index tab). */
  end?: boolean;
}

export interface TabNavProps {
  items: readonly TabNavItem[];
  className?: string;
}

/** Route-connected section tabs with an active underline. */
export function TabNav({ items, className }: TabNavProps) {
  return (
    <nav className={className !== undefined ? `udb-tabnav ${className}` : 'udb-tabnav'} aria-label="Section tabs">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            isActive ? 'udb-tabnav__tab udb-tabnav__tab--active' : 'udb-tabnav__tab'
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
