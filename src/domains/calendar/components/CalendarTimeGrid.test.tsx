import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { CalendarTimeGrid } from './CalendarTimeGrid';
import type { CalendarItem } from '../types/view.types';

const item = (id: string, dayKey: string, startMin: number, endMin: number): CalendarItem => ({
  id,
  dayKey,
  startMin,
  endMin,
  title: id,
});

const mount = (props: Partial<Parameters<typeof CalendarTimeGrid>[0]> = {}) =>
  render(<CalendarTimeGrid items={[]} days={['2026-03-15']} {...props} />);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CalendarTimeGrid', () => {
  it('positions timed events inside their day lane', () => {
    mount({ items: [item('Consult', '2026-03-15', 600, 660)] });
    const block = screen.getByText('Consult').closest('button') as HTMLElement;
    expect(block.className).toContain('udb-cal-event');
    expect(parseFloat(block.style.top)).toBeCloseTo(21.4286, 3);
    expect(parseFloat(block.style.height)).toBeCloseTo(7.1429, 3);
  });

  it('splits overlapping events into columns', () => {
    mount({
      items: [item('first', '2026-03-15', 600, 660), item('second', '2026-03-15', 630, 690)],
    });
    const first = screen.getByText('first').closest('button') as HTMLElement;
    const second = screen.getByText('second').closest('button') as HTMLElement;
    expect(first.style.width).toBe('calc(50% - 4px)');
    expect(second.style.width).toBe('calc(50% - 4px)');
  });

  it('reports empty single days', () => {
    mount();
    expect(screen.getByText('Nothing scheduled')).toBeTruthy();
  });

  it('quantizes empty-lane clicks to slot boundaries', () => {
    const onSlotClick = vi.fn();
    const { container } = mount({ onSlotClick });
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      height: 400,
      bottom: 400,
      left: 0,
      right: 100,
      width: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
    const lane = container.querySelector('.udb-cal-lane') as HTMLElement;
    fireEvent.click(lane, { clientY: 100 });
    expect(onSlotClick).toHaveBeenCalledWith('2026-03-15', 630);
  });

  it('reports item selection from an event block', () => {
    const onSelectItem = vi.fn();
    mount({ items: [item('Consult', '2026-03-15', 600, 660)], onSelectItem });
    fireEvent.click(screen.getByText('Consult'));
    expect(onSelectItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'Consult' }),
    );
  });
});
