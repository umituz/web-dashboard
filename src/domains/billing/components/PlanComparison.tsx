/**
 * Plan Comparison Component
 *
 * Configurable plan selection and comparison
 */

import { Check, Loader2 } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import { Button } from "@umituz/web-design-system/atoms";
import type { PlanComparisonProps } from "../types/billing";
import { formatPrice, getPlanPrice, calculateDiscount, isPopularPlan, formatFeature } from "../utils/billing";

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
  const handleCycleChange = (newCycle: "monthly" | "yearly") => {
    onCycleChange?.(newCycle);
  };

  const handleSelectPlan = (planId: string) => {
    if (!loading) {
      onPlanSelect?.(planId);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Billing Cycle Toggle */}
      {showCycleToggle && (
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center bg-muted rounded-full p-1">
            <button
              onClick={() => handleCycleChange("monthly")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                cycle === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => handleCycleChange("yearly")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all relative",
                cycle === "yearly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Yearly
              <span className="ml-1 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const price = getPlanPrice(plan, cycle);
          const isPopular = isPopularPlan(plan, plans);
          const discount = calculateDiscount(plan.monthlyPrice, plan.yearlyPrice);

          return (
            <div
              key={plan.id}
              className={cn(
                "relative bg-background border-2 rounded-2xl p-6 transition-all",
                isSelected
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/50",
                isPopular && "border-primary shadow-lg shadow-primary/20"
              )}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Badge */}
              {plan.badge && (
                <div className="mb-4">
                  <span
                    className={cn(
                      "text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full",
                      plan.badgeColor || "bg-primary/10 text-primary"
                    )}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {plan.name}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-6">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">
                    {formatPrice(price, plan.currency)}
                  </span>
                  <span className="text-muted-foreground">
                    /{cycle === "monthly" ? "mo" : "yr"}
                  </span>
                </div>

                {cycle === "yearly" && (
                  <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                    Save {discount}% with yearly billing
                  </p>
                )}
              </div>

              {/* Features */}
              {showFeatures && plan.features.length > 0 && (
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, index) => {
                    const { text, bold, included } = formatFeature(feature);

                    return (
                      <li
                        key={index}
                        className={cn(
                          "flex items-start gap-3 text-sm",
                          included === false && "opacity-50 line-through"
                        )}
                      >
                        <Check
                          className={cn(
                            "h-5 w-5 shrink-0 mt-0.5",
                            included === false
                              ? "text-muted-foreground"
                              : "text-primary"
                          )}
                        />
                        <span className={cn(bold && "font-semibold", "text-foreground")}>
                          {text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Select Button */}
              <Button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading}
                className={cn(
                  "w-full rounded-full py-6",
                  isSelected || isPopular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-foreground hover:bg-muted/80"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : isSelected ? (
                  "Current Plan"
                ) : (
                  "Select Plan"
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanComparison;
