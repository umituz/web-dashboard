/**
 * Forgot Password Form Component
 *
 * Password reset request form
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import { Button } from "@umituz/web-design-system/atoms";
import type { ForgotPasswordFormProps } from "../types/auth";
import { validateForgotPassword } from "../utils/auth";

export const ForgotPasswordForm = ({
  config,
  onSuccess,
  onError,
  showBackLink = true,
}: ForgotPasswordFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    const validation = validateForgotPassword({ email });
    if (!validation.valid) {
      setError(validation.error || "Invalid email");
      onError?.(validation.error || "Invalid email");
      return;
    }

    setIsLoading(true);

    try {
      // In production, call your auth API
      // await forgotPassword({ email });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      await onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send reset email";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
              Check your email
            </h1>
            <p className="text-muted-foreground">
              We sent a password reset link to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            ✓ Click the link in your email
          </p>
          <p className="text-sm text-muted-foreground">
            ✓ Create a new password
          </p>
          <p className="text-sm text-muted-foreground">
            ✓ Sign in with your new password
          </p>
        </div>

        {/* Back to Login */}
        {showBackLink && config.loginRoute && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(config.loginRoute!)}
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to sign in
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          Forgot password?
        </h1>
        <p className="text-muted-foreground">
          No worries, we'll send you reset instructions
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

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 text-base font-bold rounded-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      {/* Back to Login */}
      {showBackLink && config.loginRoute && (
        <button
          type="button"
          onClick={() => navigate(config.loginRoute!)}
          className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </button>
      )}
    </form>
  );
};

export default ForgotPasswordForm;
