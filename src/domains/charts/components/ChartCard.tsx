import type { ReactNode } from 'react';
import type { TipState } from '../utils';
import { ChartTip } from './ChartTip';

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
  className?: string;
}

export function ChartCard({ title, subtitle, legend, actions, children, tip, hostRef, onMouseLeave, bare, className }: ChartCardProps) {
  return (
    <div className={['udb-chartcard', className].filter(Boolean).join(' ')}>
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
