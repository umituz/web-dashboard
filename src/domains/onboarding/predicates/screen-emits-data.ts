import type { OnboardingScreen } from '../types/screens';

/**
 * Does this screen type emit a payload to the orchestrator when the user advances?
 * Pure view-only screens (welcome, social-proof, comparison, value-delivery) do not.
 */
const VIEW_ONLY_SCREEN_TYPES: ReadonlySet<OnboardingScreen['type']> = new Set([
  'welcome',
  'social-proof',
  'comparison',
  'value-delivery',
  'personalized-solution',
]);

export function screenEmitsData(screen: OnboardingScreen): boolean {
  return !VIEW_ONLY_SCREEN_TYPES.has(screen.type);
}
