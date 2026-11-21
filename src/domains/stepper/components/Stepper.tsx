import { Check, X } from 'lucide-react';
import { cn } from '@umituz/web-design-system/utils';
import type { StepItem, StepperProps } from '../types';

function normalizeStep(step: StepItem | string, index: number): StepItem {
  if (typeof step === 'string') {
    return { id: `step-${index}`, label: step };
  }
  return step;
}

export function Stepper({
  steps,
  currentStep,
  failStep,
  orientation = 'horizontal',
  clickable = false,
  onStepClick,
  className,
}: StepperProps) {
  return (
    <div
      className={cn(
        'udb-stepper',
        `udb-stepper--${orientation}`,
        className,
      )}
      role="list"
      aria-label="Progress steps"
    >
      {steps.map((rawStep, i) => {
        const step = normalizeStep(rawStep, i);
        const state =
          failStep === i ? 'fail' : i < currentStep ? 'done' : i === currentStep ? 'current' : 'pending';
        const isClickable = clickable && !step.disabled && i <= currentStep;

        return (
          <div
            key={step.id}
            className={cn(
              'udb-step',
              `udb-step--${state}`,
              isClickable && 'udb-step--clickable',
            )}
            onClick={() => {
              if (isClickable && onStepClick) {
                onStepClick(i);
              }
            }}
            role="listitem"
            aria-current={state === 'current' ? 'step' : undefined}
          >
            {i > 0 && <span className="udb-step__connector" aria-hidden="true" />}
            <div className="udb-step__node" aria-hidden="true">
              {state === 'done' ? (
                <Check size={13} strokeWidth={2.5} />
              ) : state === 'fail' ? (
                <X size={13} strokeWidth={2.5} />
              ) : step.icon ? (
                step.icon
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <div className="udb-step__content">
              <span className="udb-step__label">{step.label}</span>
              {step.description && <span className="udb-step__desc">{step.description}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
