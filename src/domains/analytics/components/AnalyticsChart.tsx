import { useMemo } from "react";
import { cn } from "@umituz/web-design-system/utils/cn";
import { useT } from "@umituz/web-localization/react";
import type { ChartConfig, ChartData, TimeSeriesData } from "../types/analytics";
import { generateChartColors } from "../utils/analytics";
import { ANALYTICS_KEYS } from "../utils/i18nKeys";

const VIEWBOX_W = 600;
const DEFAULT_CHART_HEIGHT_PX = 300;
const DEFAULT_SERIES_COUNT = 5;
const PAD = { top: 10, right: 12, bottom: 24, left: 44 } as const;
const Y_TICKS = 4;
const X_LABEL_SAMPLE = 8;
const LINE_STROKE_WIDTH = 2;
const DOT_RADIUS = 3;
const AREA_FILL_OPACITY = 0.25;

interface ChartRow {
  label: string;
  values: number[];
}

interface PieSlice {
  label: string;
  value: number;
  fraction: number;
}

const compactFmt = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
});

const toNumber = (value: unknown): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const toRows = (
  data: TimeSeriesData[] | ChartData[],
  keys: string[],
  xAxisKey?: string,
): ChartRow[] =>
  data.map((point) => ({
    label: String(point[xAxisKey ?? "date"] ?? point.label ?? ""),
    values: keys.map((key) => toNumber(point[key])),
  }));

const rowsDomain = (rows: ChartRow[]): { min: number; max: number } => {
  const all = rows.flatMap((row) => row.values);
  const dataMin = all.length > 0 ? Math.min(...all) : 0;
  const dataMax = all.length > 0 ? Math.max(...all) : 1;
  const min = Math.min(0, dataMin);
  const max = dataMax === min ? min + 1 : dataMax;
  return { min, max };
};

const shouldShowLabel = (index: number, count: number): boolean => {
  if (count <= X_LABEL_SAMPLE) return true;
  const step = Math.ceil((count - 1) / (X_LABEL_SAMPLE - 1));
  return index % step === 0 || index === count - 1;
};

const polarPoint = (cx: number, cy: number, r: number, angle: number): [number, number] => [
  cx + r * Math.cos(angle),
  cy + r * Math.sin(angle),
];

interface AnalyticsChartProps {
  config: ChartConfig;
  className?: string;
  height?: number | string;
}

export const AnalyticsChart = ({ config, className, height }: AnalyticsChartProps) => {
  const t = useT();

  const chartHeight = height ?? config.height ?? DEFAULT_CHART_HEIGHT_PX;
  const viewBoxH = typeof chartHeight === "number" ? chartHeight : DEFAULT_CHART_HEIGHT_PX;

  const keys = useMemo(
    () => config.yAxisKeys ?? ["value"],
    [config.yAxisKeys],
  );

  const colors = useMemo(
    () => config.colors ?? generateChartColors(keys.length || DEFAULT_SERIES_COUNT),
    [config.colors, keys.length],
  );

  const rows = useMemo(
    () => toRows(config.data as TimeSeriesData[] | ChartData[], keys, config.xAxisKey),
    [config.data, keys, config.xAxisKey],
  );

  const slices = useMemo<PieSlice[]>(() => {
    const entries = config.data as ChartData[];
    const total = entries.reduce((sum, entry) => sum + toNumber(entry.value), 0);
    return entries.map((entry) => ({
      label: String(entry.label ?? ""),
      value: toNumber(entry.value),
      fraction: total > 0 ? toNumber(entry.value) / total : 0,
    }));
  }, [config.data]);

  const legendItems = useMemo(() => {
    if (config.type === "pie" || config.type === "donut") {
      return slices.map((slice, index) => ({
        label: `${slice.label} (${Math.round(slice.fraction * 100)}%)`,
        color: colors[index % colors.length],
      }));
    }
    return keys.map((key, index) => ({ label: key, color: colors[index % colors.length] }));
  }, [config.type, keys, slices, colors]);

  const renderUnsupported = () => (
    <div className="udb-chart__empty" role="alert">
      {t(ANALYTICS_KEYS.chart.noData)}: {config.type}
    </div>
  );

  const renderCartesian = () => {
    if (rows.length === 0) return renderUnsupported();

    const { min, max } = rowsDomain(rows);
    const plotW = VIEWBOX_W - PAD.left - PAD.right;
    const plotH = viewBoxH - PAD.top - PAD.bottom;
    const xAt = (index: number) =>
      PAD.left + (rows.length === 1 ? plotW / 2 : (index / (rows.length - 1)) * plotW);
    const yAt = (value: number) =>
      PAD.top + plotH - ((value - min) / (max - min)) * plotH;

    const seriesPath = (values: number[]) =>
      values
        .map((value, index) => `${index === 0 ? "M" : "L"}${xAt(index).toFixed(1)},${yAt(value).toFixed(1)}`)
        .join(" ");

    const areaPath = (values: number[]) =>
      values.length === 0
        ? ""
        : `${seriesPath(values)} L${xAt(values.length - 1).toFixed(1)},${yAt(min).toFixed(1)} L${xAt(0).toFixed(1)},${yAt(min).toFixed(1)} Z`;

    return (
      <svg
        className="udb-chart__svg"
        viewBox={`0 0 ${VIEWBOX_W} ${viewBoxH}`}
        width="100%"
        height="100%"
        role="img"
      >
        {config.showGrid !== false &&
          Array.from({ length: Y_TICKS + 1 }, (_, tick) => {
            const value = min + ((max - min) / Y_TICKS) * tick;
            const y = yAt(value);
            return (
              <g key={tick}>
                <line
                  className="udb-chart__grid"
                  x1={PAD.left}
                  x2={VIEWBOX_W - PAD.right}
                  y1={y}
                  y2={y}
                />
                <text className="udb-chart__axis" x={PAD.left - 6} y={y + 4} textAnchor="end">
                  {compactFmt.format(value)}
                </text>
              </g>
            );
          })}

        {rows.map((row, index) =>
          shouldShowLabel(index, rows.length) ? (
            <text
              key={`x-${row.label}-${index}`}
              className="udb-chart__axis"
              x={xAt(index)}
              y={viewBoxH - 6}
              textAnchor="middle"
            >
              {row.label}
            </text>
          ) : null,
        )}

        {(config.type === "line" || config.type === "area") &&
          keys.map((key, seriesIndex) => {
            const values = rows.map((row) => row.values[seriesIndex]);
            const color = colors[seriesIndex % colors.length];
            return (
              <g key={key}>
                {config.type === "area" && (
                  <path d={areaPath(values)} fill={color} fillOpacity={AREA_FILL_OPACITY} />
                )}
                <path
                  d={seriesPath(values)}
                  fill="none"
                  stroke={color}
                  strokeWidth={LINE_STROKE_WIDTH}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {config.showTooltip !== false &&
                  values.map((value, index) => (
                    <circle
                      key={`${key}-${index}`}
                      cx={xAt(index)}
                      cy={yAt(value)}
                      r={DOT_RADIUS}
                      fill={color}
                    >
                      <title>{`${rows[index].label} — ${key}: ${value}`}</title>
                    </circle>
                  ))}
              </g>
            );
          })}

        {config.type === "bar" &&
          rows.map((row, rowIndex) => {
            const band = plotW / rows.length;
            const barW = (band * 0.6) / keys.length;
            const zero = yAt(Math.max(min, 0));
            return (
              <g key={`${row.label}-${rowIndex}`}>
                {keys.map((key, seriesIndex) => {
                  const value = row.values[seriesIndex];
                  const x = PAD.left + rowIndex * band + band * 0.2 + seriesIndex * barW;
                  const y = yAt(Math.max(value, 0));
                  const height = Math.max(Math.abs(yAt(value) - zero), 1);
                  const color = colors[seriesIndex % colors.length];
                  return (
                    <rect
                      key={key}
                      x={x}
                      y={Math.min(y, zero)}
                      width={barW - 1}
                      height={height}
                      rx={2}
                      fill={color}
                    >
                      <title>{`${row.label} — ${key}: ${value}`}</title>
                    </rect>
                  );
                })}
              </g>
            );
          })}
      </svg>
    );
  };

  const renderPie = (donut: boolean) => {
    if (slices.length === 0) return renderUnsupported();

    const cx = VIEWBOX_W / 2;
    const cy = viewBoxH / 2;
    const outerR = Math.min(viewBoxH / 2 - PAD.top, 120);

    if (donut) {
      const ringR = outerR * 0.7;
      const strokeWidth = outerR - ringR;
      const circumference = 2 * Math.PI * ringR;
      let offset = 0;
      return (
        <svg
          className="udb-chart__svg"
          viewBox={`0 0 ${VIEWBOX_W} ${viewBoxH}`}
          width="100%"
          height="100%"
          role="img"
        >
          <g transform={`rotate(-90 ${cx} ${cy})`}>
            {slices.map((slice, index) => {
              const dash = slice.fraction * circumference;
              const element = (
                <circle
                  key={`${slice.label}-${index}`}
                  cx={cx}
                  cy={cy}
                  r={ringR}
                  fill="none"
                  stroke={colors[index % colors.length]}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                >
                  <title>{`${slice.label}: ${Math.round(slice.fraction * 100)}%`}</title>
                </circle>
              );
              offset += dash;
              return element;
            })}
          </g>
        </svg>
      );
    }

    let angle = -Math.PI / 2;
    return (
      <svg
        className="udb-chart__svg"
        viewBox={`0 0 ${VIEWBOX_W} ${viewBoxH}`}
        width="100%"
        height="100%"
        role="img"
      >
        {slices.map((slice, index) => {
          const sweep = slice.fraction * 2 * Math.PI;
          const [x0, y0] = polarPoint(cx, cy, outerR, angle);
          const [x1, y1] = polarPoint(cx, cy, outerR, angle + sweep);
          const largeArc = sweep > Math.PI ? 1 : 0;
          const path =
            slice.fraction >= 1
              ? `M${cx - outerR},${cy} A${outerR},${outerR} 0 1 0 ${cx + outerR},${cy} A${outerR},${outerR} 0 1 0 ${cx - outerR},${cy} Z`
              : `M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${outerR},${outerR} 0 ${largeArc} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z`;
          angle += sweep;
          return (
            <path key={`${slice.label}-${index}`} d={path} fill={colors[index % colors.length]}>
              <title>{`${slice.label}: ${Math.round(slice.fraction * 100)}%`}</title>
            </path>
          );
        })}
      </svg>
    );
  };

  const renderChart = () => {
    switch (config.type) {
      case "line":
      case "area":
      case "bar":
        return renderCartesian();
      case "pie":
        return renderPie(false);
      case "donut":
        return renderPie(true);
      default:
        return renderUnsupported();
    }
  };

  return (
    <div
      className={cn("udb-chart", config.aspectRatio, className)}
      style={{
        height: typeof chartHeight === "number" ? `${chartHeight}px` : chartHeight,
      }}
    >
      {renderChart()}
      {config.showLegend && legendItems.length > 0 && (
        <div className="udb-chart__legend">
          {legendItems.map((item) => (
            <span key={item.label} className="udb-chart__chip">
              <span
                className="udb-chart__chip-dot"
                style={{ background: item.color }}
                aria-hidden="true"
              />
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;
