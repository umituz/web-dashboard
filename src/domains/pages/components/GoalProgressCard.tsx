import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { Badge, Progress, type BadgeVariant } from '@umituz/web-design-system/atoms';
import { Card } from '@umituz/web-design-system/organisms';
import { cn } from '@umituz/web-design-system/utils';
import type { GoalProgressAction, GoalProgressCardProps } from '../types';

function resolveProgressTone(tone?: GoalProgressCardProps['tone']): 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'auto' | undefined {
  if (tone === 'neutral') return 'primary';
  return tone;
}

function renderAction(action: GoalProgressAction | ReactNode) {
  if (!action) return null;
  if (typeof action === 'object' && 'label' in action && !('type' in (action as object))) {
    const act = action as GoalProgressAction;
    if (act.href) {
      try {
        return (
          <Link
            to={act.href}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>{act.label}</span>
            <ChevronRight size={13} aria-hidden="true" />
          </Link>
        );
      } catch {
        return (
          <a
            href={act.href}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>{act.label}</span>
            <ChevronRight size={13} aria-hidden="true" />
          </a>
        );
      }
    }
    return (
      <button
        type="button"
        onClick={act.onClick}
        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
      >
        <span>{act.label}</span>
        <ChevronRight size={13} aria-hidden="true" />
      </button>
    );
  }
  return <div className="shrink-0">{action as ReactNode}</div>;
}

export function GoalProgressCard({
  title,
  current,
  target,
  unit,
  subtitle,
  icon,
  tone = 'primary',
  action,
  remainingLabel,
  completedLabel = 'Goal reached!',
  showPercent = true,
  className,
}: GoalProgressCardProps) {
  const percent = target > 0 ? Math.min(100, Math.max(0, Math.round((current / target) * 100))) : 0;
  const remaining = Math.max(0, target - current);
  const isCompleted = current >= target;

  const defaultRemainingText = remainingLabel ? (
    remainingLabel(remaining)
  ) : (
    <span className="text-xs text-muted-foreground">
      {remaining} {unit ? `${unit} ` : ''}remaining
    </span>
  );

  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && (
            <span aria-hidden="true" className="shrink-0 text-muted-foreground">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
            {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
          </div>
        </div>

        {showPercent && (
          <Badge tone={isCompleted ? 'success' : (tone as BadgeVariant)} small mono>
            {percent}%
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-mono font-bold text-foreground text-base sm:text-lg">
            {current}
            <span className="text-xs font-normal text-muted-foreground">
              {' '}/ {target} {unit}
            </span>
          </span>
        </div>
        <Progress value={percent} tone={isCompleted ? 'success' : resolveProgressTone(tone)} />
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40 text-xs">
        <div>{isCompleted ? <span className="font-semibold text-success">{completedLabel}</span> : defaultRemainingText}</div>
        {renderAction(action)}
      </div>
    </Card>
  );
}
