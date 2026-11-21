import type { ReactNode } from 'react';

export interface StepItem {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly icon?: ReactNode;
  readonly optional?: boolean;
  readonly disabled?: boolean;
}

export interface StepperProps {
  readonly steps: readonly StepItem[] | readonly string[];
  readonly currentStep: number;
  readonly failStep?: number;
  readonly orientation?: 'horizontal' | 'vertical';
  readonly clickable?: boolean;
  readonly onStepClick?: (stepIndex: number) => void;
  readonly className?: string;
}

export interface WizardProps {
  readonly title?: ReactNode;
  readonly description?: ReactNode;
  readonly steps: readonly StepItem[] | readonly string[];
  readonly currentStep: number;
  readonly onStepChange: (nextStep: number) => void;
  readonly onFinish?: () => void;
  readonly onCancel?: () => void;
  readonly orientation?: 'horizontal' | 'vertical';
  readonly isNextDisabled?: boolean;
  readonly isSubmitting?: boolean;
  readonly nextLabel?: string;
  readonly backLabel?: string;
  readonly finishLabel?: string;
  readonly children: ReactNode;
  readonly className?: string;
}
