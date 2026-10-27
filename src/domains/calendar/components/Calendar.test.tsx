import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Calendar } from './Calendar';
import type { CalendarItem } from '../types/view.types';

const item = (id: string, dayKey: string, startMin?: number, endMin?: number): CalendarItem => ({
  id,
  dayKey,
  startMin,
  endMin,
  title: id,
});

const mount = (props: Partial<Parameters<typeof Calendar>[0]> = {}) =>
  render(
    <Calendar
      items={[item('Kickoff', '2026-03-15', 600, 660)]}
      cursor="2026-03-10"
      {...props}
    />,
  );

describe('Calendar', () => {
  it('renders the month grid with a localized title by default', () => {
    const { container } = mount();
    expect(screen.getByText('March 2026')).toBeTruthy();
    expect(container.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
  });

  it('switches to a seven-lane week grid and a single day grid', () => {
    mount();
    fireEvent.click(screen.getByText('Week'));
    expect(screen.getByRole('region', { name: '2026-03-15' })).toBeTruthy();
    fireEvent.click(screen.getByText('Day'));
    expect(screen.getByText('Tuesday, March 10, 2026')).toBeTruthy();
  });

  it('drills from a month cell into the day view', () => {
    const onSelectDay = vi.fn();
    render(
      <Calendar
        items={[item('Kickoff', '2026-03-15', 600, 660)]}
        initialCursor="2026-03-10"
        onSelectDay={onSelectDay}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '2026-03-15' }));
    expect(onSelectDay).toHaveBeenCalledWith('2026-03-15');
    expect(screen.getByText('Sunday, March 15, 2026')).toBeTruthy();
  });

  it('respects a controlled view', () => {
    mount({ view: 'day' });
    expect(screen.getByText('Tuesday, March 10, 2026')).toBeTruthy();
  });

  it('reports view changes', () => {
    const onViewChange = vi.fn();
    mount({ onViewChange });
    fireEvent.click(screen.getByText('Week'));
    expect(onViewChange).toHaveBeenCalledWith('week');
  });

  it('renders the legend', () => {
    mount({ legend: [{ tone: 'success', label: 'Confirmed' }] });
    expect(screen.getByText('Confirmed')).toBeTruthy();
  });

  it('renders toolbar extras inside the toolbar', () => {
    mount({ toolbarExtra: <span className="calendar-count">4 appointments</span> });
    const extra = screen.getByText('4 appointments').closest('.udb-cal-extra');
    expect(extra).toBeTruthy();
  });
});
