import type { OnboardingScreen } from '../types/screens';
import { checkScreenConfig } from './screen-config-check';

export type ValidationOutcome = { ok: true } | { ok: false; reason: string };

const MIN_FLOW_LENGTH = 1;

export function checkFlowStructure(screens: ReadonlyArray<OnboardingScreen>): ValidationOutcome {
  if (!Array.isArray(screens) || screens.length < MIN_FLOW_LENGTH) {
    return { ok: false, reason: 'flow must contain at least one screen' };
  }
  const seen = new Set<string>();
  for (const screen of screens) {
    const result = checkScreenConfig(screen);
    if (!result.ok) return result;
    if (seen.has(screen.id)) {
      return { ok: false, reason: `duplicate step id: "${screen.id}"` };
    }
    seen.add(screen.id);
  }
  return { ok: true };
}
