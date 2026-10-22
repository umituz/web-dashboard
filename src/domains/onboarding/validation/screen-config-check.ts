import type {
  OnboardingScreen,
  OnboardingScreenType,
} from '../types/screens';
import type { ValidationOutcome } from './flow-structure-check';

const RECOGNIZED_SCREEN_TYPES: ReadonlySet<OnboardingScreenType> = new Set<OnboardingScreenType>([
  'welcome',
  'goal-question',
  'organization-details',
  'pain-points',
  'social-proof',
  'tinder-cards',
  'personalized-solution',
  'comparison',
  'preferences',
  'permission-priming',
  'processing',
  'app-demo',
  'value-delivery',
  'account-gate',
  'paywall',
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function checkGoalQuestion(screen: OnboardingScreen): ValidationOutcome {
  const options = (screen as { options?: unknown }).options;
  if (!Array.isArray(options) || options.length === 0) {
    return { ok: false, reason: 'goal-question screen requires non-empty options' };
  }
  return { ok: true };
}

function checkPainPoints(screen: OnboardingScreen): ValidationOutcome {
  const points = (screen as { painPoints?: unknown }).painPoints;
  if (!Array.isArray(points) || points.length === 0) {
    return { ok: false, reason: 'pain-points screen requires non-empty painPoints' };
  }
  return { ok: true };
}

function checkTinderCards(screen: OnboardingScreen): ValidationOutcome {
  const statements = (screen as { statements?: unknown }).statements;
  if (!Array.isArray(statements) || statements.length === 0) {
    return { ok: false, reason: 'tinder-cards screen requires non-empty statements' };
  }
  return { ok: true };
}

function checkPermissionPriming(screen: OnboardingScreen): ValidationOutcome {
  const permission = (screen as { permission?: unknown }).permission;
  if (typeof permission !== 'string') {
    return { ok: false, reason: 'permission-priming screen requires a permission identifier' };
  }
  return { ok: true };
}

function checkPaywall(screen: OnboardingScreen): ValidationOutcome {
  const price = (screen as { price?: unknown }).price;
  const trialDays = (screen as { trialDays?: unknown }).trialDays;
  if (typeof price !== 'string' || typeof trialDays !== 'number') {
    return { ok: false, reason: 'paywall screen requires price and trialDays' };
  }
  return { ok: true };
}

export function checkScreenConfig(screen: OnboardingScreen): ValidationOutcome {
  if (!isPlainObject(screen)) {
    return { ok: false, reason: 'screen must be an object' };
  }
  const id = (screen as { id?: unknown }).id;
  if (typeof id !== 'string' || id.length === 0) {
    return { ok: false, reason: 'screen.id must be a non-empty string' };
  }
  const type = (screen as { type?: unknown }).type;
  if (typeof type !== 'string' || !RECOGNIZED_SCREEN_TYPES.has(type as OnboardingScreenType)) {
    return { ok: false, reason: `screen.type "${String(type)}" is not a recognized screen type` };
  }

  switch (type) {
    case 'goal-question':
      return checkGoalQuestion(screen);
    case 'pain-points':
      return checkPainPoints(screen);
    case 'tinder-cards':
      return checkTinderCards(screen);
    case 'permission-priming':
      return checkPermissionPriming(screen);
    case 'paywall':
      return checkPaywall(screen);
    default:
      return { ok: true };
  }
}

export function getRecognizedScreenTypes(): ReadonlySet<OnboardingScreenType> {
  return RECOGNIZED_SCREEN_TYPES;
}
