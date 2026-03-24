/**
 * Analytics Chart Component
 *
 * Configurable chart component using Recharts
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
import { cn } from "@umituz/web-design-system/utils";
import type { ChartConfig } from "../types/analytics";
import { generateChartColors } from "../utils/analytics";

interface AnalyticsChartProps {
  /** Chart configuration */
  config: ChartConfig;
  /** Custom class name */
  className?: string;
  /** Custom height */
  height?: number | string;
}

export const AnalyticsChart = ({ config, className, height }: AnalyticsChartProps) => {
  const colors = useMemo(
    () => config.colors || generateChartColors(config.yAxisKeys?.length || 5),
    [config.colors, config.yAxisKeys]
  );

  const renderChart = () => {
    const commonProps = {
      data: config.data,
      margin: { top: 10, right: 10, left: 10, bottom: 10 },
    };

    switch (config.type) {
      case "line":
        return (
          <LineChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />}
            <XAxis
              dataKey={config.xAxisKey}
              className="text-xs text-muted-foreground"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              className="text-xs text-muted-foreground"
              axisLine={false}
              tickLine={false}
            />
            {config.showTooltip && <Tooltip />}
            {config.showLegend && <Legend />}
            {config.yAxisKeys?.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index]}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />}
            <XAxis
              dataKey={config.xAxisKey}
              className="text-xs text-muted-foreground"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              className="text-xs text-muted-foreground"
              axisLine={false}
              tickLine={false}
            />
            {config.showTooltip && <Tooltip />}
            {config.showLegend && <Legend />}
            {config.yAxisKeys?.map((key, index) => (
              <Bar key={key} dataKey={key} fill={colors[index]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />}
            <XAxis
              dataKey={config.xAxisKey}
              className="text-xs text-muted-foreground"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              className="text-xs text-muted-foreground"
              axisLine={false}
              tickLine={false}
            />
            {config.showTooltip && <Tooltip />}
            {config.showLegend && <Legend />}
            {config.yAxisKeys?.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index]}
                fill={colors[index]}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );

      case "pie":
      case "donut":
        return (
          <PieChart {...commonProps}>
            <Pie
              data={config.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              innerRadius={config.type === "donut" ? 40 : 0}
              dataKey="value"
            >
              {config.data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {config.showTooltip && <Tooltip />}
            {config.showLegend && <Legend />}
          </PieChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Unsupported chart type: {config.type}
          </div>
        );
    }
  };

  const chartHeight = height || config.height || 300;

  return (
    <div
      className={cn(
        "w-full",
        config.aspectRatio || "aspect-video",
        className
      )}
      style={{ height: typeof chartHeight === "number" ? `${chartHeight}px` : chartHeight }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
