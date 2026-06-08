/**
 * Plan Comparison
 *
 * Configurable plan selection with a true radio-group semantic.
 * The grid is a single radiogroup; each plan card is a radio option.
 * Discount shown in the toggle is derived from calculateDiscount
 * (no hardcoded "17%" — the magic number is gone).
 */

import { Check, X, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@umituz/web-design-system/utils";
import { Button } from "@umituz/web-design-system/atoms";
import type { PlanComparisonProps, BillingCycle, PlanTier } from "../types/billing";
import {
  formatPrice,
  getPlanPrice,
  calculateDiscount,
  isPopularPlan,
  formatFeature,
} from "../utils/billing";
import { BILLING_KEYS } from "../utils/i18nKeys";

/**
 * Plan cards are presented as a radio group so assistive tech
 * announces selection state correctly.
 */
const RADIO_GROUP_NAME = 'plan-comparison';

export const PlanComparison = ({
  plans,
  selectedPlan,
  cycle = "monthly",
  showCycleToggle = true,
  showFeatures = true,
  onPlanSelect,
  onCycleChange,
  loading = false,
}: PlanComparisonProps) => {
  const { t } = useTranslation();
  const discount = pickLargestDiscount(plans);

  return (
    <div className="w-full space-y-8">
      {showCycleToggle && (
        <div
          className="flex items-center justify-center"
          role="group"
          aria-label={t(BILLING_KEYS.planComparison.billingCycleLabel)}
        >
          <CycleToggle cycle={cycle} onChange={onCycleChange} discountPercent={discount} />
        </div>
      )}

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        role="radiogroup"
        aria-label={t(BILLING_KEYS.planComparison.radiogroupLabel)}
      >
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.id}
            isPopular={isPopularPlan(plan, plans)}
            cycle={cycle}
            showFeatures={showFeatures}
            loading={loading}
            onSelect={onPlanSelect}
          />
        ))}
      </div>
    </div>
  );
};

interface CycleToggleProps {
  cycle: BillingCycle;
  onChange?: (cycle: BillingCycle) => void;
  discountPercent: number;
}

const CycleToggle = ({ cycle, onChange, discountPercent }: CycleToggleProps) => {
  const { t } = useTranslation();
  return (
    <div className="inline-flex items-center bg-muted rounded-full p-1">
      <button
        type="button"
        role="radio"
        aria-checked={cycle === 'monthly'}
        onClick={() => onChange?.('monthly')}
        className={cn(
          "px-6 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          cycle === 'monthly'
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {t(BILLING_KEYS.planComparison.monthly)}
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={cycle === 'yearly'}
        onClick={() => onChange?.('yearly')}
        className={cn(
          "px-6 py-2 rounded-full text-sm font-medium transition-all relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          cycle === 'yearly'
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {t(BILLING_KEYS.planComparison.yearly)}
        {discountPercent > 0 && (
          <span className="ml-1 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
            {t(BILLING_KEYS.planComparison.save).replace('{percent}', String(discountPercent))}
          </span>
        )}
      </button>
    </div>
  );
};

interface PlanCardProps {
  plan: PlanTier;
  isSelected: boolean;
  isPopular: boolean;
  cycle: BillingCycle;
  showFeatures: boolean;
  loading: boolean;
  onSelect?: (planId: string) => void;
}

const PlanCard = ({
  plan,
  isSelected,
  isPopular,
  cycle,
  showFeatures,
  loading,
  onSelect,
}: PlanCardProps) => {
  const { t } = useTranslation();
  const price = getPlanPrice(plan, cycle);
  const discount = calculateDiscount(plan.monthlyPrice, plan.yearlyPrice);

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => !loading && onSelect?.(plan.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!loading) onSelect?.(plan.id);
        }
      }}
      className={cn(
        "relative bg-background border-2 rounded-2xl p-6 transition-all cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isSelected
          ? "border-primary shadow-lg shadow-primary/20"
          : isPopular
          ? "border-primary/60 shadow-md"
          : "border-border hover:border-primary/50",
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
            {t(BILLING_KEYS.planComparison.mostPopular)}
          </span>
        </div>
      )}

      {plan.badge && (
        <div className="mb-4">
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full",
              plan.badgeColor || "bg-primary/10 text-primary",
            )}
          >
            {plan.badge}
          </span>
        </div>
      )}

      <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
      <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-foreground">
            {formatPrice(price, plan.currency)}
          </span>
          <span className="text-muted-foreground">
            /{cycle === 'monthly'
              ? t(BILLING_KEYS.planComparison.monthlyShort)
              : t(BILLING_KEYS.planComparison.yearlyShort)}
          </span>
        </div>

        {cycle === 'yearly' && discount > 0 && (
          <p className="text-sm text-success mt-1">
            {t(BILLING_KEYS.planComparison.saveWithYearly).replace('{percent}', String(discount))}
          </p>
        )}
      </div>

      {showFeatures && plan.features.length > 0 && (
        <ul className="space-y-3 mb-6 flex-1">
          {plan.features.map((feature, index) => {
            const { text, bold, included } = formatFeature(feature);
            const isExcluded = included === false;
            return (
              <li
                key={`${plan.id}-feature-${index}`}
                className={cn(
                  "flex items-start gap-3 text-sm",
                  isExcluded && "opacity-50 line-through",
                )}
              >
                {isExcluded ? (
                  <X className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
                )}
                <span className={cn(bold && "font-semibold", "text-foreground")}>
                  {text}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <Button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(plan.id);
        }}
        disabled={loading}
        aria-label={isSelected
          ? t(BILLING_KEYS.planComparison.currentPlan)
          : `${t(BILLING_KEYS.planComparison.selectPlan)} — ${plan.name}`}
        className={cn(
          "w-full rounded-full py-6",
          isSelected
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted text-foreground hover:bg-muted/80",
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
            {t(BILLING_KEYS.planComparison.processing)}
          </>
        ) : isSelected ? (
          t(BILLING_KEYS.planComparison.currentPlan)
        ) : (
          t(BILLING_KEYS.planComparison.selectPlan)
        )}
      </Button>
    </div>
  );
};

/**
 * Display the largest discount across all plans on the yearly toggle.
 * Computed from real plan prices — no hardcoded "17%".
 */
const pickLargestDiscount = (plans: PlanTier[]): number => {
  if (plans.length === 0) return 0;
  return plans.reduce((max, plan) => {
    const d = calculateDiscount(plan.monthlyPrice, plan.yearlyPrice);
    return d > max ? d : max;
  }, 0);
};

export default PlanComparison;

/**
 * Exposed for tests / extension.
 */
export { RADIO_GROUP_NAME };
