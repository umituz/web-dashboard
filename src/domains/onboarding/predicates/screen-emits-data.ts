import type { OnboardingScreen } from '../types/screens';

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
