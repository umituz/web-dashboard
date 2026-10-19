import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { cn } from '../../theme/cn';
import {
  didCrossLeftSwipeThreshold,
  didCrossRightSwipeThreshold,
  SWIPE_LEFT_OPACITY_INPUT,
  SWIPE_LEFT_OPACITY_VALUES,
  SWIPE_RIGHT_OPACITY_INPUT,
  SWIPE_RIGHT_OPACITY_VALUES,
  SWIPE_ROTATION_RANGE,
  SWIPE_ROTATION_VALUES,
} from '../../calc/swipe-gesture-curve';
import { useOnboardingIntl } from '../OnboardingIntl';

export interface SwipeCardProps {
  text: string;
  category?: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  className?: string;
}

interface GestureOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

function useSwipeGestures({ onSwipeLeft, onSwipeRight }: GestureOptions) {
  // Refs avoid stale closures — the gesture handlers always see the latest callbacks.
  const leftRef = useRef(onSwipeLeft);
  const rightRef = useRef(onSwipeRight);
  useEffect(() => {
    leftRef.current = onSwipeLeft;
    rightRef.current = onSwipeRight;
  }, [onSwipeLeft, onSwipeRight]);

  return {
    onDragEnd(_: unknown, info: PanInfo) {
      if (didCrossRightSwipeThreshold(info.offset.x)) rightRef.current();
      else if (didCrossLeftSwipeThreshold(info.offset.x)) leftRef.current();
    },
  };
}

/**
 * Tinder-style swipeable card.
 * Single responsibility: gesture handling and visual feedback for one statement.
 * Keyboard-accessible: ← / → keys trigger the same actions as swipe gestures.
 *
 * All numeric thresholds and curve points live in `calc/swipe-gesture-curve`.
 */
export function SwipeCard({ text, category, onSwipeLeft, onSwipeRight, className }: SwipeCardProps) {
  const { labels } = useOnboardingIntl();
  const x = useMotionValue(0);
  const rotate = useTransform(x, SWIPE_ROTATION_RANGE, SWIPE_ROTATION_VALUES);
  const leftOpacity = useTransform(x, SWIPE_LEFT_OPACITY_INPUT, SWIPE_LEFT_OPACITY_VALUES);
  const rightOpacity = useTransform(x, SWIPE_RIGHT_OPACITY_INPUT, SWIPE_RIGHT_OPACITY_VALUES);
  const { onDragEnd } = useSwipeGestures({ onSwipeLeft, onSwipeRight });

  return (
    <div
      className={cn('relative h-72 w-full select-none focus:outline-none', className)}
      role="group"
      aria-label={`${text} — ${labels.swipeHint}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          onSwipeLeft();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          onSwipeRight();
        }
      }}
    >
      <motion.div
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={onDragEnd}
        className="flex h-full w-full cursor-grab flex-col items-center justify-center rounded-2xl border border-[rgb(var(--uob-border))] bg-[rgb(var(--uob-surface))] p-8 text-center shadow-lg active:cursor-grabbing"
      >
        {category && (
          <span className="mb-4 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--uob-primary-500))]">
            {category}
          </span>
        )}
        <p className="text-xl font-medium text-[rgb(var(--uob-text-primary))]">{text}</p>
        <p className="mt-6 text-sm text-[rgb(var(--uob-text-muted))]">{labels.swipeHint}</p>
      </motion.div>
      <motion.div
        style={{ opacity: leftOpacity }}
        className="pointer-events-none absolute left-4 top-4 rounded-md border-2 border-[rgb(var(--uob-error))] px-3 py-1 text-sm font-bold uppercase text-[rgb(var(--uob-error))]"
      >
        {labels.disagree}
      </motion.div>
      <motion.div
        style={{ opacity: rightOpacity }}
        className="pointer-events-none absolute right-4 top-4 rounded-md border-2 border-[rgb(var(--uob-success))] px-3 py-1 text-sm font-bold uppercase text-[rgb(var(--uob-success))]"
      >
        {labels.agree}
      </motion.div>
    </div>
  );
}
