import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminUsersTable } from './AdminUsersTable';
import type { AdminUser } from '../types';

const users: AdminUser[] = [
  {
    id: 'u-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    roles: ['admin', 'owner'],
    status: 'active',
    createdAt: '2026-01-15T12:00:00Z',
  },
  {
    id: 'u-2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    roles: ['member'],
    status: 'suspended',
    createdAt: '2026-02-20T12:00:00Z',
  },
];

describe('AdminUsersTable', () => {
  it('renders user rows with names, emails, roles and statuses', () => {
    render(<AdminUsersTable users={users} />);
    expect(screen.getByText('Alice Johnson')).toBeTruthy();
    expect(screen.getByText('alice@example.com')).toBeTruthy();
    expect(screen.getByText('admin')).toBeTruthy();
    expect(screen.getByText('owner')).toBeTruthy();
    expect(screen.getByText('active')).toBeTruthy();

    expect(screen.getByText('Bob Smith')).toBeTruthy();
    expect(screen.getByText('bob@example.com')).toBeTruthy();
    expect(screen.getByText('suspended')).toBeTruthy();
  });

  it('filters users using internal search input', () => {
    render(<AdminUsersTable users={users} />);
    const searchInput = screen.getByPlaceholderText('Search users by name or email…');
    fireEvent.change(searchInput, { target: { value: 'alice' } });

    expect(screen.getByText('Alice Johnson')).toBeTruthy();
    expect(screen.queryByText('Bob Smith')).toBeNull();
  });

  it('handles action buttons: edit roles, moderate, and view details', () => {
    const handleEditRoles = vi.fn();
    const handleModerate = vi.fn();
    const handleViewDetails = vi.fn();

    render(
      <AdminUsersTable
        users={users}
        onEditRoles={handleEditRoles}
        onModerate={handleModerate}
        onViewDetails={handleViewDetails}
      />,
    );

    fireEvent.click(screen.getAllByLabelText('View user details')[0]!);
    expect(handleViewDetails).toHaveBeenCalledWith(users[0]);

    fireEvent.click(screen.getAllByLabelText('Edit roles')[0]!);
    expect(handleEditRoles).toHaveBeenCalledWith(users[0]);

    fireEvent.click(screen.getByLabelText('Suspend user'));
    expect(handleModerate).toHaveBeenCalledWith(users[0], 'suspend');

    fireEvent.click(screen.getByLabelText('Activate user'));
    expect(handleModerate).toHaveBeenCalledWith(users[1], 'activate');
  });

  it('renders empty state when users array is empty', () => {
    render(<AdminUsersTable users={[]} emptyTitle="No registered users" />);
    expect(screen.getByText('No registered users')).toBeTruthy();
  });
});
