import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AttentionQueue } from './AttentionQueue';

describe('AttentionQueue', () => {
  it('renders empty state when items is empty', () => {
    render(
      <AttentionQueue
        items={[]}
        emptyTitle="All caught up"
        emptyDescription="No pending items found"
      />,
    );
    expect(screen.getByText('All caught up')).toBeTruthy();
    expect(screen.getByText('No pending items found')).toBeTruthy();
  });

  it('renders list of attention items with badge and meta', () => {
    render(
      <MemoryRouter>
        <AttentionQueue
          items={[
            {
              id: 'inv-1',
              title: 'Invoice INV-100 overdue',
              subtitle: 'Client Acme Corp',
              badge: { label: 'Overdue', tone: 'danger' },
              meta: '$4,200',
              href: '/finance',
            },
            {
              id: 'shp-2',
              title: 'Customs hold on SHP-20',
              badge: { label: 'Warning', tone: 'warning' },
            },
          ]}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('Invoice INV-100 overdue')).toBeTruthy();
    expect(screen.getByText('Client Acme Corp')).toBeTruthy();
    expect(screen.getByText('Overdue')).toBeTruthy();
    expect(screen.getByText('$4,200')).toBeTruthy();
    expect(screen.getByText('Customs hold on SHP-20')).toBeTruthy();
    expect(screen.getByText('Warning')).toBeTruthy();
  });

  it('respects maxItems limit and triggers onItemClick', () => {
    const handleItemClick = vi.fn();
    render(
      <AttentionQueue
        maxItems={1}
        onItemClick={handleItemClick}
        items={[
          { id: '1', title: 'Task 1' },
          { id: '2', title: 'Task 2' },
        ]}
      />,
    );
    expect(screen.getByText('Task 1')).toBeTruthy();
    expect(screen.queryByText('Task 2')).toBeNull();

    fireEvent.click(screen.getByText('Task 1'));
    expect(handleItemClick).toHaveBeenCalledWith(expect.objectContaining({ id: '1', title: 'Task 1' }));
  });
});
