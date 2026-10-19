export { OnboardingFlow } from './components/OnboardingFlow';
export type { OnboardingFlowProps } from './components/OnboardingFlow';

export {
  OnboardingIntlProvider,
  OnboardingIntlContext,
  useOnboardingIntl,
  defaultOnboardingLabels,
  formatLabel,
} from './components/OnboardingIntl';
export type { OnboardingIntl, OnboardingIntlProviderProps } from './components/OnboardingIntl';

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

export { ProgressBar } from './components/ProgressBar';
export type { ProgressBarProps } from './components/ProgressBar';
export { QuestionWrapper } from './components/QuestionWrapper';
export type { QuestionWrapperProps } from './components/QuestionWrapper';
export { SwipeCard } from './components/SwipeCard';
export type { SwipeCardProps } from './components/SwipeCard';
export { AnimationWrapper } from './components/AnimationWrapper';
export type { AnimationWrapperProps, ScreenTransition } from './components/AnimationWrapper';
export { ScreenContainer } from './components/ScreenContainer';
export type { ScreenContainerProps } from './components/ScreenContainer';
export { PrimaryButton } from './components/PrimaryButton';
export type { PrimaryButtonProps } from './components/PrimaryButton';
export { OnboardingErrorBoundary } from './components/OnboardingErrorBoundary';
export type { OnboardingErrorBoundaryProps } from './components/OnboardingErrorBoundary';

export {
  useOnboardingProgress,
  usePermissionPriming,
  useOnboardingAnalytics,
  useReducedMotion,
} from './hooks';
export type {
  UseOnboardingProgressReturn,
  UsePermissionPrimingReturn,
  UseOnboardingAnalyticsReturn,
} from './hooks';

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

export {
  checkFlowStructure,
  checkScreenConfig,
  checkStoredProgress,
  getRecognizedScreenTypes,
  isRecognizedPermissionStatus,
  normalizePermissionStatus,
} from './validation';
export type { ValidationOutcome, StoredProgressShape, StoredProgressOutcome } from './validation';

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
