import { Check } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import type { OnboardingState, PlanOption } from "../types/onboarding";

interface PlanStepProps {
  /** Current onboarding state */
  state: OnboardingState;
  /** Update state function */
  updateState: (updates: Partial<OnboardingState>) => void;
  /** Plan options */
  plans?: PlanOption[];
}

/**
 * Plan Selection Step
 *
 * Fourth step - select subscription plan
 */
export const PlanStep = ({
  state,
  updateState,
  plans,
}: PlanStepProps) => {
  // Default plans
  const defaultPlans: PlanOption[] = [
    {
      id: "standard",
      name: "Standard",
      badge: "Most Popular",
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
      badge: "Best Value",
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
      badge: "Custom",
      badgeColor: "bg-purple-600 text-white",
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

  const planOptions = plans || defaultPlans;

  // Calculate price with billing cycle discount
  const getPlanPrice = (plan: PlanOption) => {
    const basePrice = plan.price;
    return state.billingCycle === "yearly" ? basePrice * 12 * 0.8 : basePrice; // 20% discount
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          Choose your plan
        </h1>
        <p className="text-muted-foreground text-lg">
          Start with a 14-day free trial - no credit card required
        </p>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-2 mb-12">
        <div className="flex bg-muted rounded-full p-1.5 border border-border">
          <button
            onClick={() => updateState({ billingCycle: "monthly" })}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all",
              state.billingCycle === "monthly"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => updateState({ billingCycle: "yearly" })}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2",
              state.billingCycle === "yearly"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Yearly
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full transition-colors",
                state.billingCycle === "yearly" ? "bg-white/20 text-white" : "bg-green-500/10 text-green-600"
              )}
            >
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {planOptions.map((plan) => {
          const isSelected = state.selectedPlan === plan.id;
          const planPrice = getPlanPrice(plan);

          return (
            <button
              key={plan.id}
              onClick={() => updateState({ selectedPlan: plan.id })}
              className={cn(
                "bg-background border-2 rounded-[32px] p-8 text-left transition-all hover:translate-y-[-4px] relative",
                isSelected
                  ? "border-primary ring-4 ring-primary/10"
                  : "border-border hover:border-primary/40",
                plan.highlight && "shadow-xl"
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                  Recommended
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-foreground">{plan.name}</h3>
                {plan.badge && (
                  <div
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                      plan.badgeColor
                    )}
                  >
                    {plan.badge}
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
                    <li key={i} className="flex items-start gap-3 text-sm font-medium">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
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

      {state.selectedPlan && (
        <p className="mt-8 text-center text-sm text-muted-foreground animate-in fade-in">
          ✨ Great choice! You selected the {planOptions.find((p) => p.id === state.selectedPlan)?.name} plan
        </p>
      )}
    </div>
  );
};

export default PlanStep;
