/**
 * EmailInput
 *
 * Standardized email input used across all auth forms.
 * Renders label, input, error state, and disabled state consistently.
 */

import { forwardRef } from "react";
import { Input } from "../../../../primitives";
import { cn } from "../../../../primitives";

export interface EmailInputProps {
  /** Input id (used to wire up the label) */
  id: string;
  /** Label i18n key — resolved via `translate` */
  labelKey: string;
  /** Placeholder i18n key */
  placeholderKey: string;
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Translation function */
  translate: (key: string) => string;
  /** Auto-complete hint (default: "email") */
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

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  (
    {
      id,
      labelKey,
      placeholderKey,
      value,
      onChange,
      translate,
      autoComplete = "email",
      disabled = false,
      required = false,
      error = null,
      className,
    },
    ref,
  ) => {
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
        <Input
          ref={ref}
          id={id}
          type="email"
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          value={value}
          placeholder={translate(placeholderKey)}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
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

EmailInput.displayName = "EmailInput";
