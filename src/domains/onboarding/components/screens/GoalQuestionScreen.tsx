import { useCallback, useState } from 'react';
import { OptionCard } from '../shared/OptionCard';
import { PrimaryButton } from '../shared/PrimaryButton';
import { QuestionWrapper } from '../shared/QuestionWrapper';
import { useOnboardingIntl } from '../OnboardingIntl';
import type { GoalQuestionScreenConfig } from '../../types/screens';

export interface GoalQuestionScreenProps {
  config: GoalQuestionScreenConfig;
  onNext: (data: { selected: string[] }) => void;
  initialSelected?: ReadonlyArray<string>;
}

export function GoalQuestionScreen({ config, onNext, initialSelected }: GoalQuestionScreenProps) {
  const { labels } = useOnboardingIntl();
  const [selected, setSelected] = useState<string[]>([...(initialSelected ?? [])]);
  const multiSelect = config.multiSelect ?? false;

  const toggle = useCallback(
    (id: string) => {
      setSelected((prev) => {
        if (multiSelect) {
          return prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
        }
        return prev.includes(id) ? [] : [id];
      });
    },
    [multiSelect],
  );

  return (
    <QuestionWrapper
      title={config.question}
      subtitle={multiSelect ? labels.selectAllThatApply : labels.selectOne}
    >
      <div
        className="flex flex-col gap-2"
        role={multiSelect ? 'group' : 'radiogroup'}
        aria-label={config.question}
      >
        {config.options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            selected={selected.includes(option.id)}
            onToggle={toggle}
            multiSelect={multiSelect}
          />
        ))}
      </div>
      <PrimaryButton onClick={() => onNext({ selected })} disabled={selected.length === 0}>
        {config.cta ?? labels.continueAction}
      </PrimaryButton>
    </QuestionWrapper>
  );
}
