import { useCallback, useState } from 'react';
import { OptionCard } from '../shared/OptionCard';
import { PrimaryButton } from '../shared/PrimaryButton';
import { QuestionWrapper } from '../shared/QuestionWrapper';
import { formatLabel, useOnboardingIntl } from '../OnboardingIntl';
import type { PainPointsScreenConfig } from '../../types/screens';

export interface PainPointsScreenProps {
  config: PainPointsScreenConfig;
  onNext: (data: { selected: string[] }) => void;
  initialSelected?: ReadonlyArray<string>;
}

export function PainPointsScreen({ config, onNext, initialSelected }: PainPointsScreenProps) {
  const { labels } = useOnboardingIntl();
  const [selected, setSelected] = useState<string[]>([...(initialSelected ?? [])]);
  const multiSelect = config.multiSelect ?? true;
  const max = config.maxSelect;

  const subtitle = multiSelect
    ? max !== undefined
      ? formatLabel(labels.pickUpToPattern, { max })
      : labels.selectAllThatApply
    : labels.pickTheOne;

  const toggle = useCallback(
    (id: string) => {
      setSelected((prev) => {
        if (multiSelect) {
          if (prev.includes(id)) return prev.filter((p) => p !== id);
          if (max !== undefined && prev.length >= max) return prev;
          return [...prev, id];
        }
        return prev.includes(id) ? [] : [id];
      });
    },
    [multiSelect, max],
  );

  return (
    <QuestionWrapper
      title={config.title}
      subtitle={subtitle}
    >
      <div
        className="flex flex-col gap-2"
        role={multiSelect ? 'group' : 'radiogroup'}
        aria-label={config.title}
      >
        {config.painPoints.map((point) => (
          <OptionCard
            key={point.id}
            option={point}
            selected={selected.includes(point.id)}
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
