import type { ReactNode } from 'react';

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
