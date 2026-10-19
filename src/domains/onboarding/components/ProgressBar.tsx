import { Progress } from '@umituz/web-design-system/atoms';
import { cn } from '@umituz/web-design-system/utils/cn';
import { computeProgressPercentage } from '../calc/progress-percentage';
import { formatLabel, useOnboardingIntl } from './OnboardingIntl';

export interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ current, total, className, showLabel = false }: ProgressBarProps) {
  const { labels } = useOnboardingIntl();
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.max(0, Math.min(current, safeTotal));
  const percentage = Math.round(computeProgressPercentage(safeCurrent, safeTotal));

  return (
    <div className={cn('udb-onb-progress', className)}>
      {showLabel && (
        <div className="udb-onb-progress__meta">
          <span aria-live="polite">
            {formatLabel(labels.stepOfPattern, { current: safeCurrent, total: safeTotal })}
          </span>
          <span aria-hidden="true">{percentage}%</span>
        </div>
      )}
      <Progress value={percentage} label="Onboarding progress" />
    </div>
  );
}
