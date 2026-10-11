/**
 * Onboarding - Step Progress Indicator
 *
 * Renders the wizard's progress as a row of numbered nodes connected
 * by lines. Stateless: receives all data via props.
 */

import { Check } from "lucide-react";
import { cn } from "../../../primitives";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps?: number[];
}

export const StepProgress = ({
  currentStep,
  totalSteps,
  completedSteps = [],
}: StepProgressProps) => {
  return (
    <div
      className="udb-progress"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-valuenow={currentStep}
    >
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
        const isCompleted = completedSteps.includes(step) || step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="udb-progress__segment">
            <div
              className={cn(
                "udb-progress__node",
                (isCompleted || isCurrent) && "udb-progress__node--on",
              )}
              aria-current={isCurrent ? "step" : undefined}
            >
              {isCompleted ? (
                <Check className="udb-progress__check" aria-hidden="true" />
              ) : (
                step
              )}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  "udb-progress__connector",
                  step < currentStep && "udb-progress__connector--on",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
