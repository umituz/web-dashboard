import { describe, expect, it } from 'vitest';
import {
  addDaysKey,
  addMonthsKey,
  eventGeometry,
  findConflicts,
  generateDaySlots,
  groupByDayKey,
  itemSpan,
  layoutColumns,
  minutesToLabel,
  monthMatrix,
  spansOverlap,
  startOfWeekKey,
  weekDays,
} from './layout';
import type { CalendarItem } from '../types/view.types';

const item = (id: string, dayKey: string, startMin?: number, endMin?: number): CalendarItem => ({
  id,
  dayKey,
  startMin,
  endMin,
  title: id,
});

describe('day keys', () => {
  it('builds monday-based weeks', () => {
    expect(weekDays('2026-03-10')).toEqual([
      '2026-03-09',
      '2026-03-10',
      '2026-03-11',
      '2026-03-12',
      '2026-03-13',
      '2026-03-14',
      '2026-03-15',
    ]);
  });

  it('honors sunday-based weeks', () => {
    expect(startOfWeekKey('2026-03-10', 0)).toBe('2026-03-08');
  });

  it('builds a six-row month matrix', () => {
    const matrix = monthMatrix('2026-03-10');
    expect(matrix).toHaveLength(42);
    expect(matrix[0]).toBe('2026-02-23');
    expect(matrix[41]).toBe('2026-04-05');
  });

  it('clamps month shifts to month ends', () => {
    expect(addMonthsKey('2026-03-31', -1)).toBe('2026-02-28');
    expect(addDaysKey('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('formats minute-of-day labels', () => {
    expect(minutesToLabel(630)).toBe('10:30');
    expect(minutesToLabel(25 * 60 + 15)).toBe('01:15');
  });
});

describe('spans', () => {
  it('treats touching edges as non-overlapping', () => {
    expect(spansOverlap({ startMin: 60, endMin: 120 }, { startMin: 120, endMin: 180 })).toBe(false);
    expect(spansOverlap({ startMin: 60, endMin: 121 }, { startMin: 120, endMin: 180 })).toBe(true);
  });

  it('defaults open spans to one hour', () => {
    expect(itemSpan(item('a', '2026-03-10', 600))).toEqual({ startMin: 600, endMin: 660 });
    expect(itemSpan(item('b', '2026-03-10'))).toEqual({ startMin: 0, endMin: 60 });
  });

  it('flags only items overlapping another', () => {
    const items = [
      item('a', '2026-03-10', 60, 120),
      item('b', '2026-03-10', 90, 150),
      item('c', '2026-03-10', 200, 260),
    ];
    expect(findConflicts(items).map((entry) => entry.id).sort()).toEqual(['a', 'b']);
  });
});

describe('layoutColumns', () => {
  it('gives overlapping events side-by-side columns', () => {
    const placed = layoutColumns([
      item('x', '2026-03-10', 60, 120),
      item('y', '2026-03-10', 90, 150),
    ]);
    const byId = new Map(placed.map((entry) => [entry.item.id, entry]));
    expect(byId.get('x')?.columns).toBe(2);
    expect(byId.get('y')?.columns).toBe(2);
    expect(new Set(placed.map((entry) => entry.column))).toEqual(new Set([0, 1]));
  });

  it('splits clusters when events only touch', () => {
    const placed = layoutColumns([
      item('x', '2026-03-10', 60, 120),
      item('z', '2026-03-10', 120, 180),
    ]);
    expect(placed.every((entry) => entry.columns === 1)).toBe(true);
  });
});

describe('eventGeometry', () => {
  it('positions events as percentages of the day range', () => {
    const geometry = eventGeometry(item('a', '2026-03-10', 600, 660), 420, 1260);
    expect(geometry.top).toBeCloseTo(21.43, 1);
    expect(geometry.height).toBeCloseTo(7.14, 1);
  });

  it('clamps events spilling outside the range', () => {
    const geometry = eventGeometry(item('a', '2026-03-10', 300, 1300), 420, 1260);
    expect(geometry.top).toBe(0);
    expect(geometry.height).toBe(100);
  });
});

describe('generateDaySlots', () => {
  it('marks slots intersecting booked spans as taken', () => {
    const slots = generateDaySlots(
      { startMin: 420, endMin: 720, durationMin: 60 },
      [{ startMin: 480, endMin: 540 }],
    );
    expect(slots.map((slot) => slot.startMin)).toEqual([420, 480, 540, 600, 660]);
    expect(slots.map((slot) => slot.taken)).toEqual([false, true, false, false, false]);
  });

  it('supports a step smaller than the duration', () => {
    const slots = generateDaySlots({ startMin: 420, endMin: 540, durationMin: 60, stepMin: 30 });
    expect(slots.map((slot) => slot.startMin)).toEqual([420, 450, 480]);
  });
});

describe('groupByDayKey', () => {
  it('buckets by day and sorts by start minute', () => {
    const grouped = groupByDayKey([
      item('late', '2026-03-10', 900, 960),
      item('early', '2026-03-10', 540, 600),
      item('other-day', '2026-03-11', 600, 660),
    ]);
    expect(grouped.get('2026-03-10')?.map((entry) => entry.id)).toEqual(['early', 'late']);
    expect(grouped.get('2026-03-11')?.map((entry) => entry.id)).toEqual(['other-day']);
  });
});
