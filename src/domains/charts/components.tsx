import type { ReactNode } from 'react';
import type { TipState } from './utils';

export function ChartTip({ tip }: { tip: TipState }) {
  return (
    <div className="udb-charttip" style={{ left: tip.x, top: tip.y }}>
      <div className="udb-charttip__title">{tip.title}</div>
      {tip.rows.map((r, i) => (
        <div key={i} className="udb-charttip__row">
          <span className="udb-charttip__label">
            {r.color && <span className="udb-chartlegend__dot" style={{ background: r.color }} />}
            {r.label}
          </span>
          <b>{r.value}</b>
        </div>
      ))}
    </div>
  );
}

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  legend?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  tip: TipState | null;
  hostRef?: React.Ref<HTMLDivElement>;
  onMouseLeave?: () => void;
  bare?: boolean;
}

export function ChartCard({ title, subtitle, legend, actions, children, tip, hostRef, onMouseLeave, bare }: ChartCardProps) {
  return (
    <div className="udb-chartcard">
      <div className="udb-chartcard__head">
        <div className="udb-chartcard__heading">
          <div className="udb-chartcard__title">{title}</div>
          {subtitle && <div className="udb-chartcard__sub">{subtitle}</div>}
        </div>
        <div className="udb-chartcard__tools">
          {legend}
          {actions}
        </div>
      </div>
      <div className="udb-chartcard__body" style={bare ? { padding: 0 } : undefined}>
        <div ref={hostRef} className="udb-chartcard__plot" onMouseLeave={onMouseLeave}>
          {children}
          {tip && <ChartTip tip={tip} />}
        </div>
      </div>
    </div>
  );
}

export interface LegendItem {
  label: string;
  color: string;
  value?: string;
}

export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <div className="udb-chartlegend">
      {items.map((i) => (
        <span key={i.label} className="udb-chartlegend__item">
          <span className="udb-chartlegend__dot" style={{ background: i.color }} />
          {i.label}
          {i.value && <span className="udb-chartlegend__value">{i.value}</span>}
        </span>
      ))}
    </div>
  );
}
