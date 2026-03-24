/**
 * Onboarding Utilities
 *
 * Utility functions for onboarding operations
 */

import type { OnboardingState, OnboardingConfig } from "../types/onboarding";

/**
 * Validate onboarding step
 *
 * @param state - Current onboarding state
 * @param stepNumber - Step number to validate
 * @param config - Onboarding configuration
 * @returns Whether the step is valid
 */
export function validateStep(
  state: OnboardingState,
  stepNumber: number,
  config: OnboardingConfig
): boolean {
  const stepConfig = config.steps[stepNumber - 1];

  if (stepConfig?.validate) {
    return stepConfig.validate(state);
  }

  // Default validations
  switch (stepNumber) {
    case 1:
      // User type step
      return !!state.selectedUserType;

    case 2:
      // App focus step
      return state.hasMobileApp || state.hasWebApp;

    case 3:
      // Platforms step
      return state.connectedPlatforms.length > 0;

    case 4:
      // Plan step
      return !!state.selectedPlan;

    default:
      return true;
  }
}

/**
 * Get step title
 *
 * @param stepNumber - Step number
 * @param config - Onboarding configuration
 * @returns Step title
 */
export function getStepTitle(stepNumber: number, config: OnboardingConfig): string {
  const stepConfig = config.steps[stepNumber - 1];
  return stepConfig?.title || `Step ${stepNumber}`;
}

/**
 * Get step description
 *
 * @param stepNumber - Step number
 * @param config - Onboarding configuration
 * @returns Step description or undefined
 */
export function getStepDescription(stepNumber: number, config: OnboardingConfig): string | undefined {
  const stepConfig = config.steps[stepNumber - 1];
  return stepConfig?.description;
}

/**
 * Calculate onboarding progress
 *
 * @param currentStep - Current step number
 * @param totalSteps - Total number of steps
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(currentStep: number, totalSteps: number): number {
  return Math.min((currentStep / totalSteps) * 100, 100);
}

/**
 * Get completed steps
 *
 * @param currentStep - Current step number
 * @returns Array of completed step numbers
 */
export function getCompletedSteps(currentStep: number): number[] {
  return Array.from({ length: currentStep - 1 }, (_, i) => i + 1);
}

/**
 * Format onboarding data for API submission
 *
 * @param state - Onboarding state
 * @param userId - User ID
 * @returns Formatted data object
 */
export function formatOnboardingData(state: OnboardingState, userId?: string) {
  return {
    userId,
    userType: state.selectedUserType,
    hasMobileApp: state.hasMobileApp,
    hasWebApp: state.hasWebApp,
    connectedPlatforms: state.connectedPlatforms,
    selectedPlan: state.selectedPlan,
    billingCycle: state.billingCycle,
    stepData: state.stepData,
    completedAt: new Date().toISOString(),
  };
}

/**
 * Generate onboarding analytics event
 *
 * @param event - Event name
 * @param state - Onboarding state
 * @param additionalData - Additional event data
 * @returns Analytics event object
 */
export function generateOnboardingEvent(
  event: string,
  state: OnboardingState,
  additionalData?: Record<string, unknown>
) {
  return {
    event,
    properties: {
      currentStep: state.currentStep,
      userType: state.selectedUserType,
      hasMobileApp: state.hasMobileApp,
      hasWebApp: state.hasWebApp,
      platformCount: state.connectedPlatforms.length,
      selectedPlan: state.selectedPlan,
      billingCycle: state.billingCycle,
      ...additionalData,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validate email format
 *
 * @param email - Email address
 * @returns Whether email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 *
 * @param password - Password
 * @param minLength - Minimum length (default: 8)
 * @returns Whether password meets requirements
 */
export function isValidPassword(password: string, minLength: number = 8): boolean {
  return password.length >= minLength;
}
