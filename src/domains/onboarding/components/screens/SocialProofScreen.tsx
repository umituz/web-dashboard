import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';
import { Button } from '@umituz/web-design-system/atoms';
import { cn } from '@umituz/web-design-system/utils/cn';
import { useOnboardingIntl } from '../OnboardingIntl';
import type { SocialProofScreenConfig } from '../../types/screens';

export interface SocialProofScreenProps {
  config: SocialProofScreenConfig;
  onNext: () => void;
}

export function SocialProofScreen({ config, onNext }: SocialProofScreenProps) {
  const { labels } = useOnboardingIntl();
  const [index, setIndex] = useState(0);
  const total = config.testimonials.length;
  const current = config.testimonials[index];

  function go(delta: number) {
    setIndex((i) => (i + delta + total) % total);
  }

  return (
    <div className="udb-onb-proof">
      {config.title && <h2 className="udb-onb-title">{config.title}</h2>}

      <div className="udb-onb-proof__stage">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={`${current.name}-${index}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="udb-onb-quote"
          >
            {current.rating !== undefined && (
              <div className="udb-onb-quote__stars" aria-label={`Rated ${current.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn('udb-onb-quote__star', i < current.rating! && 'udb-onb-quote__star--filled')}
                  />
                ))}
              </div>

            )}
            <p className="udb-onb-quote__content">“{current.content}”</p>

            <footer className="udb-onb-quote__footer">
              {current.avatar && <img src={current.avatar} alt="" className="udb-onb-quote__avatar" />}
              <cite className="udb-onb-quote__cite">{current.name}</cite>

              <span className="udb-onb-quote__role">{current.role}</span>

            </footer>

          </motion.blockquote>

        </AnimatePresence>

      </div>

      <div className="udb-onb-proof__bar">
        <div className="udb-onb-dots" role="tablist" aria-label="Testimonials">
          {config.testimonials.map((t, i) => (
            <button
              key={`${t.name}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${t.name}: ${t.content}`}
              onClick={() => setIndex(i)}
              className={cn('udb-onb-dot', i === index && 'udb-onb-dot--active')}
            />
          ))}
        </div>

        <div className="udb-onb-proof__nav">
          {total > 1 && (
            <>
              <Button variant="outline" size="sm" onClick={() => go(-1)}>
                {labels.previous}
              </Button>

              <Button variant="outline" size="sm" onClick={() => go(1)}>
                {labels.nextAction}
              </Button>

            </>

          )}
        </div>

      </div>

      <PrimaryButton onClick={onNext}>{config.cta ?? labels.continueAction}</PrimaryButton>

    </div>

  );
}
