import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "@umituz/web-localization/react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button, Input } from "@umituz/web-design-system/atoms";
import { cn } from "@umituz/web-design-system/utils/cn";
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
  invalidResetData: AUTH_VALIDATION_KEYS.passwordTooShort,
  resetFailed: 'auth.errors.resetFailed',
} as const;

export const ResetPasswordForm = ({
  config,
  token,
  onSuccess,
  onError,
}: ResetPasswordFormProps) => {
  const navigate = useNavigate();
  const t = useT();
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
      await onSuccess?.({ token, password });
      setPassword("");
      setConfirmPassword("");
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
      <div className="udb-form" role="status" aria-live="polite">
        <div className="udb-form__header">
          <div className="udb-success-badge">
            <CheckCircle2 className="udb-success-badge__icon" aria-hidden="true" />
          </div>
          <h1 className="udb-form__title">
            {translate(KEYS.successTitle)}
          </h1>
          <p className="udb-form__subtitle">
            {translate(KEYS.successMessage)}
          </p>
        </div>

        {config.loginRoute && (
          <Button
            type="button"
            onClick={() => navigate(config.loginRoute)}
            className="udb-submit-btn udb-submit-btn--pill"
          >
            {translate(KEYS.goToSignIn)}
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="udb-form" noValidate>
      <div className="udb-form__header">
        <h1 className="udb-form__title udb-form__title--lg">
          {translate(KEYS.title)}
        </h1>
        <p className="udb-form__subtitle">{translate(KEYS.description)}</p>
      </div>

      <AuthErrorBanner message={error} translate={translate} />

      <div className="udb-form__group">
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

      <div className="udb-field">
        <label htmlFor="reset-confirm" className="udb-field__label">
          {translate(KEYS.confirmNewPassword)}
          <span className="udb-field__required" aria-hidden="true">*</span>
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
          className={cn(confirmPassword && !passwordsMatch && 'udb-input--error')}
        />
        {confirmPassword && !passwordsMatch && (
          <p className="udb-field__error" role="alert">
            {translate(KEYS.passwordsDoNotMatch)}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="udb-submit-btn udb-submit-btn--pill"
        disabled={isLoading || !passwordsMatch}
      >
        {isLoading ? (
          <>
            <Loader2 className="udb-btn__spinner" aria-hidden="true" />
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
