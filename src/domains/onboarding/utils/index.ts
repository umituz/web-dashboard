export { trackOnboardingEvent, dispatchAnalyticsEvent } from './analytics-dispatch';
export {
  saveOnboardingProgress,
  loadOnboardingProgress,
  clearOnboardingProgress,
  buildOnboardingResult,
} from './local-storage-bridge';
export type { RehydratedProgress } from './local-storage-bridge';
export { queryPermissionStatus, requestPermission } from './permission-bridge';
export { defaultStorageKey } from './default-storage-key';

// Re-export validation for convenience (the public API treats validation as a util).
export { checkFlowStructure, checkScreenConfig, checkStoredProgress } from '../validation';
