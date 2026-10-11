/**
 * PlanStep
 *
 * Subscription plan selection step. All copy is i18n-keyed;
 * the 20% yearly discount is a named constant, not a magic 0.8.
 * Badge tones are semantic (`muted` | `primary` | `accent`) —
 * no data-driven utility classes.
 */

import { useMemo } from "react";
import { Check, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../primitives";
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
    badgeTone: "muted",
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
    badgeTone: "primary",
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
    badgeTone: "accent",
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
    <div className="udb-step udb-step--widest">
      <div className="udb-step__header">
        <h1 className="udb-step__title">
          {t(ONBOARDING_KEYS.plan.title)}
        </h1>
        <p className="udb-step__description udb-step__description--lg">
          {t(ONBOARDING_KEYS.plan.description, { days: trialDays })}
        </p>
      </div>

      <div className="udb-cycle-toggle-row">
        <div
          className="udb-cycle-toggle"
          role="group"
          aria-label={t(ONBOARDING_KEYS.plan.title)}
        >
          <button
            type="button"
            aria-pressed={state.billingCycle === "monthly"}
            onClick={() => updateState({ billingCycle: "monthly" })}
            className={cn(
              "udb-cycle-toggle__pill",
              state.billingCycle === "monthly" && "udb-cycle-toggle__pill--on",
            )}
          >
            {t(ONBOARDING_KEYS.plan.monthly)}
          </button>
          <button
            type="button"
            aria-pressed={state.billingCycle === "yearly"}
            onClick={() => updateState({ billingCycle: "yearly" })}
            className={cn(
              "udb-cycle-toggle__pill udb-cycle-toggle__pill--with-badge",
              state.billingCycle === "yearly" && "udb-cycle-toggle__pill--on",
            )}
          >
            {t(ONBOARDING_KEYS.plan.yearly)}
            <span
              className={cn(
                "udb-cycle-toggle__save",
                state.billingCycle === "yearly" && "udb-cycle-toggle__save--on",
              )}
            >
              {t(ONBOARDING_KEYS.plan.save, { percent: yearlyDiscountPercent })}
            </span>
          </button>
        </div>
      </div>

      <div
        className="udb-plans"
        role="radiogroup"
        aria-label={t(ONBOARDING_KEYS.plan.title)}
      >
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
                "udb-plan",
                isSelected && "udb-plan--selected",
                plan.highlight && "udb-plan--highlight",
              )}
            >
              {plan.highlight && (
                <div className="udb-plan__recommended">
                  {t(ONBOARDING_KEYS.plan.recommended)}
                </div>
              )}

              <div className="udb-plan__heading">
                <h3 className="udb-plan__name">{plan.name}</h3>
                {badge && (
                  <div className={cn("udb-plan__badge", plan.badgeTone && `udb-plan__badge--${plan.badgeTone}`)}>
                    {badge}
                  </div>
                )}
              </div>

              <p className="udb-plan__description">{plan.description}</p>

              <div className="udb-plan__price-row">
                <span className="udb-plan__price">
                  ${Math.round(planPrice)}
                </span>
                <span className="udb-plan__price-unit">
                  /{state.billingCycle === "yearly"
                    ? t(ONBOARDING_KEYS.plan.yearlyShort)
                    : t(ONBOARDING_KEYS.plan.monthlyShort)}
                </span>
              </div>

              <ul className="udb-plan__features">
                {plan.features.map((feature, i) => {
                  const text = typeof feature === "string" ? feature : feature.text;
                  const bold = typeof feature !== "string" && feature.bold;
                  return (
                    <li key={`${plan.id}-feature-${i}`} className="udb-plan__feature">
                      <span className="udb-plan__feature-check">
                        <Check className="udb-plan__feature-check-icon" aria-hidden="true" />
                      </span>
                      <span className={cn("udb-plan__feature-text", bold && "udb-plan__feature-text--bold")}>
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
        <p className="udb-step__hint" role="status" aria-live="polite">
          <Sparkles className="udb-step__hint-icon" aria-hidden="true" />
          {t(ONBOARDING_KEYS.plan.selectedPlan, { name: selectedPlan.name })}
        </p>
      )}
    </div>
  );
};

export default PlanStep;
