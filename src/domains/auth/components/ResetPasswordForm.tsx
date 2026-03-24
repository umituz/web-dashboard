/**
 * Reset Password Form Component
 *
 * Password reset confirmation form
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import { Button } from "@umituz/web-design-system/atoms";
import type { ResetPasswordFormProps } from "../types/auth";
import { validateResetPassword, calculatePasswordStrength } from "../utils/auth";

export const ResetPasswordForm = ({
  config,
  token,
  onSuccess,
  onError,
}: ResetPasswordFormProps) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    const validation = validateResetPassword({
      token,
      password,
      confirmPassword,
    });
    if (!validation.valid) {
      setError(validation.error || "Invalid reset data");
      onError?.(validation.error || "Invalid reset data");
      return;
    }

    setIsLoading(true);

    try {
      // In production, call your auth API
      // await resetPassword({ token, password });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      await onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reset password";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(password);
  const passwordsMatch = password === confirmPassword;

  if (success) {
    return (
      <div className="w-full max-w-md space-y-6">
        {/* Success Message */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground mb-2">
              Password reset successful
            </h1>
            <p className="text-muted-foreground">
              Your password has been updated. You can now sign in with your new password.
            </p>
          </div>
        </div>

        {/* Sign In Button */}
        {config.loginRoute && (
          <Button
            type="button"
            onClick={() => navigate(config.loginRoute)}
            className="w-full h-12 text-base font-bold rounded-full"
          >
            Go to sign in
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          Create new password
        </h1>
        <p className="text-muted-foreground">
          Enter your new password below
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          New Password
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
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
          Confirm New Password
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

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 text-base font-bold rounded-full"
        disabled={isLoading || !passwordsMatch}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Resetting...
          </>
        ) : (
          "Reset password"
        )}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
