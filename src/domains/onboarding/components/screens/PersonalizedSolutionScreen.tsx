import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';
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
    <div className="udb-onb-proof">
      {config.title && <h2 className="udb-onb-title">{config.title}</h2>}
      {config.subtitle && <p className="udb-onb-lead">{config.subtitle}</p>}
      <ul className="udb-onb-solutions">
        {visible.map((solution, i) => (
          <motion.li
            key={solution.painPointId}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="udb-onb-solution"
          >
            <CheckCircle2 className="udb-onb-icon udb-onb-solution__icon" aria-hidden="true" />
            <div className="udb-onb-solution__body">
              <p>{solution.solution}</p>
              {solution.statistic && <p className="udb-onb-solution__stat">{solution.statistic}</p>}
            </div>
          </motion.li>
        ))}
      </ul>
      <PrimaryButton onClick={onNext}>{config.cta ?? labels.continueAction}</PrimaryButton>
    </div>
  );
}
