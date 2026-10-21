import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SwipeCard } from '../SwipeCard';
import { PrimaryButton } from '../PrimaryButton';
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
      <div className="udb-onb-stage">
        <p className="udb-onb-lead">{labels.allDone}</p>

        <PrimaryButton onClick={() => onNext({ liked: likedRef.current })}>
          {config.cta ?? labels.continueAction}
        </PrimaryButton>

      </div>

    );
  }

  return (
    <div className="udb-onb-proof">
      {config.title && <h2 className="udb-onb-title">{config.title}</h2>}

      <div className="udb-onb-proof__stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: getCardEnterInitial().opacity, scale: getCardEnterInitial().scale }}
            animate={{ opacity: getCardEnterAnimate().opacity, scale: getCardEnterAnimate().scale }}
            exit={{ opacity: getCardEnterExit().opacity, scale: getCardEnterExit().scale }}
            transition={{ duration: getCardTransitionDurationMs() / 1000 }}
            className="udb-onb-stage"
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

      <div className="udb-onb-proof__nav">
        <button type="button" onClick={onSwipeLeft} className="udb-onb-choice udb-onb-choice--no">
          {labels.disagree}
        </button>

        <button type="button" onClick={onSwipeRight} className="udb-onb-choice udb-onb-choice--yes">
          {labels.agree}
        </button>

      </div>

      <p className="udb-onb-note" aria-live="polite">
        {formatLabel(labels.countOfPattern, { current: index + 1, total })}
      </p>

    </div>

  );
}
