import { Button } from '@umituz/web-design-system/atoms';
import { cn } from '@umituz/web-design-system/utils';
import { Stepper } from './Stepper';
import type { WizardProps } from '../types';

export function Wizard({
  title,
  description,
  steps,
  currentStep,
  onStepChange,
  onFinish,
  onCancel,
  orientation = 'horizontal',
  isNextDisabled = false,
  isSubmitting = false,
  nextLabel = 'Next',
  backLabel = 'Back',
  finishLabel = 'Finish',
  children,
  className,
}: WizardProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  function handleBack() {
    if (!isFirst) {
      onStepChange(currentStep - 1);
    }
  }

  function handleNext() {
    if (isLast) {
      onFinish?.();
    } else {
      onStepChange(currentStep + 1);
    }
  }

  return (
    <div className={cn('udb-wizard', className)}>
      {(title || description) && (
        <header className="flex flex-col gap-1">
          {title && <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </header>
      )}

      <Stepper
        steps={steps}
        currentStep={currentStep}
        orientation={orientation}
        clickable={true}
        onStepClick={onStepChange}
      />

      <div className="udb-wizard__body">{children}</div>

      <footer className="udb-wizard__footer">
        <div>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isFirst && (
            <Button variant="secondary" onClick={handleBack} disabled={isSubmitting}>
              {backLabel}
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={isNextDisabled || isSubmitting}
          >
            {isSubmitting ? 'Saving…' : isLast ? finishLabel : nextLabel}
          </Button>
        </div>
      </footer>
    </div>
  );
}
