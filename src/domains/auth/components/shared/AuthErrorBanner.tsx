/**
 * AuthErrorBanner
 *
 * Inline error display for auth forms. Renders an alert with the
 * provided i18n key resolved by the consumer's translation function.
 */

import { AlertCircle } from "lucide-react";
import { cn } from "../../../../primitives";

export interface AuthErrorBannerProps {
  /** i18n key for the message (already resolved by the consumer) */
  message?: string | null;
  /** Translation function used to resolve the key */
  translate: (key: string) => string;
  /** Optional className for layout integration */
  className?: string;
}

export const AuthErrorBanner = ({ message, translate, className }: AuthErrorBannerProps) => {
  if (!message) return null;

  const resolved = message.includes('.') ? translate(message) : message;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn("udb-form-alert", className)}
    >
      <AlertCircle className="udb-form-alert__icon" aria-hidden="true" />
      <span>{resolved}</span>
    </div>
  );
};
