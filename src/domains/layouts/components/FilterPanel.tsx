import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

export interface FilterPanelProps {
  title?: string;
  onClear?: () => void;
  clearDisabled?: boolean;
  clearLabel?: string;
  children: ReactNode;
  className?: string;
}

/** Sidebar container for a set of filter sections. */
export function FilterPanel({
  title = 'Filters',
  onClear,
  clearDisabled,
  clearLabel = 'Clear all',
  children,
  className,
}: FilterPanelProps) {
  return (
    <aside className={className !== undefined ? `udb-filter-panel ${className}` : 'udb-filter-panel'} aria-label={title}>
      <div className="udb-filter-panel__header">
        <span className="udb-filter-panel__title">{title}</span>
        {onClear !== undefined && (
          <button type="button" className="udb-filter-panel__clear" onClick={onClear} disabled={clearDisabled}>
            {clearLabel}
          </button>
        )}
      </div>
      <div className="udb-filter-panel__sections">{children}</div>
    </aside>
  );
}

export interface FilterSectionProps {
  title: string;
  children: ReactNode;
}

export function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section className="udb-filter-section">
      <h4 className="udb-filter-section__title">{title}</h4>
      <div className="udb-filter-section__body">{children}</div>
    </section>
  );
}

export interface FilterListOption {
  value: string;
  label: string;
  count?: number;
}

export interface CheckFilterListProps {
  options: readonly FilterListOption[];
  selected: readonly string[];
  onToggle: (value: string) => void;
  /** Limit visible options; hidden-but-selected ones stay visible with a "+N more" note. */
  maxVisible?: number;
}

export function CheckFilterList({ options, selected, onToggle, maxVisible = 8 }: CheckFilterListProps) {
  const visible = options.slice(0, maxVisible);
  const hasMore = options.length > maxVisible;
  const hiddenSelected = options.slice(maxVisible).filter((option) => selected.includes(option.value));
  const shown = hasMore ? [...visible, ...hiddenSelected] : visible;

  return (
    <ul className="udb-check-filter" role="group">
      {shown.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <li key={option.value}>
            <button
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              className={isSelected ? 'udb-check-filter__item udb-check-filter__item--checked' : 'udb-check-filter__item'}
              onClick={() => onToggle(option.value)}
            >
              <span className="udb-check-filter__box" aria-hidden="true">
                {isSelected && <Check size={12} strokeWidth={3} />}
              </span>
              <span className="udb-check-filter__label">{option.label}</span>
              {option.count !== undefined && <span className="udb-check-filter__count">{option.count}</span>}
            </button>
          </li>
        );
      })}
      {hasMore && (
        <li className="udb-check-filter__more">{`+${options.length - shown.length} more`}</li>
      )}
    </ul>
  );
}

export interface SingleSelectFilterListProps {
  options: readonly FilterListOption[];
  value: string | null;
  onChange: (value: string | null) => void;
}

/** Radio-style list where one option (or none) is active. */
export function SingleSelectFilterList({ options, value, onChange }: SingleSelectFilterListProps) {
  return (
    <ul className="udb-check-filter" role="group">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <li key={option.value}>
            <button
              type="button"
              role="radio"
              aria-checked={isActive}
              className={isActive ? 'udb-check-filter__item udb-check-filter__item--checked' : 'udb-check-filter__item'}
              onClick={() => onChange(isActive ? null : option.value)}
            >
              <span className="udb-check-filter__box udb-check-filter__box--radio" aria-hidden="true">
                {isActive && <span className="udb-check-filter__radio-dot" />}
              </span>
              <span className="udb-check-filter__label">{option.label}</span>
              {option.count !== undefined && <span className="udb-check-filter__count">{option.count}</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
