/**
 * User Type Step
 *
 * First step of the onboarding wizard: select user type.
 * String props are expected to be already-translated by the consumer
 * (so the consumer can localize each option via i18n).
 */

import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@umituz/web-design-system/utils";
import type { OnboardingState, UserTypeOption } from "../types/onboarding";
import type { ComponentType } from "react";
import { ONBOARDING_KEYS } from "../utils/i18nKeys";

export interface UserTypeStepProps {
  /** Current onboarding state */
  state: OnboardingState;
  /** Update state function */
  updateState: (updates: Partial<OnboardingState>) => void;
  /** User type options — labels/desc are translated by the consumer */
  options?: UserTypeOption[];
  /** Custom icon component type (avoids `React.ComponentType` import here) */
  iconComponent?: ComponentType<{ className?: string }>;
}

/**
 * Default options — every string is an i18n key. The consumer
 * supplies translations; nothing in this file is hardcoded copy.
 */
const DEFAULT_OPTIONS: UserTypeOption[] = [
  { id: "founder", labelKey: ONBOARDING_KEYS.defaults.founder, descriptionKey: ONBOARDING_KEYS.defaults.founderDescription },
  { id: "creator", labelKey: ONBOARDING_KEYS.defaults.contentCreator, descriptionKey: ONBOARDING_KEYS.defaults.contentCreatorDescription },
  { id: "agency", labelKey: ONBOARDING_KEYS.defaults.agency, descriptionKey: ONBOARDING_KEYS.defaults.agencyDescription },
  { id: "enterprise", labelKey: ONBOARDING_KEYS.defaults.enterprise, descriptionKey: ONBOARDING_KEYS.defaults.enterpriseDescription },
  { id: "small-business", labelKey: ONBOARDING_KEYS.defaults.smallBusiness, descriptionKey: ONBOARDING_KEYS.defaults.smallBusinessDescription },
  { id: "personal", labelKey: ONBOARDING_KEYS.defaults.personal, descriptionKey: ONBOARDING_KEYS.defaults.personalDescription },
];

export const UserTypeStep = ({
  state,
  updateState,
  options = [],
}: UserTypeStepProps) => {
  const { t } = useTranslation();
  const userTypeOptions = options.length > 0 ? options : DEFAULT_OPTIONS;

  return (
    <div className="w-full max-w-xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          {t(ONBOARDING_KEYS.userType.title)}
        </h1>
        <p className="text-muted-foreground">
          {t(ONBOARDING_KEYS.userType.description)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3" role="radiogroup" aria-label={t(ONBOARDING_KEYS.userType.title)}>
        {userTypeOptions.map((option) => {
          const isSelected = state.selectedUserType === option.id;
          const hasBadge = option.badge != null;
          const hasIcon = option.icon != null;
          const label = option.label ?? (option.labelKey ? t(option.labelKey) : '');
          const description = option.description ?? (option.descriptionKey ? t(option.descriptionKey) : '');

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => updateState({ selectedUserType: option.id })}
              className={cn(
                "w-full flex items-center gap-4 p-5 rounded-2xl border bg-background text-left transition-all group",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isSelected
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-muted/50",
              )}
            >
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

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-foreground">{label}</p>
                  {hasBadge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
              </div>

              {hasIcon && option.icon && (
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <option.icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
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
