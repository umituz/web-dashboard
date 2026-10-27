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
  itemSpan,
  layoutColumns,
  minutesToLabel,
} from '../utils/layout';

export interface CalendarResource {
  id: string;
  label: ReactNode;
  meta?: ReactNode;
}

export interface CalendarResourceTimelineProps {
  resources: readonly CalendarResource[];
  items: readonly CalendarItem[];
  dayStartMin?: number;
  dayEndMin?: number;
  labels?: Partial<CalendarLabels>;
  emptyState?: ReactNode;
  onSelectItem?: (item: CalendarItem) => void;
  onSlotClick?: (resourceId: string, minutes: number) => void;
  className?: string;
}

export const CalendarResourceTimeline = ({
  resources,
  items,
  dayStartMin = DEFAULT_DAY_START_MIN,
  dayEndMin = DEFAULT_DAY_END_MIN,
  labels,
  emptyState,
  onSelectItem,
  onSlotClick,
  className,
}: CalendarResourceTimelineProps) => {
  const text = { ...DEFAULT_CALENDAR_LABELS, ...labels };
  const total = Math.max(dayEndMin - dayStartMin, 60);

  const hours = useMemo(() => {
    const first = Math.ceil(dayStartMin / 60) * 60;
    const list: number[] = [];
    for (let minute = first; minute < dayEndMin; minute += 60) list.push(minute);
    return list;
  }, [dayStartMin, dayEndMin]);

  const byResource = useMemo(() => {
    const known = new Set(resources.map((resource) => resource.id));
    const map = new Map<string, CalendarItem[]>();
    for (const item of items) {
      if (!item.resourceId || !known.has(item.resourceId) || item.startMin === undefined) continue;
      const bucket = map.get(item.resourceId);
      if (bucket) bucket.push(item);
      else map.set(item.resourceId, [item]);
    }
    return map;
  }, [items, resources]);

  const scheduled = useMemo(
    () => [...byResource.values()].reduce((sum, bucket) => sum + bucket.length, 0),
    [byResource],
  );

  const fractionOf = (minute: number): number =>
    Math.max((minute - dayStartMin) / total, 0);

  const handleLaneClick = (resourceId: string, event: MouseEvent<HTMLDivElement>) => {
    if (!onSlotClick) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width <= 0) return;
    const ratio = (event.clientX - bounds.left) / bounds.width;
    const raw = dayStartMin + ratio * total;
    const quantized = Math.floor(raw / SLOT_QUANTUM_MIN) * SLOT_QUANTUM_MIN;
    if (quantized >= dayStartMin && quantized < dayEndMin) onSlotClick(resourceId, quantized);
  };

  const axisStyle = (minute: number): CSSProperties => ({ left: `${fractionOf(minute) * 100}%` });

  return (
    <div className={className ? `udb-cal-res ${className}` : 'udb-cal-res'}>
      {resources.length > 0 && scheduled > 0 && (
        <>
          <div className="udb-cal-res-axis" aria-hidden="true">
            {hours.map((minute) => (
              <span className="udb-cal-res-axis-label" style={axisStyle(minute)} key={minute}>
                {minutesToLabel(minute)}
              </span>
            ))}
          </div>
          <div className="udb-cal-res-body">
            {resources.map((resource) => {
              const rowItems = byResource.get(resource.id) ?? [];
              return (
                <div className="udb-cal-res-row" key={resource.id}>
                  <div className="udb-cal-res-label">
                    <span className="udb-cal-res-name">{resource.label}</span>
                    {resource.meta && <span className="udb-cal-res-meta">{resource.meta}</span>}
                  </div>
                  <div
                    className="udb-cal-res-lane"
                    onClick={(event) => handleLaneClick(resource.id, event)}
                  >
                    {hours.map((minute) => (
                      <span className="udb-cal-res-hour" style={axisStyle(minute)} key={minute} />
                    ))}
                    {layoutColumns(rowItems).map(({ item, column, columns }) => {
                      const span = itemSpan(item);
                      const start = fractionOf(Math.max(span.startMin, dayStartMin)) * 100;
                      const width =
                        Math.max(
                          (Math.min(span.endMin, dayEndMin) - Math.max(span.startMin, dayStartMin)) /
                            total,
                          0.04,
                        ) * 100;
                      return (
                        <button
                          type="button"
                          key={item.id}
                          className={
                            item.muted
                              ? `udb-cal-res-block udb-cal-res-block--${item.tone ?? 'primary'} is-muted`
                              : `udb-cal-res-block udb-cal-res-block--${item.tone ?? 'primary'}`
                          }
                          style={{
                            left: `calc(${start + width * (column / columns)}% + 2px)`,
                            width: `calc(${width / columns}% - 4px)`,
                          }}
                          onClick={(click) => {
                            click.stopPropagation();
                            onSelectItem?.(item);
                          }}
                        >
                          <span className="udb-cal-res-block-time">
                            {minutesToLabel(span.startMin)}
                          </span>
                          <span className="udb-cal-res-block-title">{item.title}</span>
                          {item.meta}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {(resources.length === 0 || scheduled === 0) && (
        <div className="udb-cal-res-empty">
          {emptyState ?? <p className="udb-cal-res-empty-text">{text.emptyDay}</p>}
        </div>
      )}
    </div>
  );
};
