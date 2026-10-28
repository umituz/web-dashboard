import { useId, useMemo, useState } from 'react';
import { gridTicks, niceMax, seriesColor } from '../utils';
import { Legend } from './Legend';

export interface LineSeries {
  key?: string;
  label: string;
  values?: readonly number[];
  data?: readonly number[];
  tone?: string;
  color?: string;
  kind?: 'line' | 'bars';
  axis?: 'left' | 'right';
  dashed?: boolean;
  area?: boolean;
  areaFill?: 'flat' | 'gradient';
}

export interface LineChartPoint {
  label: string;
}

export interface LineChartProps {
  points?: readonly LineChartPoint[];
  labels?: readonly string[];
  series: LineSeries[];
  band?: { from: number; to: number };
  height?: number;
  formatLeft?: (v: number) => string;
  formatRight?: (v: number) => string;
  formatValue?: (v: number) => string;
  yLabelLeft?: string;
  yLabelRight?: string;
}

export function LineChart({
  points,
  labels,
  series,
  band,
  height = 220,
  formatLeft,
  formatRight,
  formatValue,
  yLabelLeft,
  yLabelRight,
}: LineChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const uid = useId();
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

  const toneOf = (s: LineSeries, i: number) => s.tone ?? s.color ?? seriesColor(i);

  const leftMax = useMemo(
    () => niceMax(Math.max(1, ...series.filter((s) => s.axis !== 'right').flatMap((s) => vals(s)), ...(band ? [band.from, band.to] : []))),
    [series, band],
  );
  const rightMax = useMemo(
    () => niceMax(Math.max(1, ...series.filter((s) => s.axis === 'right').flatMap((s) => vals(s)))),
    [series],
  );
  const leftTicks = useMemo(() => gridTicks(Math.max(...series.filter((s) => s.axis !== 'right').flatMap((s) => vals(s)), ...(band ? [band.from, band.to] : []), 1)), [series, band]);

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
        {band && (
          <rect
            x={padLeft}
            y={yLeft(band.to)}
            width={innerW}
            height={Math.max(0, yLeft(band.from) - yLeft(band.to))}
            rx={2}
            className="udb-linechart__band"
          />
        )}
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
          const gradId = `lc${uid}-${si}`;
          const showArea = s.area !== false && !s.dashed;
          return (
            <g key={s.key ?? s.label}>
              {showArea &&
                (s.areaFill === 'gradient' ? (
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={toneOf(s, si)} stopOpacity="0.28" />
                      <stop offset="100%" stopColor={toneOf(s, si)} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                ) : null)}
              {showArea &&
                (s.areaFill === 'gradient' ? (
                  <path d={areaPath} fill={`url(#${gradId})`} />
                ) : (
                  <path d={areaPath} fill={toneOf(s, si)} opacity={0.07} />
                ))}
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
                  fill="var(--color-card)"
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
