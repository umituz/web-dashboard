/**
 * ResetPasswordForm
 *
 * Composed from shared auth primitives (PasswordInput, PasswordStrengthIndicator,
 * AuthErrorBanner). All copy is i18n-keyed.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@umituz/web-design-system/atoms";
import { Input } from "@umituz/web-design-system/atoms";
import { cn } from "@umituz/web-design-system/utils";
import type { ResetPasswordFormProps, Translate } from "../types/auth";
import { validateResetPassword } from "../utils/auth";
import { AUTH_KEYS } from "../utils/i18nKeys";
import { AUTH_VALIDATION_KEYS } from "../utils/validationKeys";
import {
  AuthErrorBanner,
  PasswordInput,
  PasswordStrengthIndicator,
} from "./shared";

const KEYS = {
  title: 'auth.resetPassword.title',
  description: 'auth.resetPassword.description',
  newPassword: 'auth.resetPassword.newPassword',
  confirmNewPassword: 'auth.resetPassword.confirmNewPassword',
  passwordsDoNotMatch: AUTH_VALIDATION_KEYS.passwordsDoNotMatch,
  submit: 'auth.resetPassword.submit',
  submitting: 'auth.resetPassword.submitting',
  successTitle: 'auth.resetPassword.successTitle',
  successMessage: 'auth.resetPassword.successMessage',
  goToSignIn: 'auth.resetPassword.goToSignIn',
  invalidResetData: AUTH_VALIDATION_KEYS.invalidResetToken,
  resetFailed: 'auth.errors.resetFailed',
} as const;

export const ResetPasswordForm = ({
  config,
  token,
  onSuccess,
  onError,
}: ResetPasswordFormProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translate: Translate = t;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateResetPassword({ token, password, confirmPassword });
    if (!validation.valid) {
      const message = validation.error ?? KEYS.invalidResetData;
      setError(message);
      onError?.(message);
      return;
    }

    setIsLoading(true);
    try {
      // Hand off the actual reset to the consumer. The form is
      // pure orchestration; no network knowledge here.
      await onSuccess?.();
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : KEYS.resetFailed;
      setError(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md space-y-6" role="status" aria-live="polite">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-success" aria-hidden="true" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground mb-2">
              {translate(KEYS.successTitle)}
            </h1>
            <p className="text-muted-foreground">
              {translate(KEYS.successMessage)}
            </p>
          </div>
        </div>

        {config.loginRoute && (
          <Button
            type="button"
            onClick={() => navigate(config.loginRoute)}
            className="w-full h-12 text-base font-bold rounded-full"
          >
            {translate(KEYS.goToSignIn)}
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5" noValidate>
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          {translate(KEYS.title)}
        </h1>
        <p className="text-muted-foreground">{translate(KEYS.description)}</p>
      </div>

      <AuthErrorBanner message={error} translate={translate} />

      <div className="space-y-3">
        <PasswordInput
          id="reset-password"
          labelKey={KEYS.newPassword}
          placeholderKey={AUTH_KEYS.placeholders.password}
          value={password}
          onChange={setPassword}
          translate={translate}
          autoComplete="new-password"
          disabled={isLoading}
          required
        />
        <PasswordStrengthIndicator password={password} translate={translate} />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="reset-confirm"
          className="text-sm font-medium leading-none text-foreground"
        >
          {translate(KEYS.confirmNewPassword)}
          <span className="text-destructive ml-1" aria-hidden="true">*</span>
        </label>
        <Input
          id="reset-confirm"
          type="password"
          autoComplete="new-password"
          required
          disabled={isLoading}
          value={confirmPassword}
          placeholder={translate(AUTH_KEYS.placeholders.password)}
          onChange={(e) => setConfirmPassword(e.target.value)}
          aria-invalid={Boolean(confirmPassword) && !passwordsMatch}
          className={cn(confirmPassword && !passwordsMatch && "border-destructive")}
        />
        {confirmPassword && !passwordsMatch && (
          <p className="text-xs text-destructive" role="alert">
            {translate(KEYS.passwordsDoNotMatch)}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base font-bold rounded-full"
        disabled={isLoading || !passwordsMatch}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
            {translate(KEYS.submitting)}
          </>
        ) : (
          translate(KEYS.submit)
        )}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
