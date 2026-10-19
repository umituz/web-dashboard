import { describe, it, expect } from 'vitest';
import { checkFlowStructure } from './flow-structure-check';
import { checkScreenConfig, getRecognizedScreenTypes } from './screen-config-check';
import { checkStoredProgress } from './stored-progress-check';
import {
  isRecognizedPermissionStatus,
  normalizePermissionStatus,
} from './permission-status-check';
import type { OnboardingScreen } from '../types/screens';

const welcome = (id = 'a'): OnboardingScreen => ({
  id,
  type: 'welcome',
  title: 'T',
});

describe('flow-structure-check (§23.1)', () => {
  it('rejects empty flows', () => {
    expect(checkFlowStructure([])).toEqual({
      ok: false,
      reason: 'flow must contain at least one screen',
    });
  });

  it('rejects duplicate step ids', () => {
    const outcome = checkFlowStructure([welcome('dup'), welcome('dup')]);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) expect(outcome.reason).toMatch(/duplicate step id/);
  });

  it('accepts a valid flow and propagates per-screen failures', () => {
    expect(checkFlowStructure([welcome('a'), welcome('b')])).toEqual({ ok: true });
        const bad = checkFlowStructure([
      welcome('a'),
      { id: 'g', type: 'goal-question', question: 'Q', options: [], onChange: () => undefined },
    ]);
    expect(bad.ok).toBe(false);
  });
});

describe('screen-config-check (§23.2)', () => {
  it('rejects malformed screens', () => {
    // @ts-expect-error -- deliberately malformed input (null is not a screen)
    expect(checkScreenConfig(null).ok).toBe(false);
    // @ts-expect-error -- deliberately malformed input (missing id)
    expect(checkScreenConfig({ type: 'welcome' }).ok).toBe(false);
    expect(checkScreenConfig({ id: '', type: 'welcome' } as OnboardingScreen).ok).toBe(false);
    expect(
      checkScreenConfig({ id: 'x', type: 'unknown' } as unknown as OnboardingScreen).ok,
    ).toBe(false);
    expect(
      checkScreenConfig({ id: 'x', type: 'goal-question' } as OnboardingScreen).ok,
    ).toBe(false);
  });

  it('requires content for content-driven screens', () => {
    expect(
      checkScreenConfig({
        id: 'p',
        type: 'pain-points',
        painPoints: [],
      } as unknown as OnboardingScreen).ok,
    ).toBe(false);
    expect(
      checkScreenConfig({
        id: 't',
        type: 'tinder-cards',
        statements: [],
      } as unknown as OnboardingScreen).ok,
    ).toBe(false);
    expect(
      checkScreenConfig({ id: 'pp', type: 'permission-priming' } as unknown as OnboardingScreen)
        .ok,
    ).toBe(false);
    expect(
      checkScreenConfig({ id: 'w', type: 'paywall', price: 9 } as unknown as OnboardingScreen).ok,
    ).toBe(false);
  });

  it('accepts a well-formed screen', () => {
    expect(checkScreenConfig(welcome('ok'))).toEqual({ ok: true });
  });

  it('knows every screen type the orchestrator can render', () => {
    expect(getRecognizedScreenTypes().size).toBe(14);
  });
});

describe('stored-progress-check (§23.3)', () => {
  const validPayload = JSON.stringify({
    version: 1,
    currentStep: 2,
    completedSteps: ['a', 'b'],
    collected: { a: { selected: ['x'] } },
    startedAt: '2026-01-01T10:00:00.000Z',
    lastUpdated: '2026-01-01T10:01:00.000Z',
  });

  it('returns not-ok for missing, corrupt, or future-version payloads', () => {
    expect(checkStoredProgress(null)).toEqual({ ok: false, reason: 'no stored progress' });
    expect(checkStoredProgress('{ malformed').ok).toBe(false);
    const v2 = checkStoredProgress(JSON.stringify({ version: 2 }));
    expect(v2.ok).toBe(false);
    if (!v2.ok) expect(v2.reason).toMatch(/unsupported storage version/);
  });

  it('rejects shape violations inside an otherwise-valid envelope', () => {
    expect(
      checkStoredProgress(
        JSON.stringify({
          version: 1,
          currentStep: -1,
          completedSteps: [],
          collected: {},
          startedAt: '2026-01-01T10:00:00.000Z',
          lastUpdated: '2026-01-01T10:00:00.000Z',
        }),
      ).ok,
    ).toBe(false);
    expect(
      checkStoredProgress(
        JSON.stringify({
          version: 1,
          currentStep: 0,
          completedSteps: 'nope',
          collected: {},
          startedAt: '2026-01-01T10:00:00.000Z',
          lastUpdated: '2026-01-01T10:00:00.000Z',
        }),
      ).ok,
    ).toBe(false);
    expect(
      checkStoredProgress(
        JSON.stringify({
          version: 1,
          currentStep: 0,
          completedSteps: [],
          collected: {},
          startedAt: 'not a date',
          lastUpdated: '2026-01-01T10:00:00.000Z',
        }),
      ).ok,
    ).toBe(false);
  });

  it('accepts a valid v1 payload and returns it typed', () => {
    const outcome = checkStoredProgress(validPayload);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.data.currentStep).toBe(2);
      expect(outcome.data.completedSteps).toEqual(['a', 'b']);
    }
  });
});

describe('permission-status-check (§23.4)', () => {
  it('normalizes browser-level permission strings', () => {
    expect(normalizePermissionStatus('granted')).toBe('granted');
    expect(normalizePermissionStatus('denied')).toBe('denied');
    expect(normalizePermissionStatus('default')).toBe('prompt');
    expect(normalizePermissionStatus(null)).toBe('unsupported');
    expect(normalizePermissionStatus('whatever')).toBe('unsupported');
  });

  it('recognizes exactly the four internal statuses', () => {
    expect(isRecognizedPermissionStatus('prompt')).toBe(true);
    expect(isRecognizedPermissionStatus('revoked')).toBe(false);
    expect(isRecognizedPermissionStatus(42)).toBe(false);
  });
});
