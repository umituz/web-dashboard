/**
 * RegisterForm
 *
 * Composed from shared auth primitives (EmailInput, PasswordInput,
 * PasswordStrengthIndicator, AuthErrorBanner, SocialLoginButtons).
 * Hardcoded mock user data + 1s setTimeout are gone — the form is
 * pure orchestration over the consumer's `onRegisterAttempt` provider.
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Button, Checkbox, Input } from "@umituz/web-design-system/atoms";
import { cn } from "@umituz/web-design-system/utils";
import type { RegisterFormProps, RegisterData, Translate } from "../types/auth";
import { validateRegister } from "../utils/auth";
import { AUTH_KEYS } from "../utils/i18nKeys";
import { AUTH_VALIDATION_KEYS } from "../utils/validationKeys";
import {
  AuthErrorBanner,
  EmailInput,
  PasswordInput,
  PasswordStrengthIndicator,
  SocialLoginButtons,
} from "./shared";

const KEYS = {
  title: 'auth.register.createAccount',
  join: 'auth.register.join',
  nameLabel: 'auth.fields.name',
  namePlaceholder: 'auth.placeholders.fullName',
  emailLabel: AUTH_KEYS.fields.email,
  emailPlaceholder: AUTH_KEYS.placeholders.emailExample,
  passwordLabel: AUTH_KEYS.fields.password,
  passwordPlaceholder: AUTH_KEYS.placeholders.password,
  confirmPassword: 'auth.register.confirmPassword',
  submit: 'auth.register.submit',
  submitting: 'auth.register.submitting',
  acceptTerms: 'auth.register.acceptTerms',
  termsOfService: 'auth.register.termsOfService',
  privacyPolicy: 'auth.register.privacyPolicy',
  haveAccount: 'auth.register.haveAccount',
  signIn: 'auth.register.signIn',
  orContinueWith: 'auth.login.orContinueWith',
  invalidData: 'auth.errors.registrationFailed',
  mustAcceptTerms: 'auth.register.mustAcceptTerms',
  passwordsDoNotMatch: AUTH_VALIDATION_KEYS.passwordsDoNotMatch,
} as const;

export const RegisterForm = ({
  config,
  defaultData = {},
  showTerms = true,
  showLoginLink = true,
  requirePasswordConfirm = true,
  showSocialLogin = true,
  onRegisterAttempt,
  onRegisterSuccess,
  onRegisterError,
  onGoogleLogin,
  onAppleLogin,
}: RegisterFormProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translate: Translate = t;

  const [name, setName] = useState<string>(defaultData.name ?? '');
  const [email, setEmail] = useState<string>(defaultData.email ?? '');
  const [password, setPassword] = useState<string>(defaultData.password ?? '');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = !requirePasswordConfirm || password === confirmPassword;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const validation = validateRegister(
        { email, password, name },
        false,
        requirePasswordConfirm,
      );
      if (!validation.valid) {
        const message = validation.error ?? KEYS.invalidData;
        setError(message);
        onRegisterError?.(message);
        return;
      }

      if (showTerms && !agreeToTerms) {
        setError(KEYS.mustAcceptTerms);
        onRegisterError?.(KEYS.mustAcceptTerms);
        return;
      }

      setIsLoading(true);
      try {
        if (!onRegisterAttempt) {
          // The form has no auth provider — fail loud rather than
          // silently inserting a mock user.
          throw new Error('No register handler configured');
        }
        const registerData: RegisterData = { email, password, name };
        const user = await onRegisterAttempt(registerData);
        await onRegisterSuccess?.(user);
        navigate(config.afterLoginRoute);
      } catch (err) {
        const message = err instanceof Error ? err.message : KEYS.invalidData;
        setError(message);
        onRegisterError?.(message);
      } finally {
        setIsLoading(false);
      }
    },
    [
      agreeToTerms,
      config.afterLoginRoute,
      confirmPassword,
      email,
      name,
      navigate,
      onRegisterAttempt,
      onRegisterError,
      onRegisterSuccess,
      password,
      requirePasswordConfirm,
      showTerms,
    ],
  );

  const handleSocial = useCallback(
    (provider: 'google' | 'apple') => {
      if (provider === 'google') onGoogleLogin?.();
      if (provider === 'apple') onAppleLogin?.();
    },
    [onGoogleLogin, onAppleLogin],
  );

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5" noValidate>
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          {translate(KEYS.title)}
        </h1>
        <p className="text-muted-foreground">
          {translate(KEYS.join).replace('{brand}', config.brandName)}
        </p>
      </div>

      <AuthErrorBanner message={error} translate={translate} />

      <div className="space-y-2">
        <label
          htmlFor="register-name"
          className="text-sm font-medium leading-none text-foreground"
        >
          {translate(KEYS.nameLabel)}
        </label>
        <Input
          id="register-name"
          type="text"
          autoComplete="name"
          disabled={isLoading}
          value={name}
          placeholder={translate(KEYS.namePlaceholder)}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <EmailInput
        id="register-email"
        labelKey={KEYS.emailLabel}
        placeholderKey={KEYS.emailPlaceholder}
        value={email}
        onChange={setEmail}
        translate={translate}
        disabled={isLoading}
        required
      />

      <div className="space-y-3">
        <PasswordInput
          id="register-password"
          labelKey={KEYS.passwordLabel}
          placeholderKey={KEYS.passwordPlaceholder}
          value={password}
          onChange={setPassword}
          translate={translate}
          autoComplete="new-password"
          disabled={isLoading}
          required
        />
        <PasswordStrengthIndicator password={password} translate={translate} />
      </div>

      {requirePasswordConfirm && (
        <div className="space-y-2">
          <label
            htmlFor="register-confirm"
            className="text-sm font-medium leading-none text-foreground"
          >
            {translate(KEYS.confirmPassword)}
            <span className="text-destructive ml-1" aria-hidden="true">*</span>
          </label>
          <Input
            id="register-confirm"
            type="password"
            autoComplete="new-password"
            required
            disabled={isLoading}
            value={confirmPassword}
            placeholder={translate(KEYS.passwordPlaceholder)}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={Boolean(confirmPassword) && !passwordsMatch}
            className={cn(confirmPassword && !passwordsMatch && 'border-destructive')}
          />
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-destructive" role="alert">
              {translate(KEYS.passwordsDoNotMatch)}
            </p>
          )}
        </div>
      )}

      {showTerms && (
        <label className="flex items-start gap-2 cursor-pointer">
          <Checkbox
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(Boolean(checked))}
            disabled={isLoading}
            className="mt-1"
            aria-label={translate(KEYS.acceptTerms)}
          />
          <span className="text-sm text-muted-foreground">
            {translate(KEYS.acceptTerms)}{' '}
            <a href="/terms" className="text-primary hover:underline">
              {translate(KEYS.termsOfService)}
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              {translate(KEYS.privacyPolicy)}
            </a>
          </span>
        </label>
      )}

      <Button
        type="submit"
        className="w-full h-12 text-base font-bold rounded-full"
        disabled={isLoading || (requirePasswordConfirm && !passwordsMatch)}
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

      {showLoginLink && config.loginRoute && (
        <p className="text-center text-sm text-muted-foreground">
          {translate(KEYS.haveAccount)}{' '}
          <button
            type="button"
            onClick={() => navigate(config.loginRoute)}
            className="text-primary hover:underline font-medium"
            disabled={isLoading}
          >
            {translate(KEYS.signIn)}
          </button>
        </p>
      )}

      {showSocialLogin && config.showSocialLogin && config.socialProviders && config.socialProviders.length > 0 && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {translate(KEYS.orContinueWith)}
              </span>
            </div>
          </div>
          <SocialLoginButtons
            onProvider={handleSocial}
            translate={translate}
            disabled={isLoading}
          />
        </>
      )}
    </form>
  );
};

export default RegisterForm;
