import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import {
  didCrossLeftSwipeThreshold,
  didCrossRightSwipeThreshold,
  SWIPE_LEFT_OPACITY_INPUT,
  SWIPE_LEFT_OPACITY_VALUES,
  SWIPE_RIGHT_OPACITY_INPUT,
  SWIPE_RIGHT_OPACITY_VALUES,
  SWIPE_ROTATION_RANGE,
  SWIPE_ROTATION_VALUES,
} from '../calc/swipe-gesture-curve';
import { useOnboardingIntl } from './OnboardingIntl';

export interface SwipeCardProps {
  text: string;
  category?: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  className?: string;
}

function useSwipeGestures({ onSwipeLeft, onSwipeRight }: { onSwipeLeft: () => void; onSwipeRight: () => void }) {
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

export function SwipeCard({ text, category, onSwipeLeft, onSwipeRight, className }: SwipeCardProps) {
  const { labels } = useOnboardingIntl();
  const x = useMotionValue(0);
  const rotate = useTransform(x, SWIPE_ROTATION_RANGE, SWIPE_ROTATION_VALUES);
  const leftOpacity = useTransform(x, SWIPE_LEFT_OPACITY_INPUT, SWIPE_LEFT_OPACITY_VALUES);
  const rightOpacity = useTransform(x, SWIPE_RIGHT_OPACITY_INPUT, SWIPE_RIGHT_OPACITY_VALUES);
  const { onDragEnd } = useSwipeGestures({ onSwipeLeft, onSwipeRight });

  return (
    <div
      className={className ? `udb-onb-swipe ${className}` : 'udb-onb-swipe'}
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
        className="udb-onb-swipe__card"
      >
        {category && <span className="udb-onb-swipe__category">{category}</span>}
        <p className="udb-onb-swipe__text">{text}</p>
        <p className="udb-onb-swipe__hint">{labels.swipeHint}</p>
      </motion.div>
      <motion.div
        style={{ opacity: leftOpacity }}
        className="udb-onb-swipe__stamp udb-onb-swipe__stamp--no"
      >
        {labels.disagree}
      </motion.div>
      <motion.div
        style={{ opacity: rightOpacity }}
        className="udb-onb-swipe__stamp udb-onb-swipe__stamp--yes"
      >
        {labels.agree}
      </motion.div>
    </div>
  );
}
