/**
 * PasswordStrengthIndicator
 *
 * Renders a 4-segment strength bar plus a localized label band.
 * The label i18n key is computed from the strength band so the
 * component stays free of hardcoded strings.
 */

import { useMemo } from "react";
import { calculatePasswordStrength } from "../../utils/auth";
import { cn } from "@umituz/web-design-system/utils";

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
    <div className="space-y-1.5" aria-live="polite">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((segment) => {
          const isActive = segment < filledSegments;
          return (
            <div
              key={segment}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                isActive
                  ? band === 'weak'
                    ? "bg-destructive"
                    : band === 'fair'
                    ? "bg-orange-500"
                    : band === 'good'
                    ? "bg-yellow-500"
                    : "bg-green-500"
                  : "bg-muted",
              )}
            />
          );
        })}
      </div>
      <p
        className={cn(
          "text-xs",
          band === 'weak' && "text-destructive",
          band === 'fair' && "text-orange-600 dark:text-orange-400",
          band === 'good' && "text-yellow-600 dark:text-yellow-400",
          band === 'strong' && "text-green-600 dark:text-green-400",
        )}
      >
        {translate(STRENGTH_KEYS[band])}
      </p>
    </div>
  );
};
