/**
 * Onboarding - Step Progress Indicator
 *
 * Renders the wizard's progress as a row of numbered nodes connected
 * by lines. Stateless: receives all data via props.
 */

import { Check } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";

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
      className="flex items-center gap-0 flex-1 justify-center"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-valuenow={currentStep}
    >
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
        const isCompleted = completedSteps.includes(step) || step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                isCompleted || isCurrent
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
              aria-current={isCurrent ? "step" : undefined}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                step
              )}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  "w-12 h-0.5 mx-1",
                  step < currentStep ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
