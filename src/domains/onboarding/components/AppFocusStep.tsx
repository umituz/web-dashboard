/**
 * AppFocusStep
 *
 * Second step of onboarding: which platforms is the user building for.
 * Icons are Lucide components (no emoji). State mapping is
 * config-driven: each option declares which state field it toggles.
 */

import { Check, Smartphone, Monitor, Sparkles } from "lucide-react";
import { useT } from "../../../i18n";
import { cn } from "../../../primitives";
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
  const t = useT();

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
    <div className="udb-step">
      <div className="udb-step__header">
        <h1 className="udb-step__title">
          {t(ONBOARDING_KEYS.appFocus.title)}
        </h1>
        <p className="udb-step__description">
          {t(ONBOARDING_KEYS.appFocus.description)}
        </p>
      </div>

      <div className="udb-step__options udb-step__options--list" role="group" aria-label={t(ONBOARDING_KEYS.appFocus.title)}>
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
                "udb-choice",
                isSelected && "udb-choice--selected",
              )}
            >
              <span
                className={cn(
                  "udb-choice__icon-box udb-choice__icon-box--lg",
                  isSelected && "udb-choice__icon-box--on",
                )}
              >
                <Icon className="udb-choice__icon udb-choice__icon--lg" aria-hidden="true" />
              </span>

              <span className="udb-choice__body">
                <span className="udb-choice__label udb-choice__label--lg">{type.name}</span>
                <span className="udb-choice__description">{type.description}</span>
              </span>

              <span
                className={cn(
                  "udb-choice__check",
                  isSelected && "udb-choice__check--on",
                )}
                aria-hidden="true"
              >
                {isSelected && <Check className="udb-choice__check-icon" />}
              </span>
            </button>
          );
        })}
      </div>

      {anySelected && (
        <p className="udb-step__hint" role="status" aria-live="polite">
          <Sparkles className="udb-step__hint-icon" aria-hidden="true" />
          {t(ONBOARDING_KEYS.appFocus.success)}
        </p>
      )}
    </div>
  );
};

export default AppFocusStep;
