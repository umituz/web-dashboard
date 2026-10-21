import { describe, expect, it, vi } from 'vitest';
import { hitsToCommandItems } from './hitsToCommandItems';
import type { SearchHit } from './searchItems';

const HITS: SearchHit[] = [
  { id: 'c2', title: 'IELTS reading sprint', subtitle: 'Skimming strategies', category: 'C1', to: '/courses/c2' },
  { id: 'c1', title: 'Present perfect workshop', subtitle: 'Have you ever…', category: 'B1', to: '/courses/c1' },
];

describe('hitsToCommandItems', () => {
  it('maps hits to palette entries with title as label and category as hint', () => {
    const items = hitsToCommandItems(HITS, vi.fn());
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ id: 'c2', label: 'IELTS reading sprint', hint: 'C1' });
  });

  it('carries subtitle+category as keywords so body-only matches survive the palette filter', () => {
    const items = hitsToCommandItems(HITS, vi.fn());
    expect(items[0]?.keywords).toBe('Skimming strategies C1');
  });

  it('navigates to the hit route on select', () => {
    const navigate = vi.fn();
    const items = hitsToCommandItems(HITS, navigate);
    items[1]?.onSelect();
    expect(navigate).toHaveBeenCalledWith('/courses/c1');
  });

  it('omits the hint when the category is blank', () => {
    const hits: SearchHit[] = [{ id: 'x', title: 'Note', subtitle: 'Body', category: '', to: '/notes/x' }];
    const items = hitsToCommandItems(hits, vi.fn());
    expect(items[0]?.hint).toBeUndefined();
    expect(items[0]?.keywords).toBe('Body');
  });

  it('returns an empty array for empty hits', () => {
    expect(hitsToCommandItems([], vi.fn())).toEqual([]);
  });
});
