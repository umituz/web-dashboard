import { NavLink } from 'react-router';

export interface TabNavItem {
  to: string;
  label: string;
  end?: boolean;
}

export interface TabNavProps {
  items: readonly TabNavItem[];
  className?: string;
}

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
