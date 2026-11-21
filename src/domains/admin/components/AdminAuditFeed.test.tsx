import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminAuditFeed } from './AdminAuditFeed';
import type { AdminAuditEntry } from '../types';

const entries: AdminAuditEntry[] = [
  {
    id: 'entry-1',
    actor: 'user-1',
    actorName: 'Alice Admin',
    action: 'user.suspend',
    target: 'Bob Smith',
    entityType: 'User',
    timestamp: '2026-03-01T10:00:00Z',
    severity: 'warning',
  },
  {
    id: 'entry-2',
    actor: 'system',
    actorName: 'System',
    action: 'billing.charge',
    target: 'Invoice #102',
    entityType: 'Invoice',
    timestamp: '2026-03-01T11:00:00Z',
    severity: 'info',
  },
];

describe('AdminAuditFeed', () => {
  it('renders audit entries with actor, action, target and severity badge', () => {
    render(<AdminAuditFeed entries={entries} />);
    expect(screen.getByText('Alice Admin')).toBeTruthy();
    expect(screen.getByText('user.suspend')).toBeTruthy();
    expect(screen.getByText('→ Bob Smith')).toBeTruthy();
    expect(screen.getByText('warning')).toBeTruthy();

    expect(screen.getByText('System')).toBeTruthy();
    expect(screen.getByText('billing.charge')).toBeTruthy();
  });

  it('limits displayed items when maxItems is specified', () => {
    render(<AdminAuditFeed entries={entries} maxItems={1} />);
    expect(screen.getByText('user.suspend')).toBeTruthy();
    expect(screen.queryByText('billing.charge')).toBeNull();
  });

  it('triggers onEntryClick when clicked', () => {
    const handleClick = vi.fn();
    render(<AdminAuditFeed entries={entries} onEntryClick={handleClick} />);

    fireEvent.click(screen.getByText('user.suspend'));
    expect(handleClick).toHaveBeenCalledWith(entries[0]);
  });

  it('renders loading state when loading is true', () => {
    render(<AdminAuditFeed entries={[]} loading={true} />);
    expect(screen.getByText('Loading audit trail…')).toBeTruthy();
  });

  it('renders empty label when no entries exist', () => {
    render(<AdminAuditFeed entries={[]} emptyLabel="No actions logged yet" />);
    expect(screen.getByText('No actions logged yet')).toBeTruthy();
  });
});
