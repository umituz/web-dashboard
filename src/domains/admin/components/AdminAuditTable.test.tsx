import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminAuditTable } from './AdminAuditTable';
import type { AdminAuditEntry } from '../types';

const entries: AdminAuditEntry[] = [
  {
    id: 'entry-1',
    actor: 'alice@example.com',
    actorName: 'Alice Johnson',
    action: 'role.change',
    target: 'Bob Smith',
    entityType: 'User',
    timestamp: '2026-03-01T12:00:00Z',
    severity: 'info',
    changes: [{ field: 'role', from: 'member', to: 'admin' }],
  },
  {
    id: 'entry-2',
    actor: 'admin@example.com',
    actorName: 'Root Admin',
    action: 'user.suspend',
    target: 'Charlie Brown',
    entityType: 'User',
    timestamp: '2026-03-02T14:30:00Z',
    severity: 'danger',
    changes: [{ field: 'status', from: 'active', to: 'suspended' }],
  },
];

describe('AdminAuditTable', () => {
  it('renders table columns and audit entries', () => {
    render(<AdminAuditTable entries={entries} />);
    expect(screen.getByText('role.change')).toBeTruthy();
    expect(screen.getByText('user.suspend')).toBeTruthy();
    expect(screen.getByText('Alice Johnson')).toBeTruthy();
    expect(screen.getByText('Bob Smith')).toBeTruthy();
    expect(screen.getByText('role: member: admin')).toBeTruthy();
  });

  it('filters entries client-side using internal search input', () => {
    render(<AdminAuditTable entries={entries} />);
    const input = screen.getByPlaceholderText('Search actor, target or action…');
    fireEvent.change(input, { target: { value: 'charlie' } });

    expect(screen.getByText('Charlie Brown')).toBeTruthy();
    expect(screen.queryByText('Bob Smith')).toBeNull();
  });

  it('renders error state and retries on action click', () => {
    const handleRetry = vi.fn();
    render(<AdminAuditTable entries={[]} error="Failed to fetch audit log" onRetry={handleRetry} />);
    expect(screen.getByText('Failed to fetch audit log')).toBeTruthy();

    fireEvent.click(screen.getByText('Try again'));
    expect(handleRetry).toHaveBeenCalled();
  });

  it('handles row click callback', () => {
    const handleRowClick = vi.fn();
    render(<AdminAuditTable entries={entries} onRowClick={handleRowClick} />);

    fireEvent.click(screen.getByText('Bob Smith'));
    expect(handleRowClick).toHaveBeenCalledWith(entries[0]);
  });
});
