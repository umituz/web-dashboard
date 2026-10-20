import { describe, expect, it } from 'vitest';
import { searchItems } from './searchItems';

interface Course {
  id: string;
  name: string;
  blurb: string;
  level: string;
}

const COURSES: Course[] = [
  { id: 'c1', name: 'Present perfect workshop', blurb: 'Have you ever…', level: 'B1' },
  { id: 'c2', name: 'IELTS reading sprint', blurb: 'Skimming strategies', level: 'C1' },
  { id: 'c3', name: 'Everyday vocabulary', blurb: 'Present simple review', level: 'A1' },
];

const toHit = (c: Course) => ({ id: c.id, title: c.name, subtitle: c.blurb, category: c.level, to: `/courses/${c.id}` });

describe('searchItems', () => {
  it('returns nothing for empty or blank queries', () => {
    expect(searchItems(COURSES, '', toHit)).toEqual([]);
    expect(searchItems(COURSES, '   ', toHit)).toEqual([]);
  });

  it('matches titles case-insensitively and returns route hits', () => {
    const hits = searchItems(COURSES, 'ielts', toHit);
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({ id: 'c2', title: 'IELTS reading sprint', to: '/courses/c2' });
  });

  it('ranks title matches above body-only matches', () => {
    // "present" is in c1's title and c3's blurb — title wins.
    const hits = searchItems(COURSES, 'present', toHit);
    expect(hits[0]?.id).toBe('c1');
    expect(hits).toHaveLength(2);
  });

  it('scores multi-term queries across fields', () => {
    const hits = searchItems(COURSES, 'reading strategies', toHit);
    expect(hits[0]?.id).toBe('c2');
  });
});
