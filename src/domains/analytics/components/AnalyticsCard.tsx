import { Loader2, AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@umituz/web-design-system/organisms";
import { cn } from "@umituz/web-design-system/utils/cn";
import type { AnalyticsCardProps } from "../types/analytics";
import { MetricCard } from "./MetricCard";
import { AnalyticsChart } from "./AnalyticsChart";

const SURFACE_CLASS = {
  sm: "udb-card--sm",
  md: undefined,
  lg: "udb-card--lg",
  full: undefined,
} as const;

export const AnalyticsCard = ({
  title,
  description,
  chart,
  metrics,
  size = "md",
  loading = false,
  error,
  className,
  children,
}: AnalyticsCardProps) => {
  if (loading) {
    return (
      <Card className={cn(SURFACE_CLASS[size], className)}>
        <div className="udb-analytics-card__status" role="status">
          <Loader2 className="udb-spin udb-analytics-card__spinner" aria-hidden="true" />
        </div>

      </Card>

    );
  }

  if (error) {
    return (
      <Card className={cn(SURFACE_CLASS[size], className)}>
        <div className="udb-analytics-card__status udb-analytics-card__status--error" role="alert">
          <AlertCircle className="udb-analytics-card__error-icon" aria-hidden="true" />
          <p className="udb-analytics-card__error-text">{error}</p>

        </div>

      </Card>

    );
  }

  return (
    <Card className={cn(SURFACE_CLASS[size], className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}

          {description && <CardDescription>{description}</CardDescription>}

        </CardHeader>

      )}
      <CardContent>
        {chart && <AnalyticsChart config={chart} />}
        {metrics && metrics.length > 0 && (
          <div className="udb-analytics-card__metrics">
            {metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} size="sm" />
            ))}
          </div>

        )}
        {children}
      </CardContent>

    </Card>

  );
};

export default AnalyticsCard;
