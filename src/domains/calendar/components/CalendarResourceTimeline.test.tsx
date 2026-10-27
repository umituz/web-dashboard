import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { CalendarResourceTimeline } from './CalendarResourceTimeline';
import type { CalendarItem } from '../types/view.types';

const item = (id: string, resourceId: string, startMin: number, endMin: number): CalendarItem => ({
  id,
  dayKey: '2026-03-15',
  resourceId,
  startMin,
  endMin,
  title: id,
});

const resources = [
  { id: 'room-1', label: 'Salle Lumière' },
  { id: 'room-2', label: 'Salle Méliès' },
];

const mount = (props: Partial<Parameters<typeof CalendarResourceTimeline>[0]> = {}) =>
  render(<CalendarResourceTimeline resources={resources} items={[]} {...props} />);

const numberIn = (value: string): number => parseFloat(value.replace(/^calc\(/, ''));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CalendarResourceTimeline', () => {
  it('renders one row per resource and drops items without a matching resource', () => {
    const { container } = mount({
      items: [item('Screening', 'room-1', 600, 660), item('Orphan', 'room-9', 660, 720)],
    });
    const rows = container.querySelectorAll('.udb-cal-res-row');
    expect(rows).toHaveLength(2);
    expect(screen.getByText('Salle Lumière')).toBeTruthy();
    expect(screen.queryByText('Orphan')).toBeNull();
  });

  it('positions blocks along the horizontal minute axis', () => {
    mount({ items: [item('Screening', 'room-1', 600, 660)] });
    const block = screen.getByText('Screening').closest('button') as HTMLElement;
    expect(numberIn(block.style.left)).toBeCloseTo(21.4286, 3);
    expect(numberIn(block.style.width)).toBeCloseTo(7.1429, 3);
  });

  it('splits overlapping blocks on the same resource into columns', () => {
    mount({ items: [item('first', 'room-1', 600, 660), item('second', 'room-1', 630, 690)] });
    const first = screen.getByText('first').closest('button') as HTMLElement;
    const second = screen.getByText('second').closest('button') as HTMLElement;
    expect(numberIn(first.style.width)).toBeCloseTo(3.5714, 3);
    expect(numberIn(second.style.width)).toBeCloseTo(3.5714, 3);
  });

  it('quantizes lane clicks to slot boundaries', () => {
    const onSlotClick = vi.fn();
    const { container } = mount({
      items: [item('Screening', 'room-1', 600, 660)],
      onSlotClick,
    });
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      height: 56,
      bottom: 56,
      left: 0,
      right: 400,
      width: 400,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
    const lane = container.querySelector('.udb-cal-res-lane') as HTMLElement;
    fireEvent.click(lane, { clientX: 100 });
    expect(onSlotClick).toHaveBeenCalledWith('room-1', 630);
  });

  it('reports item selection with the payload round-trip', () => {
    const onSelectItem = vi.fn();
    mount({
      items: [{ ...item('Screening', 'room-1', 600, 660), payload: { screeningId: 42 } }],
      onSelectItem,
    });
    fireEvent.click(screen.getByText('Screening'));
    expect(onSelectItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'Screening', payload: { screeningId: 42 } }),
    );
  });

  it('falls back to the default empty label when nothing is scheduled', () => {
    mount();
    expect(screen.getByText('Nothing scheduled')).toBeTruthy();
  });
});
