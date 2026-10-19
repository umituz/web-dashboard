import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

export type ScreenTransition = 'slide' | 'fade' | 'scale' | 'none';

export interface AnimationWrapperProps {
  stepKey: string;
  children: ReactNode;
  transition?: ScreenTransition;
  className?: string;
}

const variantsByTransition: Record<
  Exclude<ScreenTransition, 'none'>,
  {
    initial: { opacity: number; x?: number; y?: number; scale?: number };
    animate: { opacity: number; x?: number; y?: number; scale?: number };
    exit: { opacity: number; x?: number; y?: number; scale?: number };
  }
> = {
  slide: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.04 },
  },
};

/**
 * Wraps children with a transition keyed on stepKey.
 * Respects `prefers-reduced-motion` by disabling transitions.
 */
export function AnimationWrapper({
  stepKey,
  children,
  transition = 'slide',
  className,
}: AnimationWrapperProps) {
  const reduced = useReducedMotion();
  const effective: ScreenTransition = reduced ? 'none' : transition;
  if (effective === 'none') {
    return (
      <div key={stepKey} className={className}>
        {children}
      </div>
    );
  }
  const variants = variantsByTransition[effective];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={stepKey}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
