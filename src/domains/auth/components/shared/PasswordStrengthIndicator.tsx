/**
 * PasswordStrengthIndicator
 *
 * Renders a 4-segment strength bar plus a localized label band.
 * The label i18n key is computed from the strength band so the
 * component stays free of hardcoded strings. Bar/label colors come
 * from `--u-*` tones (weak/danger, fair/warning-2, good/warning,
 * strong/success).
 */

import { useMemo } from "react";
import { calculatePasswordStrength } from "../../utils/auth";
import { cn } from "../../../../primitives";

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
  /** Password to evaluate */
  password: string;
  /** Translation function */
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
