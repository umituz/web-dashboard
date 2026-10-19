import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../theme/cn';
import { useOnboardingIntl } from '../OnboardingIntl';

export interface PrimaryButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

/**
 * Primary CTA button used across the onboarding flow.
 * Single responsibility: render a tappable, accessible, animated button.
 */
export function PrimaryButton({
  children,
  loading = false,
  fullWidth = true,
  className,
  disabled,
  type,
  ...rest
}: PrimaryButtonProps) {
  const { labels } = useOnboardingIntl();
  return (
    <motion.button
      {...rest}
      type={type ?? 'button'}
      disabled={disabled || loading}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-semibold',
        'bg-[rgb(var(--uob-primary-500))] text-white shadow-sm transition-colors',
        'hover:bg-[rgb(var(--uob-primary-600))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--uob-primary-500))] focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        fullWidth ? 'w-full' : '',
        className,
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            aria-hidden="true"
          />
          <span>{labels.loading}</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}

// Re-export the HTML button type for consumers that need to wrap a non-motion button.
export type { ButtonHTMLAttributes };
