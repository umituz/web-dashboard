import { useId, useState } from 'react';
import { PrimaryButton } from '../shared/PrimaryButton';
import { QuestionWrapper } from '../shared/QuestionWrapper';
import { useOnboardingIntl } from '../OnboardingIntl';
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
      <div className="flex flex-col gap-5">
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
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[rgb(var(--uob-text-primary))]" htmlFor={fieldId}>
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
          className="rounded-md border border-[rgb(var(--uob-border))] bg-[rgb(var(--uob-surface))] p-2 text-sm"
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
        <div className="flex flex-wrap gap-2" role="group" aria-label={item.label}>
          {item.options?.map((opt) => {
            const isOn = list.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={isOn}
                onClick={() => onChange(toggleMulti(list, opt.id))}
                className={
                  isOn
                    ? 'rounded-full bg-[rgb(var(--uob-primary-500))] px-3 py-1 text-sm text-white'
                    : 'rounded-full border border-[rgb(var(--uob-border))] bg-[rgb(var(--uob-surface))] px-3 py-1 text-sm hover:border-[rgb(var(--uob-primary-500))]'
                }
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
          className={
            value === true
              ? 'h-6 w-11 rounded-full bg-[rgb(var(--uob-primary-500))] p-0.5'
              : 'h-6 w-11 rounded-full bg-[rgb(var(--uob-border))] p-0.5'
          }
        >
          <span
            className={
              value === true
                ? 'block h-5 w-5 translate-x-5 rounded-full bg-white transition-transform'
                : 'block h-5 w-5 translate-x-0 rounded-full bg-white transition-transform'
            }
          />
        </button>
      );
    case 'slider': {
      const { min, max } = resolveSliderBounds(item.min, item.max);
      const numeric = typeof value === 'number' ? value : min;
      return (
        <div className="flex flex-col gap-1">
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
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[rgb(var(--uob-text-muted))]">
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
