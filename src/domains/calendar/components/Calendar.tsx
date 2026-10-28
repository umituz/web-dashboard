import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, IconButton } from '@umituz/web-design-system/atoms';
import { Segmented } from '@umituz/web-design-system/molecules';
import {
  DEFAULT_CALENDAR_LABELS,
  type CalendarItem,
  type CalendarLabels,
  type CalendarLegendEntry,
  type CalendarScreenView,
} from '../types/view.types';
import {
  DEFAULT_DAY_END_MIN,
  DEFAULT_DAY_START_MIN,
  DEFAULT_MAX_PER_DAY,
  addDaysKey,
  addMonthsKey,
  formatAgendaTitle,
  formatDayTitle,
  formatMonthTitle,
  formatWeekTitle,
  todayKey,
  weekDays,
} from '../utils/layout';
import { CalendarAgenda } from './CalendarAgenda';
import { CalendarMonth } from './CalendarMonth';
import { CalendarTimeGrid } from './CalendarTimeGrid';

export interface CalendarProps {
  items: readonly CalendarItem[];
  view?: CalendarScreenView;
  onViewChange?: (view: CalendarScreenView) => void;
  cursor?: string;
  initialCursor?: string;
  onCursorChange?: (dayKey: string) => void;
  views?: readonly CalendarScreenView[];
  weekStartsOn?: 0 | 1;
  dayStartMin?: number;
  dayEndMin?: number;
  maxPerDay?: number;
  agendaDays?: number;
  locale?: string;
  labels?: Partial<CalendarLabels>;
  legend?: readonly CalendarLegendEntry[];
  toolbarExtra?: ReactNode;
  emptyState?: ReactNode;
  onSelectItem?: (item: CalendarItem) => void;
  onSelectDay?: (dayKey: string) => void;
  onSlotClick?: (dayKey: string, minutes: number) => void;
  className?: string;
}

export const Calendar = ({
  items,
  view,
  onViewChange,
  cursor,
  initialCursor,
  onCursorChange,
  views = ['month', 'week', 'day'],
  weekStartsOn = 1,
  dayStartMin = DEFAULT_DAY_START_MIN,
  dayEndMin = DEFAULT_DAY_END_MIN,
  maxPerDay = DEFAULT_MAX_PER_DAY,
  agendaDays = 30,
  locale = 'en-US',
  labels,
  legend,
  toolbarExtra,
  emptyState,
  onSelectItem,
  onSelectDay,
  onSlotClick,
  className,
}: CalendarProps) => {
  const text = { ...DEFAULT_CALENDAR_LABELS, ...labels };
  const [innerView, setInnerView] = useState<CalendarScreenView>(views[0] ?? 'month');
  const [innerCursor, setInnerCursor] = useState(() => cursor ?? initialCursor ?? todayKey());
  const activeView = view ?? innerView;
  const activeCursor = cursor ?? innerCursor;

  const applyView = (next: CalendarScreenView) => {
    setInnerView(next);
    onViewChange?.(next);
  };

  const applyCursor = (next: string) => {
    setInnerCursor(next);
    onCursorChange?.(next);
  };

  const shift = (direction: number) => {
    if (activeView === 'month') applyCursor(addMonthsKey(activeCursor, direction));
    else if (activeView === 'week') applyCursor(addDaysKey(activeCursor, direction * 7));
    else if (activeView === 'agenda') applyCursor(addDaysKey(activeCursor, direction * agendaDays));
    else applyCursor(addDaysKey(activeCursor, direction));
  };

  const title = useMemo(() => {
    if (activeView === 'day') return formatDayTitle(activeCursor, locale);
    if (activeView === 'week') return formatWeekTitle(activeCursor, locale);
    if (activeView === 'agenda') return formatAgendaTitle(activeCursor, agendaDays, locale);
    return formatMonthTitle(activeCursor, locale);
  }, [activeView, activeCursor, agendaDays, locale]);

  const handleSelectDay = (dayKey: string) => {
    applyCursor(dayKey);
    if (activeView !== 'day' && views.includes('day')) applyView('day');
    onSelectDay?.(dayKey);
  };

  return (
    <div className={className ? `udb-cal ${className}` : 'udb-cal'}>
      <div className="udb-cal-toolbar">
        <div className="udb-cal-toolbar-nav">
          <IconButton
            icon={<ChevronLeft size={16} />}
            label={text.previous}
            size="sm"
            variant="outline"
            onClick={() => shift(-1)}
          />
          <IconButton
            icon={<ChevronRight size={16} />}
            label={text.next}
            size="sm"
            variant="outline"
            onClick={() => shift(1)}
          />
          <span className="udb-cal-title">{title}</span>
          <Button variant="ghost" size="sm" onClick={() => applyCursor(todayKey())}>
            {text.today}
          </Button>
        </div>
        <div className="udb-cal-toolbar-side">
          {toolbarExtra && <div className="udb-cal-extra">{toolbarExtra}</div>}
          {legend && legend.length > 0 && (
            <div className="udb-cal-legend">
              {legend.map((entry) => (
                <span className="udb-cal-legend-entry" key={entry.tone + entry.label}>
                  <span className={`udb-cal-legend-dot udb-cal-dot--${entry.tone}`} />
                  {entry.label}
                </span>
              ))}
            </div>
          )}
          <Segmented
            options={views.map((option) => ({ value: option, label: text[option] }))}
            value={activeView}
            onChange={(next) => applyView(next)}
            aria-label={text.month}
          />
        </div>
      </div>

      {activeView === 'month' && (
        <CalendarMonth
          items={items}
          anchorKey={activeCursor}
          weekStartsOn={weekStartsOn}
          locale={locale}
          maxPerDay={maxPerDay}
          labels={labels}
          onSelectDay={handleSelectDay}
          onSelectItem={onSelectItem}
        />
      )}

      {activeView === 'week' && (
        <CalendarTimeGrid
          items={items}
          days={weekDays(activeCursor, weekStartsOn)}
          dayStartMin={dayStartMin}
          dayEndMin={dayEndMin}
          locale={locale}
          labels={labels}
          emptyState={emptyState}
          onSelectItem={onSelectItem}
          onSlotClick={onSlotClick}
        />
      )}

      {activeView === 'day' && (
        <CalendarTimeGrid
          items={items}
          days={[activeCursor]}
          dayStartMin={dayStartMin}
          dayEndMin={dayEndMin}
          locale={locale}
          labels={labels}
          emptyState={emptyState}
          onSelectItem={onSelectItem}
          onSlotClick={onSlotClick}
        />
      )}

      {activeView === 'agenda' && (
        <CalendarAgenda
          items={items}
          anchorKey={activeCursor}
          agendaDays={agendaDays}
          locale={locale}
          labels={labels}
          emptyState={emptyState}
          onSelectItem={onSelectItem}
        />
      )}
    </div>
  );
};
