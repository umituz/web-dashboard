/**
 * Onboarding Types
 *
 * Type definitions for onboarding system
 */

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * User type option for first step
 */
export interface UserTypeOption {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Description text */
  description: string;
  /** Icon component */
  icon?: LucideIcon;
  /** Badge text */
  badge?: string;
}

/**
 * Platform connection option
 */
export interface PlatformOption {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Icon/emoji */
  icon: string;
  /** Color theme */
  color?: string;
  /** Connection status */
  connected?: boolean;
}

/**
 * Plan option for billing step
 */
export interface PlanOption {
  /** Unique identifier */
  id: string;
  /** Plan name */
  name: string;
  /** Badge text */
  badge?: string;
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
  /** Custom component */
  component?: ReactNode;
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
  /** Next button label */
  nextLabel?: string;
  /** Previous button label */
  prevLabel?: string;
  /** On next */
  onNext: () => void;
  /** On previous */
  onPrev: () => void;
  /** Allow skipping */
  allowSkip?: boolean;
  /** On skip */
  onSkip?: () => void;
}
