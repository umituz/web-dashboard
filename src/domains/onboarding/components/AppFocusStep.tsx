/**
 * AppFocusStep
 *
 * Second step of onboarding: which platforms is the user building for.
 * Icons are Lucide components (no emoji). State mapping is
 * config-driven: each option declares which state field it toggles.
 */

import { Check, Smartphone, Monitor, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@umituz/web-design-system/utils";
import type {
  OnboardingState,
  AppTypeOption,
} from "../types/onboarding";
import { ONBOARDING_KEYS } from "../utils/i18nKeys";

export interface AppFocusStepProps {
  state: OnboardingState;
  updateState: (updates: Partial<OnboardingState>) => void;
  appTypes?: AppTypeOption[];
}

/**
 * Each option toggles a `stateField` of OnboardingState. This keeps the
 * wizard data-driven — adding a new platform doesn't require a code
 * change in this file. Consumer-supplied options may omit `stateField`;
 * it is then derived from the well-known ids below.
 */
type AppFocusStateField = NonNullable<AppTypeOption["stateField"]>;

const DEFAULT_STATE_FIELD_BY_ID: Record<string, AppFocusStateField> = {
  mobile: "hasMobileApp",
  web: "hasWebApp",
};

const DEFAULT_OPTIONS: AppTypeOption[] = [
  {
    id: "mobile",
    name: "Mobile App",
    description: "iOS or Android application",
    icon: Smartphone,
    stateField: "hasMobileApp",
  },
  {
    id: "web",
    name: "Web App",
    description: "Web application or website",
    icon: Monitor,
    stateField: "hasWebApp",
  },
];

export const AppFocusStep = ({
  state,
  updateState,
  appTypes,
}: AppFocusStepProps) => {
  const { t } = useTranslation();

  const resolveStateField = (option: AppTypeOption): AppFocusStateField | undefined =>
    option.stateField ?? DEFAULT_STATE_FIELD_BY_ID[option.id];

  const types = (appTypes ?? DEFAULT_OPTIONS).map((option) => ({
    ...option,
    resolvedField: resolveStateField(option),
  }));

  const toggle = (option: AppTypeOption, field: AppFocusStateField) => {
    const current = Boolean(state[field]);
    updateState({ [field]: !current } as Partial<OnboardingState>);
  };

  const anySelected = types.some((type) =>
    type.resolvedField ? Boolean(state[type.resolvedField]) : false,
  );

  return (
    <div className="w-full max-w-xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          {t(ONBOARDING_KEYS.appFocus.title)}
        </h1>
        <p className="text-muted-foreground">
          {t(ONBOARDING_KEYS.appFocus.description)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4" role="group" aria-label={t(ONBOARDING_KEYS.appFocus.title)}>
        {types.map((type) => {
          const isSelected = type.resolvedField
            ? Boolean(state[type.resolvedField])
            : false;
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => type.resolvedField && toggle(type, type.resolvedField)}
              className={cn(
                "w-full flex items-center gap-4 p-6 rounded-2xl border bg-background text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isSelected
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                  : "border-border hover:border-primary/40",
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-foreground shrink-0 transition-transform",
                  isSelected && "scale-110 bg-primary/10 text-primary",
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>

              <div className="flex-1">
                <p className="font-bold text-foreground text-lg">{type.name}</p>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>

              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30",
                )}
                aria-hidden="true"
              >
                {isSelected && <Check className="h-4 w-4" />}
              </div>
            </button>
          );
        })}
      </div>

      {anySelected && (
        <p
          className="mt-8 text-center text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500 flex items-center justify-center gap-2"
          role="status"
          aria-live="polite"
        >
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          {t(ONBOARDING_KEYS.appFocus.success)}
        </p>
      )}
    </div>
  );
};

export default AppFocusStep;
