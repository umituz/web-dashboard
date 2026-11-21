import type { ReactNode } from 'react';
import { Badge, Button } from '@umituz/web-design-system/atoms';
import { formatDate } from '@umituz/web-design-system/utils';
import type {
  CalendarPageItem,
  CalendarPageLabels,
  CalendarSelectedDayConfig,
} from '../types';

const formatTime = (minutes?: number): string => {
  if (minutes === undefined || minutes === null) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export interface CalendarSelectedDayPanelProps<T = unknown> {
  config: CalendarSelectedDayConfig<T>;
  dayKey: string;
  items: readonly CalendarPageItem<T>[];
  labels?: CalendarPageLabels;
  onSelectItem?: (item: CalendarPageItem<T>) => void;
}

export function CalendarSelectedDayPanel<T = unknown>({
  config,
  dayKey,
  items,
  labels,
  onSelectItem,
}: CalendarSelectedDayPanelProps<T>): ReactNode {
  return (
    <section
      className="udb-cal-selected-card"
      data-testid="calendar-selected-day-panel"
      aria-label="Selected day events"
    >
      <header className="udb-cal-selected-header">
        <div className="udb-cal-selected-header-left">
          <span className="udb-cal-selected-eyebrow">
            {labels?.selectedDay ?? 'Selected Day'}
          </span>
          <span className="udb-cal-selected-title">
            {config.title ? config.title(dayKey) : formatDate(dayKey, 'medium')}
          </span>
          <span className="udb-cal-count">
            {labels?.eventsCount ? labels.eventsCount(items.length) : items.length}
          </span>
        </div>
        {config.action && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => config.action!.onClick(dayKey)}
          >
            {config.action.label}
          </Button>
        )}
      </header>

      {items.length === 0 ? (
        config.renderEmpty ? (
          config.renderEmpty(dayKey)
        ) : (
          <div className="udb-cal-empty">
            {config.emptyText ??
              labels?.noEvents ??
              'No events scheduled for this day'}
          </div>
        )
      ) : (
        <ul className="udb-cal-feed-list">
          {items.map((item) => (
            <li key={item.id}>
              {config.renderItem ? (
                config.renderItem(item)
              ) : onSelectItem ? (
                <button
                  type="button"
                  onClick={() => onSelectItem(item)}
                  className={`udb-cal-feed-item udb-cal-feed-btn${item.muted ? ' is-muted' : ''}`}
                >
                  <span
                    className={`ds-cal-legend-dot ds-cal-dot--${item.tone ?? 'primary'}`}
                    aria-hidden
                  />
                  <span className="udb-cal-feed-body">
                    <span className="udb-cal-feed-title">{item.title}</span>
                    {item.meta && (
                      <span className="udb-cal-feed-meta">{item.meta}</span>
                    )}
                  </span>
                  <span className="udb-cal-feed-end">
                    {item.startMin !== undefined && (
                      <span>
                        {item.endMin !== undefined
                          ? `${formatTime(item.startMin)} - ${formatTime(item.endMin)}`
                          : formatTime(item.startMin)}
                      </span>
                    )}
                    {item.kind && <Badge variant="neutral">{item.kind}</Badge>}
                  </span>
                </button>
              ) : (
                <div
                  className={`udb-cal-feed-item${item.muted ? ' is-muted' : ''}`}
                >
                  <span
                    className={`ds-cal-legend-dot ds-cal-dot--${item.tone ?? 'primary'}`}
                    aria-hidden
                  />
                  <div className="udb-cal-feed-body">
                    <div className="udb-cal-feed-title">{item.title}</div>
                    {item.meta && (
                      <div className="udb-cal-feed-meta">{item.meta}</div>
                    )}
                  </div>
                  <div className="udb-cal-feed-end">
                    {item.startMin !== undefined && (
                      <span>
                        {item.endMin !== undefined
                          ? `${formatTime(item.startMin)} - ${formatTime(item.endMin)}`
                          : formatTime(item.startMin)}
                      </span>
                    )}
                    {item.kind && <Badge variant="neutral">{item.kind}</Badge>}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
