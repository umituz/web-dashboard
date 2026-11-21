import { FilterSelect } from '@umituz/web-design-system/molecules';
import { cn } from '@umituz/web-design-system/utils';
import type { DataToolbarProps } from '../types';

export function DataToolbar({
  search,
  filters,
  activeFilters,
  onClearAllFilters,
  count,
  viewSwitcher,
  actions,
  children,
  className,
}: DataToolbarProps) {
  const countLabel = (() => {
    if (count === undefined) return null;
    if (typeof count === 'number') return `${count}`;
    if (count.total !== undefined) return `${count.shown} of ${count.total}`;
    return `${count.shown}`;
  })();

  return (
    <div className={cn('udb-data-toolbar', className)}>
      <div className="udb-data-toolbar__main">
        {search && (
          <div className="udb-data-toolbar__search">
            <input
              type="search"
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              placeholder={search.placeholder ?? 'Search…'}
              className="w-full h-8 px-3 text-xs rounded-md border border-line-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {filters && filters.length > 0 && (
          <div className="udb-data-toolbar__filters">
            {filters.map((f) => (
              <FilterSelect
                key={f.id}
                value={f.value}
                onChange={f.onChange}
                options={f.options}
                ariaLabel={f.label}
                allLabel={f.allLabel ?? 'All'}
              />
            ))}
          </div>
        )}

        {children}

        <div className="udb-data-toolbar__right">
          {actions}

          {viewSwitcher && (
            <div className="udb-data-toolbar__view-switcher" role="radiogroup" aria-label="View mode">
              {viewSwitcher.options.map((opt) => {
                const isActive = opt.id === viewSwitcher.current;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => viewSwitcher.onChange(opt.id)}
                    className={cn(
                      'udb-data-toolbar__view-button',
                      isActive && 'udb-data-toolbar__view-button--active',
                    )}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {countLabel && (
            <span className="udb-data-toolbar__count" data-testid="data-toolbar-count">
              {countLabel}
            </span>
          )}
        </div>
      </div>

      {activeFilters && activeFilters.length > 0 && (
        <div className="udb-data-toolbar__chips">
          {activeFilters.map((chip) => (
            <span key={chip.id} className="udb-data-toolbar__chip">
              <span className="text-muted-foreground">{chip.label}:</span>
              <strong className="font-medium text-foreground">{chip.valueLabel}</strong>
              <button
                type="button"
                onClick={chip.onRemove}
                className="udb-data-toolbar__chip-remove"
                aria-label={`Remove filter ${chip.label}`}
              >
                ×
              </button>
            </span>
          ))}
          {onClearAllFilters && (
            <button
              type="button"
              onClick={onClearAllFilters}
              className="udb-data-toolbar__clear-all"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
