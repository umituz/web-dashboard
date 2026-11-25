import type { ReactNode } from 'react';
import { Flame, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { Badge, type BadgeVariant } from '@umituz/web-design-system/atoms';
import { cn } from '@umituz/web-design-system/utils';
import type { StreakBadgeTone, StreakBannerAction, StreakBannerProps } from '../types';

function resolveBadgeTone(tone?: StreakBadgeTone): BadgeVariant | undefined {
  if (tone === 'muted') return 'neutral';
  return tone;
}

function renderAction(action: StreakBannerAction | ReactNode) {
  if (!action) return null;
  if (typeof action === 'object' && 'label' in action && !('type' in (action as object))) {
    const act = action as StreakBannerAction;
    if (act.href) {
      try {
        return (
          <Link to={act.href} className="udb-streak-action">
            <span>{act.label}</span>
            <ChevronRight size={14} aria-hidden="true" />
          </Link>
        );
      } catch {
        return (
          <a href={act.href} className="udb-streak-action">
            <span>{act.label}</span>
            <ChevronRight size={14} aria-hidden="true" />
          </a>
        );
      }
    }
    return (
      <button type="button" onClick={act.onClick} className="udb-streak-action">
        <span>{act.label}</span>
        <ChevronRight size={14} aria-hidden="true" />
      </button>
    );
  }
  return <div className="udb-streak-action-slot">{action as ReactNode}</div>;
}

export function StreakBanner({
  streak,
  streakLabel,
  title,
  subtitle,
  badge,
  icon,
  milestones = 7,
  action,
  className,
}: StreakBannerProps) {
  const displayStreakLabel = streakLabel ?? `${streak}-Day Streak`;

  return (
    <aside className={cn('udb-streak-banner', className)} aria-label="Daily activity and streak status">
      <div className="udb-streak-left">
        <div className="udb-streak-icon-wrap" aria-hidden="true">
          {icon ?? <Flame size={20} fill="currentColor" />}
        </div>
        <div className="udb-streak-info">
          <div className="udb-streak-headline">
            <span className="udb-streak-title">{title}</span>
            <span className="udb-streak-dot" aria-hidden="true">·</span>
            <span className="udb-streak-count">{displayStreakLabel}</span>
            {badge && (
              typeof badge === 'object' && 'label' in badge && !('type' in (badge as object)) ? (
                <Badge tone={resolveBadgeTone((badge as { tone?: StreakBadgeTone }).tone) ?? 'accent'}>
                  {(badge as { label: ReactNode }).label}
                </Badge>
              ) : (
                badge as ReactNode
              )
            )}
          </div>
          {subtitle && <div className="udb-streak-subtitle">{subtitle}</div>}
        </div>
      </div>

      <div className="udb-streak-right">
        {milestones > 0 && (
          <div className="udb-streak-milestones" aria-label={`${streak} of ${milestones} days completed`}>
            {Array.from({ length: milestones }, (_, idx) => {
              const filled = idx < Math.min(streak, milestones);
              return (
                <div
                  key={idx}
                  className={cn(
                    'udb-streak-milestone-dot',
                    filled && 'is-filled',
                  )}
                  title={`Day ${idx + 1}`}
                />
              );
            })}
          </div>
        )}
        {renderAction(action)}
      </div>
    </aside>
  );
}
