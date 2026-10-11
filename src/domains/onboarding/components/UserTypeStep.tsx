/**
 * User Type Step
 *
 * First step of the onboarding wizard: select user type.
 * String props are expected to be already-translated by the consumer
 * (so the consumer can localize each option via i18n).
 */

import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../primitives";
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
    <div className="udb-step">
      <div className="udb-step__header">
        <h1 className="udb-step__title">
          {t(ONBOARDING_KEYS.userType.title)}
        </h1>
        <p className="udb-step__description">
          {t(ONBOARDING_KEYS.userType.description)}
        </p>
      </div>

      <div className="udb-step__options udb-step__options--list" role="radiogroup" aria-label={t(ONBOARDING_KEYS.userType.title)}>
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
                "udb-choice",
                isSelected && "udb-choice--selected",
              )}
            >
              <span
                className={cn(
                  "udb-choice__check",
                  isSelected && "udb-choice__check--on",
                )}
                aria-hidden="true"
              >
                {isSelected && <Check className="udb-choice__check-icon" />}
              </span>

              <span className="udb-choice__body">
                <span className="udb-choice__label-row">
                  <span className="udb-choice__label">{label}</span>
                  {hasBadge && (
                    <span className="udb-choice__badge">
                      {option.badge}
                    </span>
                  )}
                </span>
                <span className="udb-choice__description">{description}</span>
              </span>

              {hasIcon && option.icon && (
                <span className="udb-choice__icon-box">
                  <option.icon className="udb-choice__icon" aria-hidden="true" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserTypeStep;
