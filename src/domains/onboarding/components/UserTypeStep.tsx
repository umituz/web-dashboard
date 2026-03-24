import { Check } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import type { OnboardingState } from "../types/onboarding";

interface UserTypeStepProps {
  /** Current onboarding state */
  state: OnboardingState;
  /** Update state function */
  updateState: (updates: Partial<OnboardingState>) => void;
  /** User type options */
  options?: Array<{
    id: string;
    label: string;
    description: string;
    icon?: React.ComponentType<{ className?: string }>;
    badge?: string;
  }>;
}

/**
 * User Type Selection Step
 *
 * First step of onboarding - select user type/category
 */
export const UserTypeStep = ({
  state,
  updateState,
  options = [],
}: UserTypeStepProps) => {
  // Default options if not provided
  const defaultOptions = [
    {
      id: "founder",
      label: "Founder",
      description: "Building your own startup or business",
    },
    {
      id: "creator",
      label: "Content Creator",
      description: "Creating content for social media and platforms",
    },
    {
      id: "agency",
      label: "Agency",
      description: "Managing multiple client accounts",
    },
    {
      id: "enterprise",
      label: "Enterprise",
      description: "Large scale organization with teams",
    },
    {
      id: "small-business",
      label: "Small Business",
      description: "Local or niche business owner",
    },
    {
      id: "personal",
      label: "Personal",
      description: "Individual looking to grow personal brand",
    },
  ];

  const userTypeOptions = options.length > 0 ? options : defaultOptions;

  return (
    <div className="w-full max-w-xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          What describes you best?
        </h1>
        <p className="text-muted-foreground">
          Select the option that best describes your situation
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {userTypeOptions.map((option) => {
          const isSelected = state.selectedUserType === option.id;

          return (
            <button
              key={option.id}
              onClick={() => updateState({ selectedUserType: option.id })}
              className={cn(
                "w-full flex items-center gap-4 p-5 rounded-2xl border bg-background text-left transition-all group",
                isSelected
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-muted/50"
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-muted-foreground/30"
                )}
              >
                {isSelected && <Check className="h-4 w-4" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-foreground">{option.label}</p>
                  {"badge" in option && option.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {option.description}
                </p>
              </div>

              {"icon" in option && option.icon && (
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <option.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserTypeStep;
