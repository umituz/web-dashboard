import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { CalendarMonth } from './CalendarMonth';
import type { CalendarItem } from '../types/view.types';

const item = (id: string, dayKey: string, startMin?: number): CalendarItem => ({
  id,
  dayKey,
  startMin,
  title: id,
});

const mount = (props: Partial<Parameters<typeof CalendarMonth>[0]> = {}) =>
  render(<CalendarMonth items={[]} anchorKey="2026-03-10" {...props} />);

describe('CalendarMonth', () => {
  it('renders a six-by-seven matrix', () => {
    const { container } = mount();
    expect(container.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
  });

  it('places items on their day and reports selections', () => {
    const onSelectItem = vi.fn();
    mount({ items: [item('Kickoff', '2026-03-15', 600)], onSelectItem });
    fireEvent.click(screen.getByText('Kickoff'));
    expect(onSelectItem).toHaveBeenCalledTimes(1);
    expect(onSelectItem.mock.calls[0]![0].id).toBe('Kickoff');
  });

  it('caps chips per cell and overflows through the more label', () => {
    const onSelectDay = vi.fn();
    const items = [
      item('one', '2026-03-15', 540),
      item('two', '2026-03-15', 600),
      item('three', '2026-03-15', 660),
      item('four', '2026-03-15', 720),
    ];
    mount({ items, maxPerDay: 2, onSelectDay });
    expect(screen.getByText('one')).toBeTruthy();
    expect(screen.getByText('two')).toBeTruthy();
    expect(screen.queryByText('three')).toBeNull();
    expect(screen.getByText('+2 more')).toBeTruthy();
    fireEvent.click(screen.getByText('+2 more'));
    expect(onSelectDay).toHaveBeenCalledWith('2026-03-15');
  });

  it('supports label overrides for the overflow chip', () => {
    const items = [item('one', '2026-03-15'), item('two', '2026-03-15'), item('three', '2026-03-15')];
    mount({ items, maxPerDay: 1, labels: { more: '+{count} tane' } });
    expect(screen.getByText('+2 tane')).toBeTruthy();
  });

  it('fires day selection from the day number button', () => {
    const onSelectDay = vi.fn();
    mount({ onSelectDay });
    fireEvent.click(screen.getByRole('button', { name: '2026-03-15' }));
    expect(onSelectDay).toHaveBeenCalledWith('2026-03-15');
  });
});
