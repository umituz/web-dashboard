import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { CalendarAgenda } from './CalendarAgenda';
import type { CalendarItem } from '../types/view.types';
import { todayKey } from '../utils/layout';

const item = (id: string, dayKey: string, startMin?: number, endMin?: number): CalendarItem => ({
  id,
  dayKey,
  startMin,
  endMin,
  title: id,
});

describe('CalendarAgenda', () => {
  it('groups only days with items inside the window', () => {
    render(
      <CalendarAgenda
        items={[
          item('Kickoff', '2026-03-15', 600, 660),
          item('Beyond', '2026-04-20', 900),
        ]}
        anchorKey="2026-03-10"
        agendaDays={30}
      />,
    );
    expect(screen.getByText('Sunday, March 15, 2026')).toBeTruthy();
    expect(screen.queryByText(/April 20/)).toBeNull();
  });

  it('marks the today group and counts its items', () => {
    const today = todayKey();
    render(
      <CalendarAgenda
        items={[item('First', today, 540, 600), item('Second', today, 720)]}
        anchorKey={today}
      />,
    );
    expect(screen.getByText('Today')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('fires onSelectItem with the payload-carrying item', () => {
    const onSelectItem = vi.fn();
    render(
      <CalendarAgenda
        items={[item('Kickoff', '2026-03-15', 600, 660)]}
        anchorKey="2026-03-15"
        onSelectItem={onSelectItem}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Kickoff/ }));
    expect(onSelectItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'Kickoff', dayKey: '2026-03-15' }),
    );
  });

  it('renders a custom empty state when the window has no items', () => {
    render(
      <CalendarAgenda
        items={[]}
        anchorKey="2026-03-10"
        emptyState={<button type="button">Book a shoot day</button>}
      />,
    );
    expect(screen.getByText('Book a shoot day')).toBeTruthy();
  });

  it('falls back to the default empty label', () => {
    render(<CalendarAgenda items={[]} anchorKey="2026-03-10" />);
    expect(screen.getByText('Nothing scheduled')).toBeTruthy();
  });
});
