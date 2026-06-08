/**
 * Onboarding Types
 *
 * Type definitions for onboarding system
 */

import type { LucideIcon } from "lucide-react";
import type { ComponentType, ReactElement } from "react";

/**
 * Onboarding error — the message is an i18n key.
 */
export interface OnboardingError {
  /** Step where the error occurred */
  step: number;
  /** i18n key for the localized error message */
  message: string;
}

/**
 * User type option for first step.
 * Either supply `label`/`description` directly (already translated) or
 * supply `labelKey`/`descriptionKey` to be resolved by the consumer's i18n.
 */
export interface UserTypeOption {
  /** Unique identifier */
  id: string;
  /** Display label (already-translated string) */
  label?: string;
  /** Description text (already-translated) */
  description?: string;
  /** i18n key for the label */
  labelKey?: string;
  /** i18n key for the description */
  descriptionKey?: string;
  /** Icon component (Lucide) */
  icon?: LucideIcon;
  /** Badge text */
  badge?: string;
}

/**
 * Platform connection option.
 * Icons must be Lucide components — emoji is not allowed.
 */
export interface PlatformOption {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Tailwind color class (e.g. "from-purple-500 to-pink-500") */
  color?: string;
  /** Connection status */
  connected?: boolean;
}

/**
 * App type option for the AppFocusStep.
 * Same shape as PlatformOption (icon as component, not emoji).
 */
export interface AppTypeOption {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

/**
 * Plan option for billing step
 */
export interface PlanOption {
  /** Unique identifier */
  id: string;
  /** Plan name (already translated) */
  name: string;
  /** Badge text (already translated) — preferred for static labels */
  badge?: string;
  /** i18n key for the badge — resolved via `translate` in the consumer */
  badgeKey?: string;
  /** Badge color class */
  badgeColor?: string;
  /** Description text */
  description: string;
  /** Monthly price */
  price: number;
  /** Features list */
  features: (string | { text: string; bold?: boolean })[];
  /** Highlight style */
  highlight?: boolean;
}

/**
 * Props for onboarding step components
 */
export interface OnboardingStepContentProps {
  /** Current onboarding state */
  state: OnboardingState;
  /** Update state function */
  updateState: (updates: Partial<OnboardingState>) => void;
  /** Go to next step */
  goToNext: () => void;
  /** Go to previous step */
  goToPrev: () => void;
  /** Go to specific step */
  goToStep: (step: number) => void;
  /** Onboarding configuration */
  config: OnboardingConfig;
}

/**
 * Onboarding step configuration
 */
export interface OnboardingStep {
  /** Step identifier */
  id: string;
  /** Step number */
  order: number;
  /** Step title */
  title: string;
  /** Step description */
  description?: string;
  /** Custom component - either a function component with props or a direct React node */
  component?: ComponentType<OnboardingStepContentProps> | ReactElement;
  /** Whether this step can be skipped */
  skippable?: boolean;
  /** Validation function */
  validate?: (data: OnboardingState) => boolean;
}

/**
 * Onboarding configuration
 */
export interface OnboardingConfig {
  /** Brand/application name */
  brandName: string;
  /** Brand tagline */
  brandTagline?: string;
  /** Onboarding steps */
  steps: OnboardingStep[];
  /** Route to navigate after completion */
  completeRoute: string;
  /** Route to navigate on cancel */
  cancelRoute?: string;
  /** Allow skipping steps */
  allowSkip?: boolean;
  /** Allow canceling the wizard from the header */
  allowCancel?: boolean;
  /** Show progress indicator */
  showProgress?: boolean;
  /** Enable user menu in header */
  showUserMenu?: boolean;
}

/**
 * Onboarding state
 */
export interface OnboardingState extends Record<string, unknown> {
  /** Current step number */
  currentStep: number;
  /** Selected user type */
  selectedUserType?: string;
  /** Has mobile app */
  hasMobileApp?: boolean;
  /** Has web app */
  hasWebApp?: boolean;
  /** Connected platform IDs */
  connectedPlatforms: string[];
  /** Selected plan ID */
  selectedPlan?: string;
  /** Billing cycle */
  billingCycle: "monthly" | "yearly";
  /** Additional step data */
  stepData: Record<string, unknown>;
}

/**
 * Onboarding actions
 */
export interface OnboardingActions {
  /** Go to next step */
  goToNext: () => void;
  /** Go to previous step */
  goToPrev: () => void;
  /** Go to specific step */
  goToStep: (step: number) => void;
  /** Update state */
  updateState: (updates: Partial<OnboardingState>) => void;
  /** Complete onboarding */
  complete: () => Promise<void>;
  /** Cancel onboarding */
  cancel: () => void;
}

/**
 * Onboarding wizard props
 */
export interface OnboardingWizardProps {
  /** Onboarding configuration */
  config: OnboardingConfig;
  /** Initial state */
  initialState?: Partial<OnboardingState>;
  /** Completion callback */
  onComplete?: (data: OnboardingState) => Promise<void>;
  /** Cancel callback */
  onCancel?: () => void;
}

/**
 * Step progress props
 */
export interface StepProgressProps {
  /** Current step number */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Completed steps */
  completedSteps?: number[];
}

/**
 * Step navigation props
 */
export interface StepNavigationProps {
  /** Current step number */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Can proceed to next step */
  canGoNext: boolean;
  /** Is saving/completing */
  isSaving?: boolean;
  /** Next button label (overrides the i18n key) */
  nextLabel?: string;
  /** Previous button label (overrides the i18n key) */
  prevLabel?: string;
  /** On next */
  onNext: () => void;
  /** On previous */
  onPrev: () => void;
  /** Allow skipping */
  allowSkip?: boolean;
  /** On skip */
  onSkip?: () => void;
  /** Translation function */
  translate: (key: string) => string;
}
