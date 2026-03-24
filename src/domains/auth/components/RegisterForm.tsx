/**
 * Register Form Component
 *
 * Configurable registration form with validation
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import { Button } from "@umituz/web-design-system/atoms";
import type { RegisterFormProps } from "../types/auth";
import { validateRegister, calculatePasswordStrength } from "../utils/auth";

export const RegisterForm = ({
  config,
  defaultData = {},
  showTerms = true,
  showLoginLink = true,
  requirePasswordConfirm = true,
  showSocialLogin,
  onRegisterSuccess,
  onRegisterError,
  onGoogleLogin,
  onAppleLogin,
}: RegisterFormProps) => {
  const navigate = useNavigate();
  const [name, setName] = useState(defaultData.name || "");
  const [email, setEmail] = useState(defaultData.email || "");
  const [password, setPassword] = useState(defaultData.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    const validation = validateRegister(
      { email, password, name },
      false,
      requirePasswordConfirm
    );
    if (!validation.valid) {
      setError(validation.error || "Invalid registration data");
      onRegisterError?.(validation.error || "Invalid registration data");
      return;
    }

    // Check terms if required
    if (showTerms && !agreeToTerms) {
      setError("You must agree to the terms and conditions");
      onRegisterError?.("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      // In production, call your auth API
      // const user = await register({ email, password, name, metadata });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success
      const mockUser = {
        id: "1",
        email,
        name: name || email.split("@")[0],
      };

      await onRegisterSuccess?.(mockUser);
      navigate(config.afterLoginRoute);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      onRegisterError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(password);
  const passwordsMatch = !requirePasswordConfirm || password === confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          Create an account
        </h1>
        <p className="text-muted-foreground">
          Join {config.brandName} today
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className={cn(
            "w-full px-4 py-3 rounded-lg border bg-background",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "placeholder:text-muted-foreground"
          )}
          disabled={isLoading}
          autoComplete="name"
        />
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={cn(
            "w-full px-4 py-3 rounded-lg border bg-background",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "placeholder:text-muted-foreground",
            error && "border-destructive"
          )}
          disabled={isLoading}
          autoComplete="email"
        />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={cn(
              "w-full px-4 py-3 rounded-lg border bg-background pr-12",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              "placeholder:text-muted-foreground"
            )}
            disabled={isLoading}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {/* Password Strength Indicator */}
        {password && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-300",
                  passwordStrength < 25 && "bg-destructive",
                  passwordStrength >= 25 && passwordStrength < 50 && "bg-orange-500",
                  passwordStrength >= 50 && passwordStrength < 75 && "bg-yellow-500",
                  passwordStrength >= 75 && "bg-green-500"
                )}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {passwordStrength < 25 && "Weak"}
              {passwordStrength >= 25 && passwordStrength < 50 && "Fair"}
              {passwordStrength >= 50 && passwordStrength < 75 && "Good"}
              {passwordStrength >= 75 && "Strong"}
            </span>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      {requirePasswordConfirm && (
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={cn(
                "w-full px-4 py-3 rounded-lg border bg-background pr-12",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "placeholder:text-muted-foreground",
                confirmPassword && !passwordsMatch && "border-destructive"
              )}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-destructive">Passwords do not match</p>
          )}
        </div>
      )}

      {/* Terms Checkbox */}
      {showTerms && (
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="w-4 h-4 mt-1 rounded border-border text-primary focus:ring-2 focus:ring-primary"
          />
          <span className="text-sm text-muted-foreground">
            I agree to the{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 text-base font-bold rounded-full"
        disabled={isLoading || (requirePasswordConfirm && !passwordsMatch)}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      {/* Login Link */}
      {showLoginLink && config.loginRoute && (
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate(config.loginRoute)}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      )}

      {/* Social Login */}
      {showSocialLogin && config.showSocialLogin && config.socialProviders && config.socialProviders.length > 0 && (
        <>
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {config.socialProviders.map((provider) => (
              <button
                key={provider.id}
                type="button"
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-3 rounded-lg border",
                  "bg-background hover:bg-muted transition-colors",
                  "text-sm font-medium text-foreground",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
                onClick={async () => {
                  if (provider.id === "google" && onGoogleLogin) {
                    await onGoogleLogin();
                  } else if (provider.id === "apple" && onAppleLogin) {
                    await onAppleLogin();
                  }
                }}
                disabled={isLoading}
              >
                {provider.icon === "google" && (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                {provider.icon === "apple" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-foreground">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8.3-3.12 1.38-5.98 0-8.1-3.12-1.87-3.12-3.28-8.1.3-8.1.8-1.06 0-2.29.44-3.06.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  </svg>
                )}
                <span>{provider.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </form>
  );
};

export default RegisterForm;
