import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActivityFeed } from './ActivityFeed';
import { ActivityTimeline } from './ActivityTimeline';
import type { ActivityItem } from '../types';

const sampleItems: ActivityItem[] = [
  {
    id: 'act-1',
    timestamp: '2026-11-21T10:00:00Z',
    title: 'Contract signed',
    description: 'Master services agreement executed by client.',
    actor: { name: 'Sarah Connor' },
    target: { label: 'Matter #402', href: '/cases/402' },
    tone: 'success',
  },
  {
    id: 'act-2',
    timestamp: '2026-11-20T14:30:00Z',
    title: 'Document uploaded',
    actor: 'John Doe',
    tone: 'info',
  },
];

describe('ActivityFeed', () => {
  it('renders empty state when items array is empty', () => {
    render(<ActivityFeed items={[]} emptyTitle="No events found" emptyDescription="Check back later." />);
    expect(screen.getByText('No events found')).toBeTruthy();
    expect(screen.getByText('Check back later.')).toBeTruthy();
  });

  it('renders items with titles, actors, and targets', () => {
    render(<ActivityFeed items={sampleItems} groupByDay={false} />);
    expect(screen.getByText('Contract signed')).toBeTruthy();
    expect(screen.getByText('Document uploaded')).toBeTruthy();
    expect(screen.getByText('Sarah Connor')).toBeTruthy();
    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('Matter #402')).toBeTruthy();
  });

  it('handles item clicks when onItemClick is provided', () => {
    const handleClick = vi.fn();
    render(<ActivityFeed items={sampleItems} groupByDay={false} onItemClick={handleClick} />);
    fireEvent.click(screen.getByText('Contract signed'));
    expect(handleClick).toHaveBeenCalledWith(sampleItems[0]);
  });
});

describe('ActivityTimeline', () => {
  it('renders empty state when items array is empty', () => {
    render(<ActivityTimeline items={[]} emptyTitle="Empty timeline" />);
    expect(screen.getByText('Empty timeline')).toBeTruthy();
  });

  it('renders timeline rail and items', () => {
    render(<ActivityTimeline items={sampleItems} groupByDay={false} />);
    expect(screen.getByText('Contract signed')).toBeTruthy();
    expect(screen.getByText('Document uploaded')).toBeTruthy();
  });
});
