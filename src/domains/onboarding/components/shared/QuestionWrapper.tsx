import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../theme/cn';

export interface QuestionWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Consistent framing for question-style screens.
 * Single responsibility: layout the question header + content area.
 */
export function QuestionWrapper({ title, subtitle, children, className }: QuestionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('flex w-full flex-col gap-6', className)}
    >
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-[rgb(var(--uob-text-primary))] sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-base text-[rgb(var(--uob-text-muted))]">{subtitle}</p>
        )}
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </motion.div>
  );
}
