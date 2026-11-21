import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { PageHeader } from '@umituz/web-design-system/templates';
import { Calendar } from '@umituz/web-design-system/organisms';
import { Button } from '@umituz/web-design-system/atoms';
import { todayKey } from '@umituz/web-design-system/utils';
import type {
  CalendarCategory,
  CalendarPageAction,
  CalendarPageItem,
  CalendarPageProps,
  CalendarScreenView,
  CalendarSelectedDayConfig,
} from '../types';
import { CalendarSelectedDayPanel } from './CalendarSelectedDayPanel';

const matchesCategory = (
  item: CalendarPageItem<unknown>,
  cat: CalendarCategory,
): boolean => {
  if (cat.match) return cat.match(item);
  if (item.category === cat.id) return true;
  if (item.kind === cat.id) return true;
  if (item.tone === cat.id) return true;
  const payload = item.payload as Record<string, unknown> | null | undefined;
  if (payload && typeof payload === 'object') {
    if (payload.kind === cat.id) return true;
    if (payload.type === cat.id) return true;
    if (payload.category === cat.id) return true;
  }
  if (cat.tone && item.tone === cat.tone) return true;
  return false;
};

export function CalendarPage<T = unknown>({
  title,
  subtitle,
  kicker,
  actions,
  callout,
  items,
  categories,
  categoryMode = 'multiple',
  activeCategoryIds,
  onActiveCategoriesChange,
  views,
  defaultView,
  view,
  onViewChange,
  cursor,
  initialCursor,
  onCursorChange,
  selectedDay,
  initialSelectedDay,
  onSelectDay,
  selectedDayDetail,
  onSelectItem,
  onSlotClick,
  weekStartsOn = 1,
  dayStartMin,
  dayEndMin,
  maxPerDay,
  agendaDays,
  locale,
  labels,
  toolbarExtra,
  footer,
  children,
  className,
}: CalendarPageProps<T>): ReactNode {
  const [internalView, setInternalView] = useState<CalendarScreenView>(
    () => defaultView ?? 'month',
  );
  const currentView = view ?? internalView;
  const handleViewChange = useCallback(
    (nextView: CalendarScreenView) => {
      if (onViewChange) {
        onViewChange(nextView);
      }
      setInternalView(nextView);
    },
    [onViewChange],
  );

  const [internalCategoryIds, setInternalCategoryIds] = useState<readonly string[]>(() =>
    categories ? categories.map((c) => c.id) : [],
  );
  const activeIds = activeCategoryIds ?? internalCategoryIds;
  const activeSet = useMemo(() => new Set(activeIds), [activeIds]);

  const isAllActive =
    !categories || categories.length === 0 || activeIds.length === categories.length;

  const handleCategoryToggle = (catId: string) => {
    let next: string[];
    if (categoryMode === 'single') {
      const isCurrentlySingle = activeIds.length === 1 && activeIds[0] === catId;
      next = isCurrentlySingle ? (categories ?? []).map((c) => c.id) : [catId];
    } else {
      const set = new Set(activeIds);
      if (set.has(catId)) {
        set.delete(catId);
      } else {
        set.add(catId);
      }
      next = Array.from(set);
    }
    if (onActiveCategoriesChange) {
      onActiveCategoriesChange(next);
    } else {
      setInternalCategoryIds(next);
    }
  };

  const handleSelectAllCategories = () => {
    const allIds = (categories ?? []).map((c) => c.id);
    if (onActiveCategoriesChange) {
      onActiveCategoriesChange(allIds);
    } else {
      setInternalCategoryIds(allIds);
    }
  };

  const categoryCounts = useMemo(() => {
    if (!categories) return new Map<string, number>();
    const counts = new Map<string, number>();
    for (const cat of categories) {
      const count = items.filter((item) => matchesCategory(item, cat)).length;
      counts.set(cat.id, count);
    }
    return counts;
  }, [categories, items]);

  const filteredItems = useMemo(() => {
    if (!categories || categories.length === 0 || isAllActive) {
      return items;
    }
    const activeCats = categories.filter((c) => activeSet.has(c.id));
    return items.filter((item) => activeCats.some((cat) => matchesCategory(item, cat)));
  }, [items, categories, isAllActive, activeSet]);

  const [internalSelectedDay, setInternalSelectedDay] = useState<string>(() =>
    initialSelectedDay ?? initialCursor ?? todayKey(),
  );
  const currentSelectedDay = selectedDay !== undefined ? selectedDay : internalSelectedDay;

  const handleSelectDay = useCallback(
    (dayKey: string) => {
      if (onSelectDay) {
        onSelectDay(dayKey);
      }
      setInternalSelectedDay(dayKey);
    },
    [onSelectDay],
  );

  const detailConfig: CalendarSelectedDayConfig<T> | null = useMemo(() => {
    if (!selectedDayDetail) return null;
    if (typeof selectedDayDetail === 'boolean') return {};
    return selectedDayDetail;
  }, [selectedDayDetail]);

  const selectedDayItems = useMemo(() => {
    if (!currentSelectedDay) return [];
    return filteredItems.filter((item) => item.dayKey === currentSelectedDay);
  }, [filteredItems, currentSelectedDay]);

  const renderedActions = useMemo(() => {
    if (!actions) return undefined;
    if (Array.isArray(actions)) {
      return (
        <div className="flex items-center gap-2">
          {actions.map((act) => (
            <Button
              key={act.label}
              variant={act.variant ?? 'outline'}
              onClick={act.onClick}
              disabled={act.disabled}
              size="sm"
            >
              {act.icon}
              {act.label}
            </Button>
          ))}
        </div>
      );
    }
    if (
      typeof actions === 'object' &&
      actions !== null &&
      'onClick' in actions &&
      'label' in actions
    ) {
      const act = actions as CalendarPageAction;
      return (
        <Button
          variant={act.variant ?? 'primary'}
          onClick={act.onClick}
          disabled={act.disabled}
          size="sm"
        >
          {act.icon}
          {act.label}
        </Button>
      );
    }
    return actions as ReactNode;
  }, [actions]);

  return (
    <div className={`udb-cal-page ${className ?? ''}`.trim()}>
      <PageHeader
        kicker={kicker}
        title={title}
        subtitle={subtitle}
        actions={renderedActions}
      />

      {callout && <div className="udb-cal-callout">{callout}</div>}

      {categories && categories.length > 0 && (
        <div className="udb-cal-legend" role="toolbar" aria-label="Filter by category">
          <button
            type="button"
            className={`udb-cal-chip${isAllActive ? ' is-active' : ''}`}
            onClick={handleSelectAllCategories}
            aria-pressed={isAllActive}
          >
            <span>{labels?.allCategories ?? 'All'}</span>
            <span className="udb-cal-count">{items.length}</span>
          </button>
          {categories.map((cat) => {
            const isActive = activeSet.has(cat.id);
            const count = categoryCounts.get(cat.id) ?? 0;
            return (
              <button
                key={cat.id}
                type="button"
                className={`udb-cal-chip${isActive ? ' is-active' : ''}`}
                onClick={() => handleCategoryToggle(cat.id)}
                aria-pressed={isActive}
              >
                <span
                  className={`ds-cal-legend-dot ds-cal-dot--${cat.tone ?? 'primary'}`}
                  aria-hidden
                />
                {cat.icon}
                <span>{cat.label}</span>
                <span className="udb-cal-count">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="udb-cal-card">
        <Calendar
          items={filteredItems}
          views={views}
          view={currentView}
          onViewChange={handleViewChange}
          cursor={cursor}
          initialCursor={initialCursor}
          onCursorChange={onCursorChange}
          weekStartsOn={weekStartsOn}
          dayStartMin={dayStartMin}
          dayEndMin={dayEndMin}
          maxPerDay={maxPerDay}
          agendaDays={agendaDays}
          locale={locale}
          labels={labels}
          toolbarExtra={toolbarExtra}
          onSelectItem={
            onSelectItem
              ? (item) => onSelectItem(item as CalendarPageItem<T>)
              : undefined
          }
          onSelectDay={handleSelectDay}
          onSlotClick={onSlotClick}
        />
      </div>

      {detailConfig && currentSelectedDay && (
        <CalendarSelectedDayPanel
          config={detailConfig}
          dayKey={currentSelectedDay}
          items={selectedDayItems}
          labels={labels}
          onSelectItem={onSelectItem}
        />
      )}

      {footer && <div className="udb-cal-footer">{footer}</div>}
      {children}
    </div>
  );
}
