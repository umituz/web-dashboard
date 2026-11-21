import { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@umituz/web-design-system/atoms';
import { EmptyState } from '@umituz/web-design-system/organisms';
import { cn } from '@umituz/web-design-system/utils';
import type {
  DetailPageKpi,
  DetailPageMetaItem,
  DetailPageNotFoundConfig,
  DetailPageProps,
  DetailPageTab,
} from '../types';

function SafeBackLink({ href, label = 'Back' }: { href: string; label?: string }) {
  try {
    return (
      <Link
        to={href}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
      >
        <ArrowLeft size={13} aria-hidden="true" />
        <span>{label}</span>
      </Link>
    );
  } catch {
    return (
      <a
        href={href}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
      >
        <ArrowLeft size={13} aria-hidden="true" />
        <span>{label}</span>
      </a>
    );
  }
}

function renderMetaItem(item: DetailPageMetaItem | ReactNode, index: number) {
  if (item && typeof item === 'object' && 'value' in item && !('type' in (item as object))) {
    const m = item as DetailPageMetaItem;
    return (
      <span key={index} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        {m.icon && <span aria-hidden="true">{m.icon}</span>}
        {m.label && <span>{m.label}:</span>}
        <strong className="font-semibold text-foreground">{m.value}</strong>
      </span>
    );
  }
  return (
    <span key={index} className="text-xs text-muted-foreground">
      {item as ReactNode}
    </span>
  );
}

function renderKpi(kpi: DetailPageKpi, index: number) {
  return (
    <div
      key={index}
      className="flex flex-col gap-1 p-4 rounded-xl border border-line-border bg-card"
    >
      <span className="text-xs text-muted-foreground font-medium">{kpi.label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-foreground">{kpi.value}</span>
        {kpi.delta && (
          <span
            className={cn(
              'text-xs font-semibold',
              kpi.delta.direction === 'up' && 'text-emerald-600',
              kpi.delta.direction === 'down' && 'text-rose-600',
              kpi.delta.direction === 'flat' && 'text-muted-foreground',
            )}
          >
            {kpi.delta.value}
          </span>
        )}
      </div>
      {kpi.hint && <span className="text-2xs text-muted-foreground">{kpi.hint}</span>}
    </div>
  );
}

export function DetailPage<T = unknown>({
  backTo,
  title,
  kicker,
  badge,
  description,
  meta,
  actions,
  notice,
  kpis,
  tabs,
  activeTab,
  defaultTab,
  onTabChange,
  sidebar,
  children,
  notFound,
  className,
}: DetailPageProps<T>) {
  const [internalTab, setInternalTab] = useState<string>(() => {
    if (activeTab !== undefined) return activeTab;
    if (defaultTab !== undefined) return defaultTab;
    return tabs?.[0]?.id ?? '';
  });

  if (notFound) {
    const conf: DetailPageNotFoundConfig = typeof notFound === 'object' ? notFound : {};
    return (
      <div className={cn('flex w-full flex-col gap-6', className)}>
        {backTo && <SafeBackLink href={backTo.href} label={backTo.label} />}
        <EmptyState
          title={conf.title ?? 'Record not found'}
          description={conf.description ?? "This item doesn't exist or may have been deleted."}
          action={
            conf.backHref ? (
              <Button to={conf.backHref} variant="secondary">
                {conf.backLabel ?? 'Back'}
              </Button>
            ) : backTo ? (
              <Button to={backTo.href} variant="secondary">
                {backTo.label ?? 'Back'}
              </Button>
            ) : undefined
          }
        />
      </div>
    );
  }

  const currentTabId = activeTab !== undefined ? activeTab : internalTab;

  function handleTabSelect(id: string) {
    if (activeTab === undefined) {
      setInternalTab(id);
    }
    onTabChange?.(id);
  }

  const activeTabObj = tabs?.find((t) => t.id === currentTabId);
  const mainContent = activeTabObj?.content ?? children;

  return (
    <div className={cn('flex w-full flex-col gap-6', className)}>
      {backTo && <SafeBackLink href={backTo.href} label={backTo.label} />}

      <header className="flex flex-col gap-3">
        {kicker && <div className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">{kicker}</div>}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            {badge}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>

        {description && <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">{description}</p>}

        {meta && meta.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 border-t border-line-border/60">
            {meta.map(renderMetaItem)}
          </div>
        )}
      </header>

      {notice}

      {kpis && kpis.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map(renderKpi)}
        </div>
      )}

      {tabs && tabs.length > 0 && (
        <nav className="flex gap-2 border-b border-line-border pb-px" role="tablist">
          {tabs.map((tab: DetailPageTab) => {
            const isSelected = tab.id === currentTabId;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                disabled={tab.disabled}
                onClick={() => handleTabSelect(tab.id)}
                className={cn(
                  'inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                  isSelected
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-line-border',
                  tab.disabled && 'opacity-50 cursor-not-allowed',
                )}
              >
                {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      'px-1.5 py-0.5 text-2xs font-semibold rounded-full',
                      isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.badge}
              </button>
            );
          })}
        </nav>
      )}

      {sidebar ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6">{mainContent}</div>
          <aside className="flex flex-col gap-6">{sidebar}</aside>
        </div>
      ) : (
        <div className="flex flex-col gap-6">{mainContent}</div>
      )}
    </div>
  );
}
