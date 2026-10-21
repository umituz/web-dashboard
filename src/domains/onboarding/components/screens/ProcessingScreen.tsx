import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@umituz/web-design-system/utils/cn';
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
    <div className="udb-onb-stage">
      {config.title && <h2 className="udb-onb-title">{config.title}</h2>}

      <ul className="udb-onb-steps" aria-live="polite">
        {config.steps.map((step, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          return (
            <li
              key={`${step}-${i}`}
              className={cn(
                'udb-onb-step',
                isDone && 'udb-onb-step--done',
                isActive && 'udb-onb-step--active',
              )}
            >
              <span className="udb-onb-step__badge">
                {isDone ? <Check className="udb-onb-icon--sm" /> : <span>{i + 1}</span>}

              </span>

              <span>{step}</span>

              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="udb-onb-step__pulse"
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
