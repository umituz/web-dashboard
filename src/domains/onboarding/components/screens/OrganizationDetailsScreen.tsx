import { useId, useState } from 'react';
import { PrimaryButton } from '../PrimaryButton';
import { QuestionWrapper } from '../QuestionWrapper';
import { useOnboardingIntl } from '../OnboardingIntl';
import type {
  OnboardingOption,
  OrganizationDetailsData,
  OrganizationDetailsScreenConfig,
} from '../../types/screens';

export interface OrganizationDetailsScreenProps {
  config: OrganizationDetailsScreenConfig;
  onNext: (data: OrganizationDetailsData) => void;
  /** Previously collected answer, restored when the user navigates back. */
  initial?: OrganizationDetailsData;
}

export function OrganizationDetailsScreen({ config, onNext, initial }: OrganizationDetailsScreenProps) {
  const { labels } = useOnboardingIntl();
  const nameId = useId();
  const teamId = useId();
  const [name, setName] = useState(initial?.name ?? '');
  const [teamSize, setTeamSize] = useState(
    initial?.teamSize ?? config.teamSizeOptions?.[0]?.id ?? '',
  );

  const nameLabel = labels.organizationNameLabel ?? 'Organization name';
  const teamLabel = labels.teamSizeLabel ?? 'Team size';
  const canContinue = name.trim().length > 0;

  return (
    <QuestionWrapper title={config.title ?? labels.organizationTitle ?? 'About your organization'}>
      <div className="udb-onb-field">
        <label className="udb-onb-field__label" htmlFor={nameId}>
          {nameLabel}
        </label>
        <input
          id={nameId}
          className="udb-onb-input"
          value={name}
          placeholder={config.namePlaceholder}
          autoComplete="organization"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {config.teamSizeOptions && config.teamSizeOptions.length > 0 && (
        <div className="udb-onb-field">
          <label className="udb-onb-field__label" htmlFor={teamId}>
            {teamLabel}
          </label>
          <select
            id={teamId}
            className="udb-onb-select"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
          >
            {config.teamSizeOptions.map((opt: OnboardingOption) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <PrimaryButton onClick={() => onNext({ name: name.trim(), teamSize })} disabled={!canContinue}>
        {config.cta ?? labels.continueAction}
      </PrimaryButton>

    </QuestionWrapper>

  );
}
