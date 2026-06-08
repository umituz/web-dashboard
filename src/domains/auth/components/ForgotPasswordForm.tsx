/**
 * ForgotPasswordForm
 *
 * Composed of shared auth primitives (EmailInput, AuthErrorBanner).
 * All copy is i18n-keyed; the success state uses lucide icons
 * instead of the previous `✓` Unicode glyphs.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Loader2, CheckCircle2, Check } from "lucide-react";
import { Button } from "@umituz/web-design-system/atoms";
import type { ForgotPasswordFormProps, Translate } from "../types/auth";
import { validateForgotPassword } from "../utils/auth";
import { AUTH_KEYS } from "../utils/i18nKeys";
import { AUTH_VALIDATION_KEYS } from "../utils/validationKeys";
import { AuthErrorBanner, EmailInput } from "./shared";

const KEYS = {
  title: 'auth.forgotPassword.title',
  description: 'auth.forgotPassword.description',
  emailLabel: AUTH_KEYS.fields.email,
  emailPlaceholder: AUTH_KEYS.placeholders.emailExample,
  submitting: 'auth.forgotPassword.submitting',
  submit: 'auth.forgotPassword.submit',
  backToSignIn: 'auth.forgotPassword.backToSignIn',
  successTitle: 'auth.forgotPassword.successTitle',
  successMessage: 'auth.forgotPassword.successMessage',
  sentTo: 'auth.forgotPassword.sentTo',
  step1: 'auth.forgotPassword.steps.step1',
  step2: 'auth.forgotPassword.steps.step2',
  step3: 'auth.forgotPassword.steps.step3',
  invalidEmail: AUTH_VALIDATION_KEYS.emailInvalid,
  sendResetFailed: 'auth.errors.sendResetFailed',
} as const;

export const ForgotPasswordForm = ({
  config,
  onSuccess,
  onError,
  showBackLink = true,
}: ForgotPasswordFormProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translate: Translate = t;

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateForgotPassword({ email });
    if (!validation.valid) {
      const message = validation.error ?? KEYS.invalidEmail;
      setError(message);
      onError?.(message);
      return;
    }

    setIsLoading(true);
    try {
      // Hand off to the consumer's auth provider. The form has
      // no network knowledge of its own — it's pure orchestration.
      await onSuccess?.();
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : KEYS.sendResetFailed;
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
              {translate(KEYS.sentTo)}{' '}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
        </div>

        <ol className="bg-muted/50 border border-border rounded-lg p-4 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
            {translate(KEYS.step1)}
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
            {translate(KEYS.step2)}
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
            {translate(KEYS.step3)}
          </li>
        </ol>

        {showBackLink && config.loginRoute && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(config.loginRoute)}
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            {translate(KEYS.backToSignIn)}
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6" noValidate>
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          {translate(KEYS.title)}
        </h1>
        <p className="text-muted-foreground">{translate(KEYS.description)}</p>
      </div>

      <AuthErrorBanner message={error} translate={translate} />

      <EmailInput
        id="forgot-email"
        labelKey={KEYS.emailLabel}
        placeholderKey={KEYS.emailPlaceholder}
        value={email}
        onChange={setEmail}
        translate={translate}
        disabled={isLoading}
        required
      />

      <Button
        type="submit"
        className="w-full h-12 text-base font-bold rounded-full"
        disabled={isLoading}
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

      {showBackLink && config.loginRoute && (
        <button
          type="button"
          onClick={() => navigate(config.loginRoute)}
          className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {translate(KEYS.backToSignIn)}
        </button>
      )}
    </form>
  );
};

export default ForgotPasswordForm;
