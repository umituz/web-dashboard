/**
 * PasswordInput
 *
 * Password field with show/hide toggle, used across all auth forms.
 * Centralizes the visibility toggle, autoComplete, and label structure
 * so individual forms can stay focused on their unique concerns.
 */

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@umituz/web-design-system/atoms";
import { Button } from "@umituz/web-design-system/atoms";
import { cn } from "@umituz/web-design-system/utils";

export interface PasswordInputProps {
  /** Input id (used to wire up the label) */
  id: string;
  /** Label i18n key */
  labelKey: string;
  /** Placeholder i18n key */
  placeholderKey: string;
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Translation function */
  translate: (key: string) => string;
  /** Auto-complete hint (e.g., "current-password", "new-password") */
  autoComplete?: string;
  /** Disable the input */
  disabled?: boolean;
  /** Whether to mark the field as required (renders an asterisk) */
  required?: boolean;
  /** Optional error message to display below the field */
  error?: string | null;
  /** Custom className */
  className?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      id,
      labelKey,
      placeholderKey,
      value,
      onChange,
      translate,
      autoComplete = "current-password",
      disabled = false,
      required = false,
      error = null,
      className,
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className={cn("space-y-2", className)}>
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none text-foreground"
        >
          {translate(labelKey)}
          {required && (
            <span className="text-destructive ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            autoComplete={autoComplete}
            required={required}
            disabled={disabled}
            value={value}
            placeholder={translate(placeholderKey)}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            tabIndex={-1}
            onClick={() => setVisible((prev) => !prev)}
            disabled={disabled}
            aria-label={
              visible
                ? translate('auth.a11y.hidePassword')
                : translate('auth.a11y.showPassword')
            }
            className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
          >
            {visible ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        {error && (
          <p
            id={`${id}-error`}
            className="text-xs text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
