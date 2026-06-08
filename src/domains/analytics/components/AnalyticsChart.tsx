/**
 * AnalyticsChart
 *
 * Recharts wrapper for the analytics domain.
 * No `any`, no magic numbers — chart geometry is centralized.
 */

import { useMemo } from "react";
import {
  LineChart,
  BarChart,
  AreaChart,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Bar,
  Area,
  Pie,
  Cell,
} from "recharts";
import { useTranslation } from "react-i18next";
import { cn } from "@umituz/web-design-system/utils";
import type { ChartConfig, ChartData, TimeSeriesData } from "../types/analytics";
import { generateChartColors } from "../utils/analytics";
import { ANALYTICS_KEYS } from "../utils/i18nKeys";

const CHART_MARGIN = { top: 10, right: 10, left: 10, bottom: 10 } as const;
const PIE_OUTER_RADIUS = 80;
const PIE_INNER_RADIUS = 40;
const DEFAULT_CHART_HEIGHT_PX = 300;
const DEFAULT_SERIES_COUNT = 5;
const LINE_STROKE_WIDTH = 2;
const LINE_DOT_RADIUS = 4;
const AREA_FILL_OPACITY = 0.3;

interface AnalyticsChartProps {
  config: ChartConfig;
  className?: string;
  height?: number | string;
}

const renderAxis = (dataKey: string | undefined) => (
  <>
    <XAxis
      dataKey={dataKey}
      className="text-xs text-muted-foreground"
      axisLine={false}
      tickLine={false}
    />
    <YAxis
      className="text-xs text-muted-foreground"
      axisLine={false}
      tickLine={false}
    />
  </>
);

const renderGrid = (showGrid: boolean | undefined) =>
  showGrid ? (
    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
  ) : null;

const renderOverlay = (config: ChartConfig) => (
  <>
    {config.showTooltip && <Tooltip />}
    {config.showLegend && <Legend />}
  </>
);

export const AnalyticsChart = ({ config, className, height }: AnalyticsChartProps) => {
  const { t } = useTranslation();
  const colors = useMemo(
    () => config.colors ?? generateChartColors(config.yAxisKeys?.length ?? DEFAULT_SERIES_COUNT),
    [config.colors, config.yAxisKeys],
  );

  const chartHeight = height ?? config.height ?? DEFAULT_CHART_HEIGHT_PX;

  const renderChart = () => {
    const commonProps = {
      data: config.data as TimeSeriesData[] | ChartData[],
      margin: CHART_MARGIN,
    };

    switch (config.type) {
      case "line":
        return (
          <LineChart {...commonProps}>
            {renderGrid(config.showGrid)}
            {renderAxis(config.xAxisKey)}
            {renderOverlay(config)}
            {config.yAxisKeys?.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index]}
                strokeWidth={LINE_STROKE_WIDTH}
                dot={{ r: LINE_DOT_RADIUS }}
              />
            ))}
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            {renderGrid(config.showGrid)}
            {renderAxis(config.xAxisKey)}
            {renderOverlay(config)}
            {config.yAxisKeys?.map((key, index) => (
              <Bar key={key} dataKey={key} fill={colors[index]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            {renderGrid(config.showGrid)}
            {renderAxis(config.xAxisKey)}
            {renderOverlay(config)}
            {config.yAxisKeys?.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index]}
                fill={colors[index]}
                fillOpacity={AREA_FILL_OPACITY}
              />
            ))}
          </AreaChart>
        );

      case "pie":
      case "donut":
        return (
          <PieChart>
            <Pie
              data={config.data as ChartData[]}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(Number(percent) * 100).toFixed(0)}%`
              }
              outerRadius={PIE_OUTER_RADIUS}
              innerRadius={config.type === "donut" ? PIE_INNER_RADIUS : 0}
              dataKey="value"
            >
              {(config.data as ChartData[]).map((entry, index) => (
                <Cell key={`cell-${entry.label ?? index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {renderOverlay(config)}
          </PieChart>
        );

      default:
        return (
          <div
            className="flex items-center justify-center h-full text-muted-foreground"
            role="alert"
          >
            {t(ANALYTICS_KEYS.chart.noData)}: {config.type}
          </div>
        );
    }
  };

  return (
    <div
      className={cn("w-full", config.aspectRatio ?? "aspect-video", className)}
      style={{
        height: typeof chartHeight === "number" ? `${chartHeight}px` : chartHeight,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
