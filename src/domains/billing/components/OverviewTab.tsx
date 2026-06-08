/**
 * Billing — Overview Tab
 *
 * Shows the current subscription summary, usage metrics, and
 * upcoming invoice. Single responsibility: render overview data.
 */

import { useTranslation } from "react-i18next";
import { cn } from "@umituz/web-design-system/utils";
import type { BillingSummary } from "../types/billing";
import { BILLING_KEYS } from "../utils/i18nKeys";
import { UsageCard } from "./UsageCard";
import {
  formatPrice,
  getDaysRemaining,
  getPlanPrice,
  getStatusColor,
  getStatusLabel,
} from "../utils/billing";

export interface OverviewTabProps {
  billing: BillingSummary;
  locale: string;
}

export const OverviewTab = ({ billing, locale }: OverviewTabProps) => {
  const { t } = useTranslation();
  const { subscription, usage, upcomingInvoice } = billing;

  return (
    <div className="space-y-6">
      <section
        className="p-6 rounded-xl border border-border bg-background"
        aria-labelledby="overview-subscription-heading"
      >
        <h3 id="overview-subscription-heading" className="text-lg font-semibold text-foreground mb-4">
          {t(BILLING_KEYS.portal.overview.currentSubscription)}
        </h3>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">
              {subscription.plan.name}
            </p>
            <p className={cn("text-sm font-medium", getStatusColor(subscription.status))}>
              {getStatusLabel(subscription.status)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatPrice(
                getPlanPrice(subscription.plan, subscription.cycle),
                subscription.plan.currency,
              )}
              /{subscription.cycle}
            </p>
          </div>
          <div className="text-right">
            {subscription.status === "trialing" && subscription.trialEnd && (
              <p className="text-sm text-muted-foreground">
                {getDaysRemaining(subscription.trialEnd)}{' '}
                {t(BILLING_KEYS.portal.overview.trialDaysLeft)}
              </p>
            )}
            {upcomingInvoice && (
              <p className="text-sm text-muted-foreground">
                {t(BILLING_KEYS.portal.overview.nextBilling)}{' '}
                {new Date(upcomingInvoice.date).toLocaleDateString(locale)}
              </p>
            )}
          </div>
        </div>
      </section>

      {usage.length > 0 && (
        <section
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          aria-label={t(BILLING_KEYS.common.usage)}
        >
          {usage.map((metric) => (
            <UsageCard key={metric.id} metric={metric} />
          ))}
        </section>
      )}

      {upcomingInvoice && (
        <section
          className="p-6 rounded-xl border border-border bg-background"
          aria-labelledby="overview-upcoming-heading"
        >
          <h3 id="overview-upcoming-heading" className="text-lg font-semibold text-foreground mb-2">
            {t(BILLING_KEYS.portal.overview.upcomingInvoice)}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">
                {formatPrice(upcomingInvoice.amount, upcomingInvoice.currency)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(BILLING_KEYS.invoice.due)}{' '}
                {new Date(upcomingInvoice.date).toLocaleDateString(locale)}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
