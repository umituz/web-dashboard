/**
 * Billing — Plan Tab
 *
 * Active plan summary + change/cancel actions.
 * Replaces the previous "Plan management coming soon..." placeholder
 * with a fully functional surface.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@umituz/web-design-system/atoms";
import type { Subscription } from "../types/billing";
import { BILLING_KEYS } from "../utils/i18nKeys";
import { formatPrice, getPlanPrice, getStatusColor, getStatusLabel } from "../utils/billing";

export interface PlanTabProps {
  subscription: Subscription;
  onChangePlan?: () => void;
  onCancelSubscription?: () => void | Promise<void>;
  locale?: string;
}

const LOCALE = 'en-US';

export const PlanTab = ({
  subscription,
  onChangePlan,
  onCancelSubscription,
}: PlanTabProps) => {
  const { t } = useTranslation();
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!onCancelSubscription) return;
    if (!confirmingCancel) {
      setConfirmingCancel(true);
      return;
    }
    setCancelling(true);
    try {
      await onCancelSubscription();
    } finally {
      setCancelling(false);
      setConfirmingCancel(false);
    }
  };

  const isActive = subscription.status === "active" || subscription.status === "trialing";

  return (
    <div className="space-y-6">
      <section
        className="p-6 rounded-xl border border-border bg-background"
        aria-labelledby="plan-current-heading"
      >
        <h3 id="plan-current-heading" className="text-lg font-semibold text-foreground mb-4">
          {t(BILLING_KEYS.portal.plan.title)}
        </h3>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-3xl font-bold text-foreground">{subscription.plan.name}</p>
            <p className={getStatusColor(subscription.status) + " text-sm font-medium mt-1"}>
              {getStatusLabel(subscription.status)}
            </p>
            <p className="text-2xl font-bold text-foreground mt-3">
              {formatPrice(
                getPlanPrice(subscription.plan, subscription.cycle),
                subscription.plan.currency,
              )}
              <span className="text-sm font-normal text-muted-foreground">
                /{subscription.cycle}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {subscription.currentPeriodStart &&
                new Date(subscription.currentPeriodStart).toLocaleDateString(LOCALE)}
              {' → '}
              {subscription.currentPeriodEnd &&
                new Date(subscription.currentPeriodEnd).toLocaleDateString(LOCALE)}
            </p>
          </div>

          {isActive ? (
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" aria-hidden="true" />
          ) : (
            <XCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
          )}
        </div>
      </section>

      <section
        className="p-6 rounded-xl border border-border bg-background"
        aria-labelledby="plan-actions-heading"
      >
        <h4 id="plan-actions-heading" className="font-semibold text-foreground mb-4">
          {t(BILLING_KEYS.portal.plan.actionsTitle)}
        </h4>
        <div className="flex flex-wrap gap-3">
          {onChangePlan && (
            <Button onClick={onChangePlan} variant="default">
              {t(BILLING_KEYS.portal.plan.changePlan)}
            </Button>
          )}
          {onCancelSubscription && isActive && (
            <Button
              onClick={handleCancel}
              variant={confirmingCancel ? "destructive" : "outline"}
              disabled={cancelling}
            >
              {cancelling
                ? t(BILLING_KEYS.portal.plan.cancelling)
                : confirmingCancel
                ? t(BILLING_KEYS.portal.plan.confirmCancel)
                : t(BILLING_KEYS.portal.plan.cancelSubscription)}
            </Button>
          )}
        </div>

        {confirmingCancel && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-destructive"
          >
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
            <span>{t(BILLING_KEYS.portal.plan.cancelConfirmMessage)}</span>
          </div>
        )}
      </section>
    </div>
  );
};
