import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@umituz/web-design-system/utils/cn';

export interface QuestionWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function QuestionWrapper({ title, subtitle, children, className }: QuestionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('udb-onb-question', className)}
    >
      <header className="udb-onb-question__head">
        <h2 className="udb-onb-title">{title}</h2>
        {subtitle && <p className="udb-onb-lead">{subtitle}</p>}
      </header>
      <div className="udb-onb-question__body">{children}</div>
    </motion.div>
  );
}
