/**
 * PasswordInput
 *
 * Password field with show/hide toggle, used across all auth forms.
 * Centralizes the visibility toggle, autoComplete, and label structure
 * so individual forms can stay focused on their unique concerns.
 */

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../../../../primitives";
import { Button } from "../../../../primitives";
import { cn } from "../../../../primitives";

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
      <div className={cn("udb-field", className)}>
        <label htmlFor={id} className="udb-field__label">
          {translate(labelKey)}
          {required && (
            <span className="udb-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <div className="udb-password-wrap">
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
            className="udb-input--with-toggle"
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
            className="udb-password-toggle"
          >
            {visible ? (
              <EyeOff className="udb-password-toggle__icon" aria-hidden="true" />
            ) : (
              <Eye className="udb-password-toggle__icon" aria-hidden="true" />
            )}
          </Button>
        </div>
        {error && (
          <p
            id={`${id}-error`}
            className="udb-field__error"
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
