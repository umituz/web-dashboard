import * as Progress from '@radix-ui/react-progress';
import { motion } from 'framer-motion';
import { cn } from '../../theme/cn';
import { computeProgressPercentage } from '../../calc/progress-percentage';
import { formatLabel, useOnboardingIntl } from '../OnboardingIntl';

export interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  showLabel?: boolean;
}

/**
 * Accessible progress bar built on Radix UI primitive.
 * Progress math lives in `calc/progress-percentage`.
 */
export function ProgressBar({ current, total, className, showLabel = false }: ProgressBarProps) {
  const { labels } = useOnboardingIntl();
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.max(0, Math.min(current, safeTotal));
  const percentage = computeProgressPercentage(safeCurrent, safeTotal);

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm text-[rgb(var(--uob-text-muted))]">
          <span aria-live="polite">
            {formatLabel(labels.stepOfPattern, { current: safeCurrent, total: safeTotal })}
          </span>
          <span aria-hidden="true">{Math.round(percentage)}%</span>
        </div>
      )}
      <Progress.Root
        value={percentage}
        aria-label={`Onboarding progress: ${Math.round(percentage)} percent`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
        className="relative h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--uob-border))]"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-full rounded-full bg-[rgb(var(--uob-primary-500))]"
        />
      </Progress.Root>
    </div>
  );
}
