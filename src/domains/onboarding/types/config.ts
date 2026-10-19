import type { ReactNode } from 'react';
import type { DemoConfig, OnboardingScreen, PaywallScreenConfig } from './screens';
import type { OnboardingLabels } from './labels';

export type { OnboardingLabels } from './labels';

export type OnboardingCategory =
  | 'health'
  | 'art'
  | 'video'
  | 'security'
  | 'education'
  | 'platform'
  | 'lifestyle';

export type AnalyticsProvider = 'google-analytics' | 'amplitude' | 'mixpanel' | 'custom';

export interface AnalyticsConfig {
  trackEvents: boolean;
  provider?: AnalyticsProvider;
  /** Custom event sink used when provider === 'custom'. */
  customTracker?: (event: OnboardingAnalyticsEvent) => void;
}

export type OnboardingAnalyticsEvent =
  | { name: 'onboarding_started'; category: OnboardingCategory; timestamp: number }
  | { name: 'onboarding_step_completed'; stepId: string; stepType: string; index: number; timestamp: number }
  | { name: 'onboarding_step_skipped'; stepId: string; index: number; timestamp: number }
  | { name: 'onboarding_completed'; durationMs: number; timestamp: number }
  | { name: 'onboarding_abandoned'; lastStepId: string; durationMs: number; timestamp: number }
  | { name: 'paywall_viewed'; stepId: string; timestamp: number }
  | { name: 'paywall_accepted'; stepId: string; price: string; timestamp: number }
  | { name: 'paywall_declined'; stepId: string; timestamp: number }
  | { name: 'permission_requested'; permission: string; stepId: string; timestamp: number }
  | { name: 'permission_granted'; permission: string; stepId: string; timestamp: number }
  | { name: 'permission_denied'; permission: string; stepId: string; timestamp: number };

export interface OnboardingConfig {
  category: OnboardingCategory;
  screens: ReadonlyArray<OnboardingScreen>;
  demo?: DemoConfig;
  paywall?: PaywallScreenConfig;
  analytics?: AnalyticsConfig;
  /**
   * Override any user-facing string the library renders. English defaults
   * apply to keys you omit. See `OnboardingLabels`.
   */
  labels?: Partial<OnboardingLabels>;
  /** BCP-47 locale used for locale-aware formatting (e.g. "250.000" vs "250,000"). */
  locale?: string;
  /** Custom slot rendered above the flow (e.g. brand banner). */
  headerSlot?: ReactNode;
  /** Custom slot rendered below the flow. */
  footerSlot?: ReactNode;
  onComplete?: (data: OnboardingResult) => void;
  onSkip?: () => void;
  /** Persistence key — defaults to '@umituz/web-onboarding:progress'. */
  storageKey?: string;
}

/** Collected data exposed to onComplete. Typed in place of `Record<string, any>`. */
export interface OnboardingResult {
  completedSteps: ReadonlyArray<string>;
  /** Per-screen data captured during the run. */
  collected: Record<string, unknown>;
  durationMs: number;
  finishedAt: Date;
}
