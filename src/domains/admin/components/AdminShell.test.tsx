import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AdminShell } from './AdminShell';
import type { AdminNavItem } from '../types';

const navItems: AdminNavItem[] = [
  { id: 'overview', label: 'Overview', href: '/admin', exact: true },
  { id: 'users', label: 'Users', href: '/admin/users' },
  { id: 'health', label: 'Health', href: '/admin/health' },
];

describe('AdminShell', () => {
  it('renders title, description and children', () => {
    render(
      <AdminShell title="Platform Console" description="Manage all system tenants">
        <div>Admin content area</div>
      </AdminShell>,
    );

    expect(screen.getByText('Platform Console')).toBeTruthy();
    expect(screen.getByText('Manage all system tenants')).toBeTruthy();
    expect(screen.getByText('Admin content area')).toBeTruthy();
  });

  it('renders interactive subnav buttons when onNavChange is provided', () => {
    const handleNavChange = vi.fn();
    render(
      <AdminShell
        title="Admin"
        navItems={navItems}
        activeNavId="users"
        onNavChange={handleNavChange}
      >
        <div>Content</div>
      </AdminShell>,
    );

    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Users')).toBeTruthy();
    expect(screen.getByText('Health')).toBeTruthy();

    fireEvent.click(screen.getByText('Health'));
    expect(handleNavChange).toHaveBeenCalledWith(navItems[2]);
  });

  it('renders NavLinks when rendered inside a Router without onNavChange', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminShell title="Admin" navItems={navItems}>
          <div>Content</div>
        </AdminShell>
      </MemoryRouter>,
    );

    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Users')).toBeTruthy();
  });
});
