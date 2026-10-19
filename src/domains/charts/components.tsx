import { useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { PALETTE, gridTicks, niceMax, type TipState } from './utils';

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
  hint?: string;
}

export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <div className="udb-chartlegend">
      {items.map((i) => (
        <span key={i.label} className="udb-chartlegend__item">
          <span className="udb-chartlegend__dot" style={{ background: i.color }} />
          {i.label}
          {i.value && <span className="udb-chartlegend__value">{i.value}</span>}
          {i.hint && <span className="udb-chartlegend__hint">{i.hint}</span>}
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

export interface BarSeries {
  key?: string;
  label: string;
  values?: number[];
  data?: number[];
  tone?: string;
  color?: string;
}

export function BarChart({
  labels,
  series,
  height = 130,
  formatValue = (v: number) => String(v),
  formatLabel = (l: string) => l,
}: {
  labels: string[];
  series: BarSeries[];
  height?: number;
  formatValue?: (v: number) => string;
  formatLabel?: (l: string) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const vals = (s: BarSeries) => s.values ?? s.data ?? [];
  const max = Math.max(1, ...series.flatMap((s) => vals(s)));
  const toneOf = (s: BarSeries, i: number) => s.tone ?? s.color ?? PALETTE[i % PALETTE.length]!;
  return (
    <div className="udb-barchart" style={{ height }}>
      {labels.map((label, i) => (
        <div
          key={label}
          className="udb-barchart__col"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
        >
          <div className="udb-barchart__bars">
            {series.map((s, si) => (
              <div
                key={s.key ?? s.label}
                className="udb-barchart__bar"
                style={{
                  height: `${Math.max(2, ((vals(s)[i] ?? 0) / max) * 100)}%`,
                  background: toneOf(s, si),
                  opacity: hover === null || hover === i ? 1 : 0.4,
                }}
              />
            ))}
          </div>
          {hover === i && (
            <div className="udb-barchart__tip">
              <div className="udb-barchart__tiptitle">{formatLabel(label)}</div>
              {series.map((s, si) => (
                <div key={s.key ?? s.label} className="udb-barchart__tiprow">
                  <span className="udb-barchart__tiplabel">
                    <span className="udb-chartlegend__dot" style={{ background: toneOf(s, si) }} />
                    {s.label}
                  </span>
                  <b>{formatValue(vals(s)[i] ?? 0)}</b>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export interface DonutSegment {
  label: string;
  value: number;
  tone?: string;
  color?: string;
}

export function Donut({
  segments,
  size = 148,
  thickness = 18,
  centerValue,
  centerLabel,
  formatValue = (v: number) => String(v),
}: {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerValue?: string;
  centerLabel?: string;
  formatValue?: (v: number) => string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const total = segments.reduce((sum, seg) => sum + seg.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="udb-donut">
      <div className="udb-donut__wrap" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--u-color-surface-muted)"
            strokeWidth={thickness}
          />
          {segments.map((seg, i) => {
            const dash = (seg.value / total) * circumference;
            const el = (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.tone ?? seg.color ?? PALETTE[i % PALETTE.length]!}
                strokeWidth={active === i ? thickness + 3 : thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                opacity={active === null || active === i ? 1 : 0.35}
                className="udb-donut__seg"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div className="udb-donut__center">
          <span className="udb-donut__value">
            {active !== null ? formatValue(segments[active]!.value) : centerValue}
          </span>
          <span className="udb-donut__label">{active !== null ? segments[active]!.label : centerLabel}</span>
        </div>
      </div>
      <div className="udb-donut__list">
        {segments.map((seg, i) => (
          <div
            key={seg.label}
            className="udb-donut__item"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="udb-donut__itemlabel">
              <span className="udb-donut__dot" style={{ background: seg.tone ?? seg.color ?? PALETTE[i % PALETTE.length]! }} />
              {seg.label}
            </span>
            <span className="udb-donut__itemvalue">
              {formatValue(seg.value)}
              <span className="udb-donut__pct">{Math.round((seg.value / total) * 100)}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface LineSeries {
  key?: string;
  label: string;
  values?: number[];
  data?: number[];
  tone?: string;
  color?: string;
  kind?: 'line' | 'bars';
  axis?: 'left' | 'right';
  dashed?: boolean;
  area?: boolean;
}

export interface LineChartPoint {
  label: string;
}

export function LineChart({
  points,
  labels,
  series,
  height = 220,
  formatLeft,
  formatRight,
  formatValue,
  yLabelLeft,
  yLabelRight,
}: {
  points?: LineChartPoint[];
  labels?: string[];
  series: LineSeries[];
  height?: number;
  formatLeft?: (v: number) => string;
  formatRight?: (v: number) => string;
  formatValue?: (v: number) => string;
  yLabelLeft?: string;
  yLabelRight?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const pts = points ?? (labels ?? []).map((label) => ({ label }));
  const fmtLeft = formatLeft ?? formatValue ?? ((v: number) => String(Math.round(v)));
  const fmtRight = formatRight ?? formatValue ?? ((v: number) => String(Math.round(v)));
  const vals = (s: LineSeries) => s.values ?? s.data ?? [];
  const w = 720;
  const padLeft = 52;
  const padRight = series.some((s) => s.axis === 'right') ? 46 : 14;
  const padTop = 12;
  const padBottom = 24;
  const innerW = w - padLeft - padRight;
  const innerH = height - padTop - padBottom;
  const n = pts.length;

  const toneOf = (s: LineSeries, i: number) => s.tone ?? s.color ?? PALETTE[i % PALETTE.length]!;

  const leftMax = useMemo(
    () => niceMax(Math.max(1, ...series.filter((s) => s.axis !== 'right').flatMap((s) => vals(s)))),
    [series],
  );
  const rightMax = useMemo(
    () => niceMax(Math.max(1, ...series.filter((s) => s.axis === 'right').flatMap((s) => vals(s)))),
    [series],
  );
  const leftTicks = useMemo(() => gridTicks(Math.max(...series.filter((s) => s.axis !== 'right').flatMap((s) => vals(s)), 1)), [series]);

  const xAt = (i: number) => padLeft + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yLeft = (v: number) => padTop + innerH - (v / leftMax) * innerH;
  const yRight = (v: number) => padTop + innerH - (v / rightMax) * innerH;
  const labelEvery = Math.max(1, Math.ceil(n / 8));

  if (n === 0) return null;

  return (
    <div className="udb-linechart">
      <svg
        viewBox={`0 0 ${w} ${height}`}
        className="udb-linechart__svg"
        style={{ height }}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * w;
          const idx = Math.round(((x - padLeft) / innerW) * (n - 1));
          setHover(Math.max(0, Math.min(n - 1, idx)));
        }}
      >
        {leftTicks.map((v, i) => (
          <g key={i}>
            <line x1={padLeft} x2={w - padRight} y1={yLeft(v)} y2={yLeft(v)} className="udb-linechart__grid" />
            <text x={padLeft - 6} y={yLeft(v) + 3} textAnchor="end" className="udb-linechart__axis">
              {fmtLeft(v)}
            </text>
          </g>
        ))}
        {series.some((s) => s.axis === 'right') && (
          <g>
            {leftTicks.map((v, i) => (
              <text key={i} x={w - padRight + 6} y={yLeft(v) + 3} textAnchor="start" className="udb-linechart__axis">
                {fmtRight((v / leftMax) * rightMax)}
              </text>
            ))}
          </g>
        )}
        {pts.map((p, i) =>
          i % labelEvery === 0 ? (
            <text key={i} x={xAt(i)} y={height - 8} textAnchor="middle" className="udb-linechart__axis">
              {p.label}
            </text>
          ) : null,
        )}
        {series.map((s, si) => {
          const yFn = s.axis === 'right' ? yRight : yLeft;
          if (s.kind === 'bars') {
            const barW = Math.max(3, (innerW / Math.max(1, n - 1)) * 0.5);
            return (
              <g key={s.key ?? s.label}>
                {vals(s).slice(0, n).map((v, i) => (
                  <rect
                    key={i}
                    x={xAt(i) - barW / 2}
                    y={yFn(v)}
                    width={barW}
                    height={Math.max(0, padTop + innerH - yFn(v))}
                    rx={1.5}
                    fill={toneOf(s, si)}
                    opacity={hover === null || hover === i ? 0.85 : 0.35}
                  />
                ))}
              </g>
            );
          }
          const path = vals(s)
            .slice(0, n)
            .map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${yFn(v).toFixed(1)}`)
            .join(' ');
          const areaPath = `${path} L${xAt(n - 1).toFixed(1)},${padTop + innerH} L${xAt(0).toFixed(1)},${padTop + innerH} Z`;
          return (
            <g key={s.key ?? s.label}>
              {s.area !== false && !s.dashed && <path d={areaPath} fill={toneOf(s, si)} opacity={0.07} />}
              <path
                d={path}
                fill="none"
                stroke={toneOf(s, si)}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={s.dashed ? '4 4' : undefined}
              />
              {vals(s).slice(0, n).map((v, i) => (
                <circle
                  key={i}
                  cx={xAt(i)}
                  cy={yFn(v)}
                  r={hover === i ? 3.4 : 0}
                  fill="var(--u-color-surface)"
                  stroke={toneOf(s, si)}
                  strokeWidth={2}
                />
              ))}
            </g>
          );
        })}
        {hover !== null && (
          <line
            x1={xAt(hover)}
            x2={xAt(hover)}
            y1={padTop}
            y2={padTop + innerH}
            className="udb-linechart__crosshair"
          />
        )}
        {yLabelLeft && (
          <text x={4} y={10} className="udb-linechart__axis">
            {yLabelLeft}
          </text>
        )}
        {yLabelRight && (
          <text x={w - 4} y={10} textAnchor="end" className="udb-linechart__axis">
            {yLabelRight}
          </text>
        )}
      </svg>
      {hover !== null && (
        <div
          className="udb-linechart__tip"
          style={{
            left: `${(xAt(hover) / w) * 100}%`,
            transform: hover > n / 2 ? 'translateX(calc(-100% - 10px))' : 'translateX(10px)',
          }}
        >
          <div className="udb-linechart__tiptitle">{pts[hover]!.label}</div>
          {series.map((s, si) => (
            <div key={s.key ?? s.label} className="udb-linechart__tiprow">
              <span>
                <span className="udb-linechart__swatch" style={{ background: toneOf(s, si) }} />
                {s.label}
              </span>
              <b>{(s.axis === 'right' ? fmtRight : fmtLeft)(vals(s)[hover] ?? 0)}</b>
            </div>
          ))}
        </div>
      )}
      <div className="udb-linechart__legendhost">
        <Legend items={series.map((s, si) => ({ label: s.label, color: toneOf(s, si) }))} />
      </div>
    </div>
  );
}
