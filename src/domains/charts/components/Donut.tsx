import { useState } from 'react';
import { seriesColor } from '../utils';

export interface DonutSegment {
  label: string;
  value: number;
  tone?: string;
  color?: string;
}

export interface DonutProps {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerValue?: string;
  centerLabel?: string;
  formatValue?: (v: number) => string;
}

export function Donut({
  segments,
  size = 148,
  thickness = 18,
  centerValue,
  centerLabel,
  formatValue = (v: number) => String(v),
}: DonutProps) {
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
            stroke="var(--color-muted)"
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
                stroke={seg.tone ?? seg.color ?? seriesColor(i)}
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
              <span className="udb-donut__dot" style={{ background: seg.tone ?? seg.color ?? seriesColor(i) }} />
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
