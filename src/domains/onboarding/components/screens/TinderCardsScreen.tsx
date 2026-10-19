import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SwipeCard } from '../shared/SwipeCard';
import { PrimaryButton } from '../shared/PrimaryButton';
import {
  getCardEnterAnimate,
  getCardEnterExit,
  getCardEnterInitial,
  getCardTransitionDurationMs,
} from '../../calc/card-stack-motion-curve';
import { formatLabel, useOnboardingIntl } from '../OnboardingIntl';
import type { TinderCardsScreenConfig } from '../../types/screens';

export interface TinderCardsScreenProps {
  config: TinderCardsScreenConfig;
  onNext: (data: { liked: string[] }) => void;
}

export function TinderCardsScreen({ config, onNext }: TinderCardsScreenProps) {
  const { labels } = useOnboardingIntl();
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const total = config.statements.length;
  const current = config.statements[index];
  // Refs make decision handlers always see the latest state without recreating callbacks
  // on every index change — which would have remounted SwipeCard and lost gestures.
  const indexRef = useRef(index);
  const likedRef = useRef(liked);
  useEffect(() => {
    indexRef.current = index;
    likedRef.current = liked;
  }, [index, liked]);

  const handleDecision = useCallback(
    (likedStatement: boolean) => {
      if (likedStatement) {
        setLiked((prev) => [...prev, config.statements[indexRef.current].id]);
      }
      setIndex((i) => i + 1);
    },
    [config.statements],
  );

  const onSwipeLeft = useCallback(() => handleDecision(false), [handleDecision]);
  const onSwipeRight = useCallback(() => handleDecision(true), [handleDecision]);

  if (!current) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <p className="text-lg text-[rgb(var(--uob-text-primary))]">{labels.allDone}</p>
        <PrimaryButton onClick={() => onNext({ liked: likedRef.current })}>
          {config.cta ?? labels.continueAction}
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {config.title && (
        <h2 className="text-2xl font-semibold text-[rgb(var(--uob-text-primary))] sm:text-3xl">
          {config.title}
        </h2>
      )}
      <div className="flex flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: getCardEnterInitial().opacity, scale: getCardEnterInitial().scale }}
            animate={{ opacity: getCardEnterAnimate().opacity, scale: getCardEnterAnimate().scale }}
            exit={{ opacity: getCardEnterExit().opacity, scale: getCardEnterExit().scale }}
            transition={{ duration: getCardTransitionDurationMs() / 1000 }}
            className="w-full"
          >
            <SwipeCard
              text={current.text}
              category={current.category}
              onSwipeLeft={onSwipeLeft}
              onSwipeRight={onSwipeRight}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onSwipeLeft}
          className="flex-1 rounded-xl border-2 border-[rgb(var(--uob-error))] py-3 font-semibold text-[rgb(var(--uob-error))] transition-colors hover:bg-[rgb(var(--uob-error))] hover:text-white"
        >
          {labels.disagree}
        </button>
        <button
          type="button"
          onClick={onSwipeRight}
          className="flex-1 rounded-xl border-2 border-[rgb(var(--uob-success))] py-3 font-semibold text-[rgb(var(--uob-success))] transition-colors hover:bg-[rgb(var(--uob-success))] hover:text-white"
        >
          {labels.agree}
        </button>
      </div>
      <p
        className="text-center text-sm text-[rgb(var(--uob-text-muted))]"
        aria-live="polite"
      >
        {formatLabel(labels.countOfPattern, { current: index + 1, total })}
      </p>
    </div>
  );
}
