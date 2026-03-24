/**
 * Login Form Component
 *
 * Configurable login form with validation
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import { Button } from "@umituz/web-design-system/atoms";
import type { LoginFormProps } from "../types/auth";
import { validateLogin, calculatePasswordStrength } from "../utils/auth";

export const LoginForm = ({
  config,
  defaultCredentials = {},
  showRememberMe = true,
  showForgotPassword = true,
  showRegisterLink = true,
  onLoginSuccess,
  onLoginError,
}: LoginFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(defaultCredentials.email || "");
  const [password, setPassword] = useState(defaultCredentials.password || "");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    const validation = validateLogin({ email, password });
    if (!validation.valid) {
      setError(validation.error || "Invalid credentials");
      onLoginError?.(validation.error || "Invalid credentials");
      return;
    }

    setIsLoading(true);

    try {
      // In production, call your auth API
      // const user = await login({ email, password });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success
      const mockUser = {
        id: "1",
        email,
        name: email.split("@")[0],
      };

      await onLoginSuccess?.(mockUser);
      navigate(config.afterLoginRoute);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      onLoginError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(password);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Sign in to your {config.brandName} account
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

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
              "placeholder:text-muted-foreground",
              error && "border-destructive"
            )}
            disabled={isLoading}
            autoComplete="current-password"
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

      {/* Remember Me & Forgot Password */}
      {(showRememberMe || showForgotPassword) && (
        <div className="flex items-center justify-between">
          {showRememberMe && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>
          )}
          {showForgotPassword && config.forgotPasswordRoute && (
            <button
              type="button"
              onClick={() => navigate(config.forgotPasswordRoute!)}
              className="text-sm text-primary hover:underline font-medium"
            >
              Forgot password?
            </button>
          )}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 text-base font-bold rounded-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      {/* Register Link */}
      {showRegisterLink && config.registerRoute && (
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate(config.registerRoute)}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      )}
    </form>
  );
};

export default LoginForm;
