import { useId, useState } from 'react';
import { PrimaryButton } from '../PrimaryButton';
import { QuestionWrapper } from '../QuestionWrapper';
import { useOnboardingIntl } from '../OnboardingIntl';
import { cn } from '@umituz/web-design-system/utils/cn';
import {
  clampValueToBounds,
  resolveSliderBounds,
} from '../../calc/slider-value-bounds';
import type {
  OnboardingOption,
  PreferenceItem,
  PreferencesScreenConfig,
} from '../../types/screens';

type PrefValue = string | number | string[] | boolean;

function defaultFor(item: PreferenceItem): PrefValue {
  if (item.defaultValue !== undefined) {
    if (item.type === 'slider' && typeof item.defaultValue === 'number') {
      return clampValueToBounds(item.defaultValue, item.min ?? 0, item.max ?? 0, item.id);
    }
    return item.defaultValue;
  }
  switch (item.type) {
    case 'multi-select':
      return [];
    case 'toggle':
      return false;
    case 'slider':
      return resolveSliderBounds(item.min, item.max).min;
    case 'select':
    default:
      return item.options?.[0]?.id ?? '';
  }
}

function toggleMulti(values: string[], id: string): string[] {
  return values.includes(id) ? values.filter((v) => v !== id) : [...values, id];
}

export interface PreferencesScreenProps {
  config: PreferencesScreenConfig;
  onNext: (data: { values: Record<string, PrefValue> }) => void;
}

export function PreferencesScreen({ config, onNext }: PreferencesScreenProps) {
  const { labels } = useOnboardingIntl();
  const [values, setValues] = useState<Record<string, PrefValue>>(() => {
    const initial: Record<string, PrefValue> = {};
    for (const item of config.preferences) initial[item.id] = defaultFor(item);
    return initial;
  });

  function update(id: string, value: PrefValue) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  const canContinue = config.preferences.every((item) => {
    const v = values[item.id];
    if (item.type === 'select') return typeof v === 'string' && v.length > 0;
    if (item.type === 'multi-select') return Array.isArray(v);
    return true;
  });

  return (
    <QuestionWrapper title={config.title} subtitle={labels.tailorExperience}>
      <div className="udb-onb-prefs">
        {config.preferences.map((item) => (
          <PreferenceRow key={item.id} item={item} value={values[item.id]} onChange={(v) => update(item.id, v)} />
        ))}
      </div>
      <PrimaryButton onClick={() => onNext({ values })} disabled={!canContinue}>
        {config.cta ?? labels.continueAction}
      </PrimaryButton>
    </QuestionWrapper>
  );
}

interface PreferenceRowProps {
  item: PreferenceItem;
  value: PrefValue;
  onChange: (value: PrefValue) => void;
}

function PreferenceRow({ item, value, onChange }: PreferenceRowProps) {
  const fieldId = useId();
  return (
    <div className="udb-onb-field">
      <label className="udb-onb-field__label" htmlFor={fieldId}>
        {item.label}
      </label>
      <PreferenceControl item={item} value={value} onChange={onChange} fieldId={fieldId} />
    </div>
  );
}

interface PreferenceControlProps extends PreferenceRowProps {
  fieldId: string;
}

function PreferenceControl({ item, value, onChange, fieldId }: PreferenceControlProps) {
  switch (item.type) {
    case 'select':
      return (
        <select
          id={fieldId}
          className="udb-onb-select"
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
        >
          {item.options?.map((opt: OnboardingOption) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    case 'multi-select': {
      const list = Array.isArray(value) ? value : [];
      return (
        <div className="udb-onb-chips" role="group" aria-label={item.label}>
          {item.options?.map((opt) => {
            const isOn = list.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={isOn}
                onClick={() => onChange(toggleMulti(list, opt.id))}
                className={cn('udb-onb-chip', isOn && 'udb-onb-chip--on')}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      );
    }
    case 'toggle':
      return (
        <button
          type="button"
          id={fieldId}
          role="switch"
          aria-checked={value === true}
          onClick={() => onChange(!value)}
          className={cn('udb-onb-switch', value === true && 'udb-onb-switch--on')}
        >
          <span className="udb-onb-switch__thumb" />
        </button>
      );
    case 'slider': {
      const { min, max } = resolveSliderBounds(item.min, item.max);
      const numeric = typeof value === 'number' ? value : min;
      return (
        <div className="udb-onb-slider">
          <input
            type="range"
            id={fieldId}
            min={min}
            max={max}
            value={numeric}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={numeric}
          />
          <div className="udb-onb-slider__scale">
            <span>{min}</span>
            <span>{numeric}</span>
            <span>{max}</span>
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}
