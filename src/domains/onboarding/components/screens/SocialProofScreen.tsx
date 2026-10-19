import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { PrimaryButton } from '../shared/PrimaryButton';
import { cn } from '../../theme/cn';
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
    <div className="flex flex-1 flex-col gap-8">
      {config.title && (
        <h2 className="text-2xl font-semibold text-[rgb(var(--uob-text-primary))] sm:text-3xl">
          {config.title}
        </h2>
      )}
      <div className="flex flex-1 flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={`${current.name}-${index}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-[rgb(var(--uob-border))] bg-[rgb(var(--uob-surface))] p-8 text-center"
          >
            {current.rating !== undefined && (
              <div className="flex items-center gap-1" aria-label={`Rated ${current.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      i < current.rating!
                        ? 'fill-current text-[rgb(var(--uob-warning))]'
                        : 'text-[rgb(var(--uob-border))]',
                    )}
                  />
                ))}
              </div>
            )}
            <p className="text-lg text-[rgb(var(--uob-text-primary))]">“{current.content}”</p>
            <footer className="flex flex-col items-center gap-1">
              {current.avatar && (
                <img
                  src={current.avatar}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <cite className="text-sm font-semibold not-italic text-[rgb(var(--uob-text-primary))]">
                {current.name}
              </cite>
              <span className="text-sm text-[rgb(var(--uob-text-muted))]">{current.role}</span>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1.5" role="tablist" aria-label="Testimonials">
          {config.testimonials.map((t, i) => (
            <button
              key={`${t.name}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${t.name}: ${t.content}`}
              onClick={() => setIndex(i)}
              className={cn(
                'h-2 w-2 rounded-full transition-all',
                i === index
                  ? 'w-6 bg-[rgb(var(--uob-primary-500))]'
                  : 'bg-[rgb(var(--uob-border))]',
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="rounded-md border border-[rgb(var(--uob-border))] bg-[rgb(var(--uob-surface))] px-3 py-1 text-sm hover:bg-[rgb(var(--uob-surface-muted))]"
              >
                {labels.previous}
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="rounded-md border border-[rgb(var(--uob-border))] bg-[rgb(var(--uob-surface))] px-3 py-1 text-sm hover:bg-[rgb(var(--uob-surface-muted))]"
              >
                {labels.nextAction}
              </button>
            </>
          )}
        </div>
      </div>
      <PrimaryButton onClick={onNext}>{config.cta ?? labels.continueAction}</PrimaryButton>
    </div>
  );
}
