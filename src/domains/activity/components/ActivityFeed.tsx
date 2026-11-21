import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { EmptyState } from '@umituz/web-design-system/organisms';
import { Avatar } from '@umituz/web-design-system/molecules';
import { cn } from '@umituz/web-design-system/utils';
import type { ActivityFeedProps, ActivityItem, ActivityTarget } from '../types';
import { formatActivityRelativeTime, groupActivitiesByDay, toDate } from '../utils';

function renderActor(actor: ActivityItem['actor']) {
  if (!actor) return null;
  if (typeof actor === 'string') {
    return <span className="udb-activity-actor">{actor}</span>;
  }
  return (
    <span className="udb-activity-actor" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Avatar name={actor.name} size="xs" />
      <span>{actor.name}</span>
    </span>
  );
}

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

export function ActivityFeed<T = unknown>({
  items,
  groupByDay = true,
  density = 'normal',
  emptyTitle = 'No activity yet',
  emptyDescription = 'Events and actions will appear here as they happen.',
  emptyIcon,
  onItemClick,
  className,
}: ActivityFeedProps<T>) {
  const groups = useMemo(() => {
    if (!groupByDay) return [];
    return groupActivitiesByDay(items);
  }, [items, groupByDay]);

  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
      />
    );
  }

  function renderFeedItem(item: ActivityItem<T>) {
    const d = toDate(item.timestamp);
    const relTime = formatActivityRelativeTime(d);
    const fullTime = d.toLocaleString();

    return (
      <article
        key={item.id}
        className={cn(
          'udb-activity-item',
          density === 'dense' && 'udb-activity-item--dense',
          Boolean(onItemClick) && 'udb-activity-item--clickable',
        )}
        onClick={() => onItemClick?.(item)}
      >
        {item.icon && (
          <span
            className={cn(
              'udb-activity-icon',
              item.tone && `udb-activity-tone--${item.tone}`,
            )}
            aria-hidden="true"
          >
            {item.icon}
          </span>
        )}

        <div className="udb-activity-body">
          <div className="udb-activity-title-row">
            <span className="udb-activity-title">{item.title}</span>
            {item.badge}
          </div>

          {item.description && <p className="udb-activity-desc">{item.description}</p>}

          <div className="udb-activity-meta-row">
            {renderActor(item.actor)}
            {item.actor && item.target && <span className="udb-activity-dot" aria-hidden="true">·</span>}
            {renderTarget(item.target)}
            {(item.actor || item.target) && <span className="udb-activity-dot" aria-hidden="true">·</span>}
            <time dateTime={d.toISOString()} title={fullTime}>
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
      </article>
    );
  }

  return (
    <div className={cn('udb-activity-feed', className)} role="feed" aria-label="Activity feed">
      {groupByDay ? (
        groups.map((group) => (
          <section key={group.dateKey} className="udb-activity-day-group">
            <header className="udb-activity-day-header">{group.label}</header>
            {group.items.map(renderFeedItem)}
          </section>
        ))
      ) : (
        items.map(renderFeedItem)
      )}
    </div>
  );
}
