/**
 * @umituz/web-onboarding — Public API surface.
 * Designed for tree-shaking: only import what you use.
 */

import './theme/index.css';

// Orchestrator (the entry point)
export { OnboardingFlow } from './components/OnboardingFlow';
export type { OnboardingFlowProps } from './components/OnboardingFlow';

// Localization / labels (i18n hooks for consumers + class-component access
// to the same context the function components use)
export {
  OnboardingIntlProvider,
  OnboardingIntlContext,
  useOnboardingIntl,
  defaultOnboardingLabels,
  formatLabel,
} from './components/OnboardingIntl';
export type { OnboardingIntl, OnboardingIntlProviderProps } from './components/OnboardingIntl';

// Screens
export {
  WelcomeScreen,
  GoalQuestionScreen,
  PainPointsScreen,
  SocialProofScreen,
  TinderCardsScreen,
  PersonalizedSolutionScreen,
  ComparisonScreen,
  PreferencesScreen,
  PermissionPrimingScreen,
  ProcessingScreen,
  AppDemoScreen,
  ValueDeliveryScreen,
  AccountGateScreen,
  PaywallScreen,
} from './components/screens';

// Shared / atomic
export {
  ProgressBar,
  QuestionWrapper,
  OptionCard,
  SwipeCard,
  AnimationWrapper,
  ScreenContainer,
  PrimaryButton,
  OnboardingErrorBoundary,
} from './components/shared';
export type { ScreenTransition } from './components/shared';

// Hooks
export {
  useOnboardingProgress,
  usePermissionPriming,
  useOnboardingAnalytics,
  useReducedMotion,
} from './components/hooks';
export type {
  UseOnboardingProgressReturn,
  UsePermissionPrimingReturn,
  UseOnboardingAnalyticsReturn,
} from './components/hooks';

// Templates
export {
  healthOnboardingTemplate,
  artOnboardingTemplate,
  videoOnboardingTemplate,
  platformOnboardingTemplate,
  withDefaultDemo,
  defaultDemoResult,
  TemplateDemoFallback,
} from './templates';
export type { TemplateDemoResult } from './templates';

// Calculations (pure math)
export {
  computeProgressFraction,
  computeProgressPercentage,
  computeRemainingSteps,
  clampStepIndex,
  advanceStepIndex,
  retreatStepIndex,
  SWIPE_DECISION_THRESHOLD_PX,
  SWIPE_ROTATION_RANGE,
  SWIPE_ROTATION_VALUES,
  SWIPE_LEFT_OPACITY_INPUT,
  SWIPE_LEFT_OPACITY_VALUES,
  SWIPE_RIGHT_OPACITY_INPUT,
  SWIPE_RIGHT_OPACITY_VALUES,
  didCrossRightSwipeThreshold,
  didCrossLeftSwipeThreshold,
  getCardEnterInitial,
  getCardEnterAnimate,
  getCardEnterExit,
  getCardTransitionDurationMs,
  resolveSliderBounds,
  areSliderBoundsValid,
  clampValueToBounds,
  splitTotalDuration,
  getDefaultStepDurationMs,
  formatCountWithLocale,
  elapsedMillis,
} from './calc';
export type { CardMotionState } from './calc';

// Validation
export {
  checkFlowStructure,
  checkScreenConfig,
  checkStoredProgress,
  getRecognizedScreenTypes,
  isRecognizedPermissionStatus,
  normalizePermissionStatus,
} from './validation';
export type { ValidationOutcome, StoredProgressShape, StoredProgressOutcome } from './validation';

// Predicates
export {
  isPermissionGranted,
  isPermissionDenied,
  isPermissionPrompt,
  isPermissionUnsupported,
  isPermissionDecided,
  doesBrowserSupportNotifications,
  doesBrowserSupportMediaCapture,
  doesBrowserSupportGeolocation,
  isRuntimeSupportMissing,
  isLocalStorageAvailable,
  doesIconNameResolve,
  getRegisteredIconNames,
  resolveIconByName,
  hasOnRequest,
  hasOnAccept,
  hasOnSignIn,
  accountGateAllowsSkip,
  screenEmitsData,
} from './predicates';

// I/O utilities
export {
  trackOnboardingEvent,
  dispatchAnalyticsEvent,
  saveOnboardingProgress,
  loadOnboardingProgress,
  clearOnboardingProgress,
  buildOnboardingResult,
  queryPermissionStatus,
  requestPermission,
  defaultStorageKey,
} from './utils';
export type { RehydratedProgress } from './utils';

// Theme tokens (for consumers that want to rebrand)
export {
  spacing,
  radius,
  typography,
  zIndex,
  motion as motionTokens,
  breakpoint,
  colorCssVar,
  cn,
} from './theme';
export type { SpacingToken, RadiusToken, FontSizeToken } from './theme';

// Types
export type {
  OnboardingScreen,
  OnboardingScreenType,
  OnboardingOption,
  OnboardingConfig,
  OnboardingCategory,
  OnboardingLabels,
  AnalyticsConfig,
  AnalyticsProvider,
  OnboardingAnalyticsEvent,
  OnboardingResult,
} from './types';
