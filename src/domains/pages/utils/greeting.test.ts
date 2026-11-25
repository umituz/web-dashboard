import { describe, expect, it } from 'vitest';
import { formatUserGreeting, getTimeOfDayGreeting } from './greeting';

describe('greeting utils', () => {
  it('returns morning for hours before 12', () => {
    const d = new Date('2026-01-01T08:30:00');
    expect(getTimeOfDayGreeting(d)).toBe('morning');
  });

  it('returns afternoon for hours between 12 and 17', () => {
    const d = new Date('2026-01-01T14:15:00');
    expect(getTimeOfDayGreeting(d)).toBe('afternoon');
  });

  it('returns evening for hours 18 and later', () => {
    const d = new Date('2026-01-01T20:00:00');
    expect(getTimeOfDayGreeting(d)).toBe('evening');
  });

  it('formats user greeting with first name and time of day', () => {
    const d = new Date('2026-01-01T10:00:00');
    expect(formatUserGreeting('Ada Lovelace', d)).toBe('Good morning, Ada');
  });

  it('falls back to "there" when name is undefined or empty', () => {
    const d = new Date('2026-01-01T19:00:00');
    expect(formatUserGreeting(undefined, d)).toBe('Good evening, there');
    expect(formatUserGreeting('', d)).toBe('Good evening, there');
    expect(formatUserGreeting('   ', d)).toBe('Good evening, there');
  });
});
