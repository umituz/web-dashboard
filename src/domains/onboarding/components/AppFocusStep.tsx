import { Check } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import type { OnboardingState } from "../types/onboarding";

interface AppFocusStepProps {
  /** Current onboarding state */
  state: OnboardingState;
  /** Update state function */
  updateState: (updates: Partial<OnboardingState>) => void;
  /** Custom app type options */
  appTypes?: Array<{
    id: string;
    label: string;
    description: string;
    icon: string;
  }>;
}

/**
 * App Focus Selection Step
 *
 * Second step - select which app types to focus on (mobile/web)
 */
export const AppFocusStep = ({
  state,
  updateState,
  appTypes,
}: AppFocusStepProps) => {
  // Default app types
  const defaultAppTypes = [
    {
      id: "mobile",
      label: "Mobile App",
      description: "iOS or Android application",
      icon: "📱",
    },
    {
      id: "web",
      label: "Web App",
      description: "Web application or website",
      icon: "💻",
    },
  ];

  const types = appTypes || defaultAppTypes;

  return (
    <div className="w-full max-w-xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          What type of app are you building?
        </h1>
        <p className="text-muted-foreground">
          Select all that apply - you can change this later
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {types.map((type) => {
          const isSelected = type.id === "mobile" ? state.hasMobileApp : state.hasWebApp;

          return (
            <button
              key={type.id}
              onClick={() => {
                if (type.id === "mobile") {
                  updateState({ hasMobileApp: !state.hasMobileApp });
                } else {
                  updateState({ hasWebApp: !state.hasWebApp });
                }
              }}
              className={cn(
                "w-full flex items-center gap-4 p-6 rounded-2xl border bg-background text-left transition-all",
                isSelected ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/40"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-2xl shrink-0 transition-transform",
                  isSelected && "scale-110"
                )}
              >
                {type.icon}
              </div>

              <div className="flex-1">
                <p className="font-bold text-foreground text-lg">{type.label}</p>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>

              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                  isSelected ? "border-primary bg-primary text-white" : "border-muted-foreground/30"
                )}
              >
                {isSelected && <Check className="h-4 w-4" />}
              </div>
            </button>
          );
        })}
      </div>

      {(state.hasMobileApp || state.hasWebApp) && (
        <p className="mt-8 text-center text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500">
          ✨ Great choice! We'll tailor your experience accordingly.
        </p>
      )}
    </div>
  );
};

export default AppFocusStep;
