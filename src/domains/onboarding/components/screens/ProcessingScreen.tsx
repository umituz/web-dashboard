import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../theme/cn';
import { splitTotalDuration } from '../../calc/duration-equal-split';
import type { ProcessingScreenConfig } from '../../types/screens';

export interface ProcessingScreenProps {
  config: ProcessingScreenConfig;
  onComplete: (data: { completed: true }) => void;
}

export function ProcessingScreen({ config, onComplete }: ProcessingScreenProps) {
  const stepDuration = splitTotalDuration(config.durationMs, config.steps.length);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= config.steps.length) {
      onComplete({ completed: true });
      return;
    }
    const timer = window.setTimeout(() => setCurrentStep((s) => s + 1), stepDuration);
    return () => window.clearTimeout(timer);
  }, [currentStep, config.steps.length, stepDuration, onComplete]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      {config.title && (
        <h2 className="text-2xl font-semibold text-[rgb(var(--uob-text-primary))] sm:text-3xl">
          {config.title}
        </h2>
      )}
      <ul className="flex w-full max-w-md flex-col gap-3" aria-live="polite">
        {config.steps.map((step, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          return (
            <li
              key={`${step}-${i}`}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3 text-left text-sm',
                isDone
                  ? 'border-[rgb(var(--uob-success))] bg-[rgb(var(--uob-success))]/10'
                  : isActive
                    ? 'border-[rgb(var(--uob-primary-500))] bg-[rgb(var(--uob-primary-50))]'
                    : 'border-[rgb(var(--uob-border))] bg-[rgb(var(--uob-surface))]',
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                  isDone
                    ? 'bg-[rgb(var(--uob-success))] text-white'
                    : isActive
                      ? 'bg-[rgb(var(--uob-primary-500))] text-white'
                      : 'bg-[rgb(var(--uob-border))] text-[rgb(var(--uob-text-muted))]',
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : <span className="text-xs">{i + 1}</span>}
              </span>
              <span className="text-[rgb(var(--uob-text-primary))]">{step}</span>
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ml-auto h-2 w-2 animate-pulse rounded-full bg-[rgb(var(--uob-primary-500))]"
                    aria-hidden="true"
                  />
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
