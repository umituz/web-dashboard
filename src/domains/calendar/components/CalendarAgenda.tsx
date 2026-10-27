import { useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  DEFAULT_CALENDAR_LABELS,
  type CalendarItem,
  type CalendarLabels,
} from '../types/view.types';
import {
  addDaysKey,
  formatDayTitle,
  groupByDayKey,
  minutesToLabel,
  todayKey,
} from '../utils/layout';

export interface CalendarAgendaProps {
  items: readonly CalendarItem[];
  anchorKey: string;
  agendaDays?: number;
  locale?: string;
  labels?: Partial<CalendarLabels>;
  emptyState?: ReactNode;
  onSelectItem?: (item: CalendarItem) => void;
}

export const CalendarAgenda = ({
  items,
  anchorKey,
  agendaDays = 30,
  locale = 'en-US',
  labels,
  emptyState,
  onSelectItem,
}: CalendarAgendaProps) => {
  const text = { ...DEFAULT_CALENDAR_LABELS, ...labels };
  const today = todayKey();
  const windowDays = Math.max(agendaDays, 1);

  const groups = useMemo(() => {
    const byDay = groupByDayKey(items);
    const window: { dayKey: string; dayItems: CalendarItem[] }[] = [];
    for (let offset = 0; offset < windowDays; offset += 1) {
      const dayKey = addDaysKey(anchorKey, offset);
      const dayItems = byDay.get(dayKey);
      if (dayItems && dayItems.length > 0) window.push({ dayKey, dayItems });
    }
    return window;
  }, [items, anchorKey, windowDays]);

  if (groups.length === 0) {
    return (
      <div className="udb-cal-agenda-empty">
        {emptyState ?? <p className="udb-cal-agenda-empty-text">{text.emptyDay}</p>}
      </div>
    );
  }

  return (
    <div className="udb-cal-agenda">
      {groups.map(({ dayKey, dayItems }) => (
        <section
          className={
            dayKey === today ? 'udb-cal-agenda-group is-today' : 'udb-cal-agenda-group'
          }
          key={dayKey}
        >
          <header className="udb-cal-agenda-head">
            <span className="udb-cal-agenda-date">{formatDayTitle(dayKey, locale)}</span>
            {dayKey === today && <span className="udb-cal-agenda-today">{text.today}</span>}
            <span className="udb-cal-agenda-count">{dayItems.length}</span>
          </header>
          <div className="udb-cal-agenda-rows">
            {dayItems.map((item) => (
              <button
                type="button"
                key={item.id}
                className={
                  item.muted
                    ? `udb-cal-agenda-item udb-cal-agenda-item--${item.tone ?? 'primary'} is-muted`
                    : `udb-cal-agenda-item udb-cal-agenda-item--${item.tone ?? 'primary'}`
                }
                onClick={() => onSelectItem?.(item)}
              >
                <span className="udb-cal-agenda-time">
                  {item.startMin !== undefined && minutesToLabel(item.startMin)}
                  {item.endMin !== undefined && (
                    <span className="udb-cal-agenda-time-end">– {minutesToLabel(item.endMin)}</span>
                  )}
                </span>
                <span className={`udb-cal-dot udb-cal-dot--${item.tone ?? 'primary'}`} />
                <span className="udb-cal-agenda-body">
                  <span className="udb-cal-agenda-title">
                    {item.icon}
                    {item.title}
                  </span>
                  {item.meta && <span className="udb-cal-agenda-meta">{item.meta}</span>}
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
