import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { PrimaryButton } from '../shared/PrimaryButton';
import { useOnboardingIntl } from '../OnboardingIntl';
import type { PersonalizedSolutionScreenConfig } from '../../types/screens';

export interface PersonalizedSolutionScreenProps {
  config: PersonalizedSolutionScreenConfig;
  onNext: () => void;
}

export function PersonalizedSolutionScreen({ config, onNext }: PersonalizedSolutionScreenProps) {
  const { labels } = useOnboardingIntl();
  const visible = config.solutions.filter((s) => config.selectedPainPointIds.includes(s.painPointId));

  return (
    <div className="flex flex-1 flex-col gap-6">
      {config.title && (
        <h2 className="text-2xl font-semibold text-[rgb(var(--uob-text-primary))] sm:text-3xl">
          {config.title}
        </h2>
      )}
      {config.subtitle && (
        <p className="text-base text-[rgb(var(--uob-text-muted))]">{config.subtitle}</p>
      )}
      <ul className="flex flex-col gap-3">
        {visible.map((solution, i) => (
          <motion.li
            key={solution.painPointId}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="flex items-start gap-3 rounded-xl border border-[rgb(var(--uob-border))] bg-[rgb(var(--uob-surface))] p-4"
          >
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-[rgb(var(--uob-success))]"
              aria-hidden="true"
            />
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-base text-[rgb(var(--uob-text-primary))]">{solution.solution}</p>
              {solution.statistic && (
                <p className="text-sm font-semibold text-[rgb(var(--uob-primary-500))]">
                  {solution.statistic}
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
      <PrimaryButton onClick={onNext}>{config.cta ?? labels.continueAction}</PrimaryButton>
    </div>
  );
}
