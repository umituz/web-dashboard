import { useId } from 'react';
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

export function Sparkline({
  data,
  height = 34,
  width = 110,
  color = 'currentColor',
}: {
  data: number[];
  height?: number;
  width?: number;
  color?: string;
}) {
  const id = useId();
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * width, height - 3 - ((v - min) / span) * (height - 8)]);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]!.toFixed(1)},${p[1]!.toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <defs>
        <linearGradient id={`sp${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sp${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts.at(-1)![0]} cy={pts.at(-1)![1]} r="2.4" fill={color} />
    </svg>
  );
}

export interface HBarRow {
  label: ReactNode;
  sub?: ReactNode;
  value: number;
  tone?: string;
}

export function HBars({ rows, formatValue = (n: number) => String(n) }: { rows: HBarRow[]; formatValue?: (n: number) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="udb-hbars">
      {rows.map((r, i) => (
        <div key={i} className="udb-hbars__row">
          <div className="udb-hbars__label">
            <div className="udb-hbars__name">{r.label}</div>
            {r.sub && <div className="udb-hbars__sub">{r.sub}</div>}
          </div>
          <div className="udb-hbars__track">
            <div
              className="udb-hbars__fill"
              style={{ width: `${(r.value / max) * 100}%`, ...(r.tone ? { background: r.tone } : {}) }}
            />
          </div>
          <span className="udb-hbars__value">{formatValue(r.value)}</span>
        </div>
      ))}
    </div>
  );
}
