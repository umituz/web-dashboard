import { type ReactNode } from 'react';
import { Search } from 'lucide-react';
import { PageHeader } from '@umituz/web-design-system/templates';
import type { KanbanPageProps } from '../types';
import { KanbanBoard } from './KanbanBoard';

export function KanbanPage<T = unknown>({
  kicker,
  title,
  subtitle,
  actions,
  callout,
  kpis,
  search,
  filterBar,
  loading = false,
  footer,
  children,
  className,
  ...boardProps
}: KanbanPageProps<T>): ReactNode {
  return (
    <div className={`udb-kanban-page${className ? ` ${className}` : ''}`}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        kicker={kicker}
        actions={actions}
      />

      {callout && <div className="udb-kanban-callout">{callout}</div>}

      {kpis && kpis.length > 0 && (
        <div className="udb-kanban-kpis">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="udb-kanban-kpi-card">
              <div className="udb-kanban-kpi-label">{kpi.label}</div>
              <div className="udb-kanban-kpi-value">{kpi.value}</div>
              {kpi.hint && <div className="udb-kanban-kpi-hint">{kpi.hint}</div>}
            </div>
          ))}
        </div>
      )}

      {(search || filterBar) && (
        <div className="udb-kanban-toolbar">
          {search ? (
            <div className="udb-kanban-search-box">
              <span className="udb-kanban-search-icon" aria-hidden="true">
                <Search size={15} />
              </span>
              <input
                type="text"
                className="udb-kanban-search-input"
                placeholder={search.placeholder ?? 'Filter cards…'}
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
              />
            </div>
          ) : (
            <div />
          )}

          {filterBar}
        </div>
      )}

      {loading ? (
        <div className="udb-kanban-loading" aria-busy="true">
          <div className="udb-kanban-board">
            {boardProps.columns.map((col) => (
              <div key={col.id} className="udb-kanban-col">
                <div className="udb-kanban-col-head">
                  <span className="udb-kanban-col-title">{col.title}</span>
                </div>
                <div className="udb-kanban-col-body">
                  <div className="udb-kanban-empty-col">Loading…</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <KanbanBoard<T> {...boardProps} />
      )}

      {footer && <div className="udb-kanban-footer">{footer}</div>}
      {children}
    </div>
  );
}
