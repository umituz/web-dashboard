/**
 * LoginForm
 *
 * Composed from shared auth primitives (EmailInput, PasswordInput,
 * AuthErrorBanner, SocialLoginButtons). The form's job is to
 * orchestrate them — UI rendering and validation live elsewhere.
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Checkbox } from "@umituz/web-design-system/atoms";
import { Loader2 } from "lucide-react";
import { validateLogin } from "../utils/auth";
import type {
  LoginFormProps,
  LoginCredentials,
  User,
  Translate,
} from "../types/auth";
import {
  AuthErrorBanner,
  EmailInput,
  PasswordInput,
  SocialLoginButtons,
} from "./shared";

const KEYS = {
  welcomeBack: 'auth.login.welcomeBack',
  signInTo: 'auth.login.signInTo',
  emailLabel: 'auth.fields.email',
  emailPlaceholder: 'auth.placeholders.emailExample',
  passwordLabel: 'auth.fields.password',
  passwordPlaceholder: 'auth.placeholders.password',
  rememberMe: 'auth.login.rememberMe',
  forgotPassword: 'auth.login.forgotPassword',
  submit: 'auth.login.submit',
  submitting: 'auth.login.submitting',
  noAccount: 'auth.login.noAccount',
  signUp: 'auth.login.signUp',
  orContinueWith: 'auth.login.orContinueWith',
  invalidCredentials: 'auth.errors.invalidCredentials',
  loginFailed: 'auth.errors.loginFailed',
} as const;

export const LoginForm = ({
  config,
  defaultCredentials,
  showRememberMe = true,
  showForgotPassword = true,
  showRegisterLink = true,
  showSocialLogin = true,
  onLoginAttempt,
  onLoginSuccess,
  onLoginError,
  onGoogleLogin,
  onAppleLogin,
}: LoginFormProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translate: Translate = t;

  const [email, setEmail] = useState<string>(defaultCredentials?.email ?? "");
  const [password, setPassword] = useState<string>(defaultCredentials?.password ?? "");
  const [remember, setRemember] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Default mock auth — replaced by the real provider via onLoginAttempt
   * in production. Kept here only for local-first dev flows.
   */
  const performLogin = useCallback(
    async (credentials: LoginCredentials): Promise<User> => {
      if (onLoginAttempt) {
        return onLoginAttempt(credentials);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        id: "1",
        email: credentials.email,
        name: credentials.email.split("@")[0],
      };
    },
    [onLoginAttempt],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const validation = validateLogin({ email, password });
      if (!validation.valid) {
        const message = validation.error ?? KEYS.invalidCredentials;
        setError(message);
        onLoginError?.(message);
        return;
      }

      setLoading(true);
      try {
        const user = await performLogin({ email, password });
        await onLoginSuccess?.(user);
        navigate(config.afterLoginRoute);
      } catch (err) {
        const message = err instanceof Error ? err.message : KEYS.loginFailed;
        setError(message);
        onLoginError?.(message);
      } finally {
        setLoading(false);
      }
    },
    [email, password, performLogin, navigate, config.afterLoginRoute, onLoginSuccess, onLoginError],
  );

  const handleSocial = useCallback(
    (provider: 'google' | 'apple') => {
      if (provider === 'google') onGoogleLogin?.();
      if (provider === 'apple') onAppleLogin?.();
    },
    [onGoogleLogin, onAppleLogin],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          {translate(KEYS.welcomeBack)}
        </h1>
        <p className="text-sm text-muted-foreground">
          {translate(KEYS.signInTo).replace('{brand}', config.brandName)}
        </p>
      </div>

      <AuthErrorBanner message={error} translate={translate} />

      <EmailInput
        id="login-email"
        labelKey={KEYS.emailLabel}
        placeholderKey={KEYS.emailPlaceholder}
        value={email}
        onChange={setEmail}
        translate={translate}
        disabled={loading}
        required
      />

      <PasswordInput
        id="login-password"
        labelKey={KEYS.passwordLabel}
        placeholderKey={KEYS.passwordPlaceholder}
        value={password}
        onChange={setPassword}
        translate={translate}
        autoComplete="current-password"
        disabled={loading}
        required
      />

      {(showRememberMe || showForgotPassword) && (
        <div className="flex items-center justify-between">
          {showRememberMe && (
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox
                checked={remember}
                onCheckedChange={(checked) => setRemember(Boolean(checked))}
                disabled={loading}
              />
              {translate(KEYS.rememberMe)}
            </label>
          )}
          {showForgotPassword && (
            <button
              type="button"
              onClick={() => navigate(config.forgotPasswordRoute ?? '/forgot-password')}
              className="text-sm text-primary hover:underline"
              disabled={loading}
            >
              {translate(KEYS.forgotPassword)}
            </button>
          )}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 text-base font-bold"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
            {translate(KEYS.submitting)}
          </>
        ) : (
          translate(KEYS.submit)
        )}
      </Button>

      {showRegisterLink && (
        <p className="text-center text-sm text-muted-foreground">
          {translate(KEYS.noAccount)}{' '}
          <button
            type="button"
            onClick={() => navigate(config.registerRoute)}
            className="text-primary font-semibold hover:underline"
            disabled={loading}
          >
            {translate(KEYS.signUp)}
          </button>
        </p>
      )}

      {showSocialLogin && (
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
            disabled={loading}
          />
        </>
      )}
    </form>
  );
};

export default LoginForm;
