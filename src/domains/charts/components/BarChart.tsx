import { useState } from 'react';
import { seriesColor } from '../utils';

export interface BarSeries {
  key?: string;
  label: string;
  values?: readonly number[];
  data?: readonly number[];
  tone?: string;
  color?: string;
  accents?: readonly (string | undefined)[];
}

export interface BarChartGoalLine {
  value: number;
  label?: string;
  tone?: string;
}

export interface BarChartProps {
  labels: readonly string[];
  series: BarSeries[];
  stacking?: 'grouped' | 'stacked';
  totalLabel?: string;
  height?: number;
  formatValue?: (v: number) => string;
  formatLabel?: (l: string) => string;
  goalLine?: BarChartGoalLine;
}

export function BarChart({
  labels,
  series,
  stacking = 'grouped',
  totalLabel = 'Σ',
  height = 130,
  formatValue = (v: number) => String(v),
  formatLabel = (l: string) => l,
  goalLine,
}: BarChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const vals = (s: BarSeries) => s.values ?? s.data ?? [];
  const columnTotals = labels.map((_, i) => series.reduce((sum, s) => sum + (vals(s)[i] ?? 0), 0));
  const max =
    stacking === 'stacked'
      ? Math.max(1, ...columnTotals, goalLine?.value ?? 0)
      : Math.max(1, ...series.flatMap((s) => vals(s)), goalLine?.value ?? 0);
  const toneOf = (s: BarSeries, i: number) => s.tone ?? s.color ?? seriesColor(i);
  const accentOf = (s: BarSeries, si: number, i: number) => s.accents?.[i] ?? toneOf(s, si);
  const goalPct = goalLine !== undefined ? Math.min(100, (goalLine.value / max) * 100) : null;
  return (
    <div className="udb-barchart" style={{ height }}>
      {goalLine !== undefined && goalPct !== null && (
        <div
          className="udb-barchart__goal"
          style={{
            bottom: `${goalPct}%`,
            ...(goalLine.tone !== undefined ? { borderTopColor: goalLine.tone } : {}),
          }}
          title={goalLine.label ?? formatValue(goalLine.value)}
          aria-hidden="true"
        >
          {goalLine.label !== undefined && (
            <span
              className="udb-barchart__goallabel"
              style={
                goalLine.tone !== undefined
                  ? { color: goalLine.tone, borderColor: goalLine.tone }
                  : undefined
              }
            >
              {goalLine.label}
            </span>
          )}
        </div>
      )}
      {labels.map((label, i) => (
        <div
          key={label}
          className="udb-barchart__col"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
        >
          {stacking === 'stacked' ? (
            <div className="udb-barchart__bars udb-barchart__bars--stacked">
              {series.map((s, si) => {
                const v = vals(s)[i] ?? 0;
                return (
                  <div
                    key={s.key ?? s.label}
                    className="udb-barchart__bar"
                    style={{
                      height: `${(v / max) * 100}%`,
                      background: accentOf(s, si, i),
                      opacity: hover === null || hover === i ? 1 : 0.4,
                      ...(v === 0 ? { minHeight: 0 } : {}),
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="udb-barchart__bars">
              {series.map((s, si) => (
                <div
                  key={s.key ?? s.label}
                  className="udb-barchart__bar"
                  style={{
                    height: `${Math.max(2, ((vals(s)[i] ?? 0) / max) * 100)}%`,
                    background: accentOf(s, si, i),
                    opacity: hover === null || hover === i ? 1 : 0.4,
                  }}
                />
              ))}
            </div>
          )}
          {hover === i && (
            <div className="udb-barchart__tip">
              <div className="udb-barchart__tiptitle">{formatLabel(label)}</div>
              {series.map((s, si) => (
                <div key={s.key ?? s.label} className="udb-barchart__tiprow">
                  <span className="udb-barchart__tiplabel">
                    <span className="udb-chartlegend__dot" style={{ background: accentOf(s, si, i) }} />
                    {s.label}
                  </span>
                  <b>{formatValue(vals(s)[i] ?? 0)}</b>
                </div>
              ))}
              {stacking === 'stacked' && (
                <div className="udb-barchart__tiprow udb-barchart__tiprow--total">
                  <span className="udb-barchart__tiplabel">
                    <b>{totalLabel}</b>
                  </span>
                  <b>{formatValue(columnTotals[i] ?? 0)}</b>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
