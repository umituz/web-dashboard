/**
 * AuthErrorBanner
 *
 * Inline error display for auth forms. Renders an alert with the
 * provided i18n key resolved by the consumer's translation function.
 */

import { AlertCircle } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";

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
      className={cn(
        "flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive",
        className,
      )}
    >
      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
      <span>{resolved}</span>
    </div>
  );
};
