/**
 * PlanStep
 *
 * Subscription plan selection step. All copy is i18n-keyed;
 * the 20% yearly discount is a named constant, not a magic 0.8.
 */

import { useMemo } from "react";
import { Check, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@umituz/web-design-system/utils";
import type { OnboardingState, PlanOption } from "../types/onboarding";
import { ONBOARDING_KEYS } from "../utils/i18nKeys";

export interface PlanStepProps {
  state: OnboardingState;
  updateState: (updates: Partial<OnboardingState>) => void;
  plans?: PlanOption[];
  /** Yearly discount percentage (0-100). Default 20. */
  yearlyDiscountPercent?: number;
  /** Free trial duration in days, shown in the subtitle. Default 14. */
  trialDays?: number;
}

const MONTHS_IN_YEAR = 12;
const DEFAULT_YEARLY_DISCOUNT = 20;
const DEFAULT_TRIAL_DAYS = 14;

const DEFAULT_PLANS: PlanOption[] = [
  {
    id: "standard",
    name: "Standard",
    badgeKey: ONBOARDING_KEYS.plan.mostPopular,
    badgeColor: "bg-muted text-muted-foreground",
    description: "Perfect for individuals and small businesses",
    price: 12,
    features: [
      { text: "3 Social Accounts", bold: true },
      "100 posts per month",
      "Basic Analytics",
      "Email Support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    badgeKey: ONBOARDING_KEYS.plan.bestValue,
    badgeColor: "bg-primary text-primary-foreground",
    description: "For growing businesses and teams",
    price: 29,
    features: [
      { text: "15 Social Accounts", bold: true },
      "Unlimited posts",
      "Advanced Analytics",
      "AI Caption Suggestions",
      { text: "5 Team Members", bold: true },
      "Priority Support",
    ],
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    badgeKey: ONBOARDING_KEYS.plan.custom,
    badgeColor: "bg-accent text-accent-foreground",
    description: "For large organizations with custom needs",
    price: 99,
    features: [
      { text: "Unlimited Accounts", bold: true },
      "Unlimited everything",
      "Custom Integrations",
      "Dedicated Account Manager",
      "24/7 Phone Support",
      "SLA Guarantee",
    ],
  },
];

export const PlanStep = ({
  state,
  updateState,
  plans,
  yearlyDiscountPercent = DEFAULT_YEARLY_DISCOUNT,
  trialDays = DEFAULT_TRIAL_DAYS,
}: PlanStepProps) => {
  const { t } = useTranslation();
  const planOptions = plans ?? DEFAULT_PLANS;

  /**
   * Pure function for plan pricing — given a base monthly price and
   * a cycle, return the effective price. The discount multiplier
   * is derived from the named constant; no more magic 0.8.
   */
  const getPlanPrice = (plan: PlanOption): number => {
    const base = plan.price;
    if (state.billingCycle === "yearly") {
      return (base * MONTHS_IN_YEAR * (100 - yearlyDiscountPercent)) / 100;
    }
    return base;
  };

  const selectedPlan = useMemo(
    () => planOptions.find((p) => p.id === state.selectedPlan) ?? null,
    [planOptions, state.selectedPlan],
  );

  return (
    <div className="w-full max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          {t(ONBOARDING_KEYS.plan.title)}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t(ONBOARDING_KEYS.plan.description, { days: trialDays })}
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-12" role="radiogroup" aria-label={t(ONBOARDING_KEYS.plan.title)}>
        <div className="flex bg-muted rounded-full p-1.5 border border-border">
          <button
            type="button"
            role="radio"
            aria-checked={state.billingCycle === "monthly"}
            onClick={() => updateState({ billingCycle: "monthly" })}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              state.billingCycle === "monthly"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t(ONBOARDING_KEYS.plan.monthly)}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={state.billingCycle === "yearly"}
            onClick={() => updateState({ billingCycle: "yearly" })}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              state.billingCycle === "yearly"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t(ONBOARDING_KEYS.plan.yearly)}
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full transition-colors",
                state.billingCycle === "yearly"
                  ? "bg-white/20 text-white"
                  : "bg-success/10 text-success",
              )}
            >
              {t(ONBOARDING_KEYS.plan.save, { percent: yearlyDiscountPercent })}
            </span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {planOptions.map((plan) => {
          const isSelected = state.selectedPlan === plan.id;
          const planPrice = getPlanPrice(plan);
          const badge = plan.badge ?? (plan.badgeKey ? t(plan.badgeKey) : undefined);

          return (
            <button
              key={plan.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => updateState({ selectedPlan: plan.id })}
              className={cn(
                "bg-background border-2 rounded-3xl p-8 text-left transition-all relative",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isSelected
                  ? "border-primary ring-4 ring-primary/10"
                  : "border-border hover:border-primary/40",
                plan.highlight && "shadow-xl",
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                  {t(ONBOARDING_KEYS.plan.recommended)}
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-foreground">{plan.name}</h3>
                {badge && (
                  <div
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                      plan.badgeColor,
                    )}
                  >
                    {badge}
                  </div>
                )}
              </div>

              <p className="text-muted-foreground mb-8 font-medium">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-foreground">
                  ${Math.round(planPrice)}
                </span>
                <span className="text-lg font-bold text-muted-foreground">/mo</span>
              </div>

              <ul className="space-y-4">
                {plan.features.map((feature, i) => {
                  const text = typeof feature === "string" ? feature : feature.text;
                  const bold = typeof feature !== "string" && feature.bold;
                  return (
                    <li key={`${plan.id}-feature-${i}`} className="flex items-start gap-3 text-sm font-medium">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                      </div>
                      <span className={cn("text-foreground/90", bold && "font-black")}>
                        {text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </button>
          );
        })}
      </div>

      {selectedPlan && (
        <p
          className="mt-8 text-center text-sm text-muted-foreground animate-in fade-in flex items-center justify-center gap-2"
          role="status"
          aria-live="polite"
        >
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          {t(ONBOARDING_KEYS.plan.selectedPlan, { name: selectedPlan.name })}
        </p>
      )}
    </div>
  );
};

export default PlanStep;
