import { useMemo } from "react";
import { calculatePasswordStrength } from "../../utils/auth";
import { cn } from "@umituz/web-design-system/utils/cn";

const STRENGTH_KEYS = {
  weak: 'auth.passwordStrength.weak',
  fair: 'auth.passwordStrength.fair',
  good: 'auth.passwordStrength.good',
  strong: 'auth.passwordStrength.strong',
} as const;

type StrengthBand = keyof typeof STRENGTH_KEYS;

const scoreToBand = (score: number): StrengthBand => {
  if (score < 25) return 'weak';
  if (score < 50) return 'fair';
  if (score < 75) return 'good';
  return 'strong';
};

export interface PasswordStrengthIndicatorProps {
  password: string;
  translate: (key: string) => string;
}

export const PasswordStrengthIndicator = ({
  password,
  translate,
}: PasswordStrengthIndicatorProps) => {
  const { band, filledSegments } = useMemo(() => {
    const value = calculatePasswordStrength(password);
    const resolvedBand = scoreToBand(value);
    const segments = Math.round(value / 25);
    return {
      band: resolvedBand,
      filledSegments: segments,
    };
  }, [password]);

  if (!password) return null;

  return (
    <div className="udb-strength" aria-live="polite">
      <div className="udb-strength__bars">
        {[0, 1, 2, 3].map((segment) => {
          const isActive = segment < filledSegments;
          return (
            <div
              key={segment}
              className={cn(
                "udb-strength__bar",
                isActive && `udb-strength__bar--${band}`,
              )}
            />
          );
        })}
      </div>
      <p className={cn("udb-strength__label", `udb-strength__label--${band}`)}>
        {translate(STRENGTH_KEYS[band])}
      </p>
    </div>
  );
};
