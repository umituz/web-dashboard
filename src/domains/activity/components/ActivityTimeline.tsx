import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { EmptyState } from '@umituz/web-design-system/organisms';
import { cn } from '@umituz/web-design-system/utils';
import type { ActivityItem, ActivityTarget, ActivityTimelineProps } from '../types';
import { formatActivityRelativeTime, groupActivitiesByDay, toDate } from '../utils';

function renderTarget(target: ActivityItem['target']) {
  if (!target) return null;
  if (typeof target === 'object' && 'label' in target && !('type' in (target as object))) {
    const t = target as ActivityTarget;
    if (t.href) {
      return (
        <a href={t.href} className="udb-activity-target">
          {t.label}
        </a>
      );
    }
    return <span className="udb-activity-target">{t.label}</span>;
  }
  return <span className="udb-activity-target">{target as ReactNode}</span>;
}

export function ActivityTimeline<T = unknown>({
  items,
  groupByDay = false,
  density = 'normal',
  emptyTitle = 'No activity recorded',
  emptyDescription = 'Events appear here as work progresses.',
  emptyIcon,
  newestFirst = true,
  onItemClick,
  className,
}: ActivityTimelineProps<T>) {
  const sortedItems = useMemo(() => {
    const arr = [...items];
    return arr.sort((a, b) => {
      const ta = toDate(a.timestamp).getTime();
      const tb = toDate(b.timestamp).getTime();
      return newestFirst ? tb - ta : ta - tb;
    });
  }, [items, newestFirst]);

  const groups = useMemo(() => {
    if (!groupByDay) return [];
    return groupActivitiesByDay(sortedItems);
  }, [sortedItems, groupByDay]);

  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
      />
    );
  }

  function renderTimelineItem(item: ActivityItem<T>) {
    const d = toDate(item.timestamp);
    const relTime = formatActivityRelativeTime(d);
    const actorName = typeof item.actor === 'string' ? item.actor : item.actor?.name;

    return (
      <div
        key={item.id}
        className={cn(
          'udb-activity-timeline-item',
          density === 'dense' && 'udb-activity-timeline-item--dense',
          Boolean(onItemClick) && 'udb-activity-item--clickable',
        )}
        onClick={() => onItemClick?.(item)}
      >
        <span className="udb-activity-timeline-rail" aria-hidden="true" />
        <span
          className={cn(
            'udb-activity-timeline-marker',
            item.tone && `udb-activity-tone--${item.tone}`,
          )}
          aria-hidden="true"
        >
          {item.icon ?? <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }} />}
        </span>

        <div className="udb-activity-timeline-content">
          <div className="udb-activity-title-row">
            <span className="udb-activity-title">{item.title}</span>
            {item.badge}
          </div>

          {item.description && <p className="udb-activity-desc">{item.description}</p>}

          <div className="udb-activity-meta-row">
            {actorName && <span className="udb-activity-actor">{actorName}</span>}
            {actorName && item.target && <span className="udb-activity-dot" aria-hidden="true">·</span>}
            {renderTarget(item.target)}
            {(actorName || item.target) && <span className="udb-activity-dot" aria-hidden="true">·</span>}
            <time dateTime={d.toISOString()} title={d.toLocaleString()}>
              {relTime}
            </time>
            {item.meta && (
              <>
                <span className="udb-activity-dot" aria-hidden="true">·</span>
                <span>{item.meta}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('udb-activity-timeline', className)} role="region" aria-label="Activity timeline">
      {groupByDay ? (
        groups.map((group) => (
          <section key={group.dateKey} className="udb-activity-day-group">
            <header className="udb-activity-day-header">{group.label}</header>
            {group.items.map(renderTimelineItem)}
          </section>
        ))
      ) : (
        sortedItems.map(renderTimelineItem)
      )}
    </div>
  );
}
