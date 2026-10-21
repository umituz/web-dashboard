import { useCallback, useState } from 'react';
import { OptionCard } from '@umituz/web-design-system/molecules';
import { PrimaryButton } from '../PrimaryButton';
import { QuestionWrapper } from '../QuestionWrapper';
import { renderBundledIcon } from '../renderBundledIcon';
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
        className="udb-onb-list"
        role={multiSelect ? 'group' : 'radiogroup'}
        aria-label={config.question}
      >
        {config.options.map((option) => (
          <OptionCard
            key={option.id}
            label={option.label}
            description={option.description}
            icon={renderBundledIcon(option.iconName)}
            selected={selected.includes(option.id)}
            onSelect={() => toggle(option.id)}
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
