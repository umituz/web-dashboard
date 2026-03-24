/**
 * @umituz/web-dashboard - Onboarding Domain
 *
 * Config-driven Onboarding System
 */

export { OnboardingWizard } from './components';
export { UserTypeStep } from './components';
export { AppFocusStep } from './components';
export { PlatformsStep } from './components';
export { PlanStep } from './components';
export { useOnboarding, useOnboardingStep } from './hooks';
export {
  validateStep,
  getStepTitle,
  getStepDescription,
  calculateProgress,
  getCompletedSteps,
  formatOnboardingData,
  generateOnboardingEvent,
  isValidEmail,
  isValidPassword,
} from './utils';
export type {
  UserTypeOption,
  PlatformOption,
  PlanOption,
  OnboardingStep,
  OnboardingConfig,
  OnboardingState,
  OnboardingActions,
  OnboardingWizardProps,
  StepProgressProps,
  StepNavigationProps,
} from './types';
