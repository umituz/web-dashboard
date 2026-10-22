import type { ReactNode } from 'react';

export interface BaseScreen<T extends string, D = unknown> {
  id: string;
  type: T;
  title?: string;
  subtitle?: string;
  cta?: string;
  onCta?: () => void;
  data?: D;
}

export interface OnboardingOption {
  id: string;
  label: string;
  description?: string;
  iconName?: string;   image?: string;
}

export type WelcomeScreenConfig = BaseScreen<'welcome'> & {
  heroIconName?: string;
  highlight?: string;
};

export type GoalQuestionScreenConfig = BaseScreen<'goal-question', string[]> & {
  question: string;
  options: OnboardingOption[];
  multiSelect?: boolean;
  onChange: (selectedIds: string[]) => void;
};

export type PainPointsScreenConfig = BaseScreen<'pain-points', string[]> & {
  title: string;
  painPoints: OnboardingOption[];
  multiSelect?: boolean;
  maxSelect?: number;
  onChange: (selectedIds: string[]) => void;
};

export type SocialProofScreenConfig = BaseScreen<'social-proof'> & {
  testimonials: ReadonlyArray<{
    name: string;
    role: string;
    content: string;
    avatar?: string;
    rating?: number;
  }>;
};

export type TinderCardsScreenConfig = BaseScreen<'tinder-cards', string[]> & {
  statements: ReadonlyArray<{
    id: string;
    text: string;
    category: string;
  }>;
  onChange: (likedIds: string[]) => void;
};

export type PersonalizedSolutionScreenConfig = BaseScreen<'personalized-solution'> & {
  solutions: ReadonlyArray<{
    painPointId: string;
    solution: string;
    statistic?: string;
  }>;
  selectedPainPointIds: ReadonlyArray<string>;
};

export type ComparisonScreenConfig = BaseScreen<'comparison'> & {
  before: ReadonlyArray<string>;
  after: ReadonlyArray<string>;
};

export type PreferenceItem = {
  id: string;
  label: string;
  type: 'select' | 'multi-select' | 'toggle' | 'slider';
  options?: OnboardingOption[];
  min?: number;
  max?: number;
  defaultValue?: string | number | string[] | boolean;
};

export type PreferencesScreenConfig = BaseScreen<
  'preferences',
  Record<string, string | number | string[] | boolean>
> & {
  title: string;
  preferences: ReadonlyArray<PreferenceItem>;
  onChange: (values: Record<string, string | number | string[] | boolean>) => void;
};

export type PermissionType = 'camera' | 'microphone' | 'location' | 'notifications' | 'photos' | 'contacts';

export type PermissionPrimingScreenConfig = BaseScreen<'permission-priming', PermissionStatus> & {
  permission: PermissionType;
  description: string;
  benefits: ReadonlyArray<string>;
  iconName?: string;
  onRequest: () => Promise<PermissionStatus>;
};

export type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unsupported';

export type ProcessingScreenConfig = BaseScreen<'processing'> & {
  title: string;
  steps: ReadonlyArray<string>;
  durationMs?: number;
  onComplete: () => void;
};

export type DemoConfig<TProps = Record<string, unknown>, TResult = unknown> = {
  component: React.ComponentType<TProps>;
  props?: TProps;
  onSave: (result: TResult) => void;
  durationMs?: number;
};

export type AppDemoScreenConfig = BaseScreen<'app-demo', unknown> & {
  demo: DemoConfig;
};

export type ValueDeliveryScreenConfig<TResult = unknown> = BaseScreen<
  'value-delivery',
  TResult
> & {
  title: string;
  result: TResult;
    shareConfig?: {
    text: string;
    url?: string;
  };
};

export type SignInMethod = 'email' | 'google' | 'apple' | 'github';

export interface OrganizationDetailsData {
  name: string;
  teamSize?: string;
}

export type OrganizationDetailsScreenConfig = BaseScreen<'organization-details', OrganizationDetailsData> & {
  namePlaceholder?: string;
  /** Omit to skip the team-size question; otherwise ids map to host labels. */
  teamSizeOptions?: ReadonlyArray<OnboardingOption>;
};

export type AccountGateScreenConfig = BaseScreen<'account-gate', { signedIn: boolean; method?: SignInMethod }> & {
  optional: boolean;
  signInMethod?: SignInMethod;
  skipText?: string;
  onSignIn: (method: SignInMethod) => Promise<{ signedIn: boolean; method?: SignInMethod }>;
};

export type PaywallFeature = {
  iconName: string;   text: string;
  highlighted?: boolean;
};

export type PaywallScreenConfig = BaseScreen<
  'paywall',
  { accepted: boolean; trialStarted: boolean }
> & {
  subtitle: string;
  price: string;
  trialDays: number;
  trialPrice?: string;
  features: ReadonlyArray<PaywallFeature>;
  socialProof?: {
    text: string;
    count: number;
  };
  cta: string;
  secondaryCta?: string;
  onSecondaryCta?: () => void;
  onAccept: () => Promise<{ accepted: boolean; trialStarted: boolean }>;
};

export type OnboardingScreen =
  | WelcomeScreenConfig
  | GoalQuestionScreenConfig
  | OrganizationDetailsScreenConfig
  | PainPointsScreenConfig
  | SocialProofScreenConfig
  | TinderCardsScreenConfig
  | PersonalizedSolutionScreenConfig
  | ComparisonScreenConfig
  | PreferencesScreenConfig
  | PermissionPrimingScreenConfig
  | ProcessingScreenConfig
  | AppDemoScreenConfig
  | ValueDeliveryScreenConfig
  | AccountGateScreenConfig
  | PaywallScreenConfig;

export type OnboardingScreenType = OnboardingScreen['type'];

export type { ReactNode };
