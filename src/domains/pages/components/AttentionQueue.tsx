import { Link } from 'react-router';
import { Badge, type BadgeVariant } from '@umituz/web-design-system/atoms';
import { EmptyState } from '@umituz/web-design-system/organisms';
import { cn } from '@umituz/web-design-system/utils';
import type { AttentionItem, AttentionQueueProps, StreakBadgeTone } from '../types';

function resolveBadgeTone(tone?: StreakBadgeTone): BadgeVariant | undefined {
  if (tone === 'muted') return 'neutral';
  return tone;
}

function renderItemContent(item: AttentionItem) {
  return (
    <>
      <div className="udb-attention-item-left">
        {item.icon && <span className="udb-attention-item-icon" aria-hidden="true">{item.icon}</span>}
        <div className="udb-attention-item-texts">
          <span className="udb-attention-item-title">{item.title}</span>
          {item.subtitle && <span className="udb-attention-item-sub">{item.subtitle}</span>}
        </div>
      </div>
      <div className="udb-attention-item-right">
        {item.badge && (
          <Badge tone={resolveBadgeTone(item.badge.tone) ?? 'warning'}>
            {item.badge.label}
          </Badge>
        )}
        {item.meta && <span className="udb-attention-item-meta">{item.meta}</span>}
      </div>
    </>
  );
}

export function AttentionQueue({
  items,
  emptyTitle = 'All clear',
  emptyDescription = 'No items require immediate attention.',
  density = 'normal',
  maxItems,
  onItemClick,
  className,
}: AttentionQueueProps) {
  const visibleItems = maxItems ? items.slice(0, maxItems) : items;

  if (visibleItems.length === 0) {
    return (
      <div className={cn('udb-attention-empty-wrap', className)}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className={cn('udb-attention-queue', density === 'dense' && 'udb-attention-queue--dense', className)} role="list">
      {visibleItems.map((item) => {
        const itemClass = cn(
          'udb-attention-item',
          (item.href || item.onClick || onItemClick) && 'is-clickable',
        );

        const handleClick = () => {
          item.onClick?.();
          onItemClick?.(item);
        };

        if (item.href) {
          try {
            return (
              <Link
                key={item.id}
                to={item.href}
                className={itemClass}
                onClick={handleClick}
                role="listitem"
              >
                {renderItemContent(item)}
              </Link>
            );
          } catch {
            return (
              <a
                key={item.id}
                href={item.href}
                className={itemClass}
                onClick={handleClick}
                role="listitem"
              >
                {renderItemContent(item)}
              </a>
            );
          }
        }

        return (
          <div
            key={item.id}
            className={itemClass}
            onClick={handleClick}
            role="listitem"
            tabIndex={item.onClick || onItemClick ? 0 : undefined}
          >
            {renderItemContent(item)}
          </div>
        );
      })}
    </div>
  );
}
