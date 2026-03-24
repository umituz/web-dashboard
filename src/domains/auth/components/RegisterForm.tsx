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
  onRegisterSuccess,
  onRegisterError,
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
    </form>
  );
};

export default RegisterForm;
