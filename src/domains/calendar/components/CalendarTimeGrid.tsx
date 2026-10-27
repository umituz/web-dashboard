import { useMemo } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import {
  DEFAULT_CALENDAR_LABELS,
  type CalendarItem,
  type CalendarLabels,
} from '../types/view.types';
import {
  DEFAULT_DAY_END_MIN,
  DEFAULT_DAY_START_MIN,
  SLOT_QUANTUM_MIN,
  eventGeometry,
  formatDayNumber,
  formatWeekdayShort,
  groupByDayKey,
  itemSpan,
  layoutColumns,
  minutesToLabel,
  todayKey,
} from '../utils/layout';

export interface CalendarTimeGridProps {
  items: readonly CalendarItem[];
  days: readonly string[];
  dayStartMin?: number;
  dayEndMin?: number;
  locale?: string;
  labels?: Partial<CalendarLabels>;
  emptyState?: ReactNode;
  onSelectItem?: (item: CalendarItem) => void;
  onSlotClick?: (dayKey: string, minutes: number) => void;
}

export const CalendarTimeGrid = ({
  items,
  days,
  dayStartMin = DEFAULT_DAY_START_MIN,
  dayEndMin = DEFAULT_DAY_END_MIN,
  locale = 'en-US',
  labels,
  emptyState,
  onSelectItem,
  onSlotClick,
}: CalendarTimeGridProps) => {
  const text = { ...DEFAULT_CALENDAR_LABELS, ...labels };
  const today = todayKey();
  const total = Math.max(dayEndMin - dayStartMin, 60);

  const hours = useMemo(() => {
    const first = Math.ceil(dayStartMin / 60) * 60;
    const list: number[] = [];
    for (let minute = first; minute < dayEndMin; minute += 60) list.push(minute);
    return list;
  }, [dayStartMin, dayEndMin]);

  const timed = useMemo(() => items.filter((item) => item.startMin !== undefined), [items]);
  const untimed = useMemo(() => items.filter((item) => item.startMin === undefined), [items]);
  const timedByDay = useMemo(() => groupByDayKey(timed), [timed]);
  const untimedByDay = useMemo(() => groupByDayKey(untimed), [untimed]);
  const hasAllDay = days.some((dayKey) => (untimedByDay.get(dayKey)?.length ?? 0) > 0);

  const positionOf = (minute: number): string =>
    `${((minute - dayStartMin) / total) * 100}%`;

  const handleLaneClick = (dayKey: string, event: MouseEvent<HTMLDivElement>) => {
    if (!onSlotClick) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.height <= 0) return;
    const ratio = (event.clientY - bounds.top) / bounds.height;
    const raw = dayStartMin + ratio * total;
    const quantized = Math.floor(raw / SLOT_QUANTUM_MIN) * SLOT_QUANTUM_MIN;
    if (quantized >= dayStartMin && quantized < dayEndMin) onSlotClick(dayKey, quantized);
  };

  return (
    <div
      className="udb-cal-grid"
      style={{ ['--udb-cal-days' as string]: days.length } as CSSProperties}
    >
      <div className="udb-cal-days">
        <span className="udb-cal-days-corner" />
        {days.map((dayKey) => (
          <div
            className={dayKey === today ? 'udb-cal-day-head is-today' : 'udb-cal-day-head'}
            key={dayKey}
          >
            <span className="udb-cal-weekday">{formatWeekdayShort(dayKey, locale)}</span>
            <span className="udb-cal-daynum">{formatDayNumber(dayKey)}</span>
          </div>
        ))}
      </div>

      {hasAllDay && (
        <div className="udb-cal-allday">
          <span className="udb-cal-allday-corner">{text.allDay}</span>
          {days.map((dayKey) => (
            <div className="udb-cal-allday-cell" key={dayKey}>
              {(untimedByDay.get(dayKey) ?? []).map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={
                    item.muted
                      ? `udb-cal-chip udb-cal-chip--${item.tone ?? 'primary'} is-muted`
                      : `udb-cal-chip udb-cal-chip--${item.tone ?? 'primary'}`
                  }
                  onClick={() => onSelectItem?.(item)}
                >
                  {item.icon}
                  <span className="udb-cal-chip-title">{item.title}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="udb-cal-gutter" aria-hidden="true">
        {hours.map((minute) => (
          <div className="udb-cal-hour-label" style={{ top: positionOf(minute) }} key={minute}>
            {minutesToLabel(minute)}
          </div>
        ))}
      </div>

      {days.map((dayKey) => {
        const laneItems = timedByDay.get(dayKey) ?? [];
        const dayCount = laneItems.length + (untimedByDay.get(dayKey)?.length ?? 0);
        return (
          <section className="udb-cal-day" aria-label={dayKey} key={dayKey}>
            <div
              className="udb-cal-lane"
              role="grid"
              aria-label={dayKey}
              onClick={(event) => handleLaneClick(dayKey, event)}
            >
              {hours.map((minute) => (
                <div
                  className="udb-cal-hour-line"
                  style={{ top: positionOf(minute) }}
                  key={minute}
                />
              ))}
              {layoutColumns(laneItems).map(({ item, column, columns }) => {
                const geometry = eventGeometry(item, dayStartMin, dayEndMin);
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={
                      item.muted
                        ? `udb-cal-event udb-cal-event--${item.tone ?? 'primary'} is-muted`
                        : `udb-cal-event udb-cal-event--${item.tone ?? 'primary'}`
                    }
                    style={{
                      top: `${geometry.top}%`,
                      height: `${geometry.height}%`,
                      left: `calc(${(column / columns) * 100}% + 2px)`,
                      width: `calc(${100 / columns}% - 4px)`,
                    }}
                    onClick={(click) => {
                      click.stopPropagation();
                      onSelectItem?.(item);
                    }}
                  >
                    <span className="udb-cal-event-time">
                      {minutesToLabel(itemSpan(item).startMin)}
                    </span>
                    <span className="udb-cal-event-title">{item.title}</span>
                    {item.meta}
                  </button>
                );
              })}
              {days.length === 1 && dayCount === 0 &&
                (emptyState ?? <p className="udb-cal-empty">{text.emptyDay}</p>)}
            </div>
          </section>
        );
      })}
    </div>
  );
};
