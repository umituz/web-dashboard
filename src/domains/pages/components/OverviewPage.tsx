import type { ReactNode } from 'react';
import { PageHeader } from '@umituz/web-design-system/templates';
import { cn } from '@umituz/web-design-system/utils';
import type { OverviewPageHeaderProps, OverviewPageProps, StatGridItem } from '../types';
import { StatGrid } from './StatGrid';

function renderHeader(header: OverviewPageHeaderProps | ReactNode) {
  if (!header) return null;
  if (typeof header === 'object' && 'title' in header && !('type' in (header as object))) {
    const h = header as OverviewPageHeaderProps;
    return (
      <PageHeader
        title={h.title}
        kicker={h.kicker}
        description={h.description}
        subtitle={h.subtitle}
        actions={h.actions}
      />
    );
  }
  return <div className="udb-overview-header-custom">{header as ReactNode}</div>;
}

function renderKpis(kpis: readonly StatGridItem[] | ReactNode) {
  if (!kpis) return null;
  if (Array.isArray(kpis)) {
    return <StatGrid items={kpis as readonly StatGridItem[]} />;
  }
  return <div className="udb-overview-kpis-custom">{kpis as ReactNode}</div>;
}

export function OverviewPage({
  header,
  banner,
  kpis,
  children,
  sidebar,
  className,
}: OverviewPageProps) {
  return (
    <div className={cn('udb-overview-page', className)}>
      {renderHeader(header)}
      {banner && <div className="udb-overview-banner">{banner}</div>}
      {renderKpis(kpis)}
      {sidebar ? (
        <div className="udb-overview-split">
          <div className="udb-overview-primary">{children}</div>
          <aside className="udb-overview-sidebar">{sidebar}</aside>
        </div>
      ) : (
        <div className="udb-overview-primary">{children}</div>
      )}
    </div>
  );
}
