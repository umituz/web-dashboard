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
    labels: OnboardingLabels;
    locale?: string;
    headerSlot?: ReactNode;
    footerSlot?: ReactNode;
  onComplete?: (data: OnboardingResult) => void;
  onSkip?: () => void;
    storageKey?: string;
}

export interface OnboardingResult {
  completedSteps: ReadonlyArray<string>;
    collected: Record<string, unknown>;
  durationMs: number;
  finishedAt: Date;
}
