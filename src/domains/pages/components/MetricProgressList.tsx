import { Link } from 'react-router';
import { Progress } from '@umituz/web-design-system/atoms';
import { cn } from '@umituz/web-design-system/utils';
import type { MetricProgressItem, MetricProgressListProps } from '../types';

function resolveProgressTone(tone?: MetricProgressItem['tone']) {
  if (tone === 'danger') return 'destructive';
  return tone;
}

function renderItemContent(item: MetricProgressItem, percent: number) {
  return (
    <>
      <div className="udb-metric-progress-header">
        <span className="udb-metric-progress-label">{item.label}</span>
        <span className="udb-metric-progress-stats">
          {item.count !== undefined && <span className="udb-metric-progress-count">{item.count}</span>}
          {item.count !== undefined && item.value && <span className="udb-metric-progress-dot" aria-hidden="true">·</span>}
          {item.value && <span className="udb-metric-progress-val">{item.value}</span>}
        </span>
      </div>
      <Progress value={percent} tone={resolveProgressTone(item.tone)} />
    </>
  );
}

export function MetricProgressList({
  items,
  max,
  title,
  onItemClick,
  className,
}: MetricProgressListProps) {
  const calculatedMax = max ?? Math.max(
    1,
    ...items.map((i) => (typeof i.count === 'number' ? i.count : 0)),
  );

  return (
    <div className={cn('udb-metric-progress-list', className)}>
      {title && <div className="udb-metric-progress-title">{title}</div>}
      <div className="udb-metric-progress-items" role="list">
        {items.map((item) => {
          const percent = item.percent !== undefined
            ? Math.min(100, Math.max(0, item.percent))
            : Math.min(100, Math.max(0, Math.round(((typeof item.count === 'number' ? item.count : 0) / calculatedMax) * 100)));

          const itemClass = cn(
            'udb-metric-progress-item',
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
                  {renderItemContent(item, percent)}
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
                  {renderItemContent(item, percent)}
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
              {renderItemContent(item, percent)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
