/**
 * Auth Utilities
 *
 * Utility functions for authentication operations
 */

import type { LoginCredentials, RegisterData, User } from "../types/auth";

/**
 * Validate email format
 *
 * @param email - Email address
 * @returns Whether email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 *
 * @param password - Password
 * @param minLength - Minimum length (default: 8)
 * @returns Whether password meets requirements
 */
export function isValidPassword(password: string, minLength: number = 8): boolean {
  return password.length >= minLength;
}

/**
 * Validate login credentials
 *
 * @param credentials - Login credentials
 * @returns Validation result with error message
 */
export function validateLogin(credentials: LoginCredentials): {
  valid: boolean;
  error?: string;
} {
  if (!credentials.email) {
    return { valid: false, error: "Email is required" };
  }

  if (!isValidEmail(credentials.email)) {
    return { valid: false, error: "Invalid email format" };
  }

  if (!credentials.password) {
    return { valid: false, error: "Password is required" };
  }

  return { valid: true };
}

/**
 * Validate registration data
 *
 * @param data - Registration data
 * @param requireName - Whether name is required (default: false)
 * @param requirePasswordConfirm - Whether password confirmation is required
 * @returns Validation result with error message
 */
export function validateRegister(
  data: RegisterData & { confirmPassword?: string },
  requireName: boolean = false,
  requirePasswordConfirm?: boolean
): {
  valid: boolean;
  error?: string;
} {
  if (!data.email) {
    return { valid: false, error: "Email is required" };
  }

  if (!isValidEmail(data.email)) {
    return { valid: false, error: "Invalid email format" };
  }

  if (requireName && !data.name) {
    return { valid: false, error: "Name is required" };
  }

  if (!data.password) {
    return { valid: false, error: "Password is required" };
  }

  if (!isValidPassword(data.password)) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }

  if (requirePasswordConfirm && data.password !== data.confirmPassword) {
    return { valid: false, error: "Passwords do not match" };
  }

  return { valid: true };
}

/**
 * Validate password reset request
 *
 * @param data - Forgot password data
 * @returns Validation result with error message
 */
export function validateForgotPassword(data: { email: string }): {
  valid: boolean;
  error?: string;
} {
  if (!data.email) {
    return { valid: false, error: "Email is required" };
  }

  if (!isValidEmail(data.email)) {
    return { valid: false, error: "Invalid email format" };
  }

  return { valid: true };
}

/**
 * Validate password reset confirmation
 *
 * @param data - Reset password data
 * @returns Validation result with error message
 */
export function validateResetPassword(data: {
  token: string;
  password: string;
  confirmPassword: string;
}): {
  valid: boolean;
  error?: string;
} {
  if (!data.token) {
    return { valid: false, error: "Invalid reset token" };
  }

  if (!data.password) {
    return { valid: false, error: "Password is required" };
  }

  if (!isValidPassword(data.password)) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }

  if (data.password !== data.confirmPassword) {
    return { valid: false, error: "Passwords do not match" };
  }

  return { valid: true };
}

/**
 * Get user display name
 *
 * @param user - User object
 * @returns Display name or email fallback
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return "Guest";
  return user.name || user.email || "User";
}

/**
 * Get user initials
 *
 * @param user - User object
 * @returns User initials (up to 2 characters)
 */
export function getUserInitials(user: User | null): string {
  if (!user) return "G";
  const name = user.name || user.email || "";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Check if user has verified email
 *
 * @param user - User object
 * @returns Whether email is verified
 */
export function isEmailVerified(user: User | null): boolean {
  return user?.emailVerified === true;
}

/**
 * Format user creation date
 *
 * @param user - User object
 * @param locale - Locale for formatting (default: en-US)
 * @returns Formatted date string or empty string
 */
export function formatUserCreatedAt(user: User | null, locale: string = "en-US"): string {
  if (!user || !user.createdAt) return "";
  return new Date(user.createdAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Mask email for privacy (e.g., u***@example.com)
 *
 * @param email - Email address
 * @returns Masked email
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;

  const maskedLocal = local[0] + "***";
  return `${maskedLocal}@${domain}`;
}

/**
 * Generate secure random token (for demo purposes)
 * In production, use a proper crypto library
 *
 * @param length - Token length in bytes (default: 32)
 * @returns Random hex token
 */
export function generateResetToken(length: number = 32): string {
  const chars = "0123456789abcdef";
  let token = "";
  for (let i = 0; i < length * 2; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

/**
 * Calculate password strength score (0-100)
 *
 * @param password - Password to evaluate
 * @returns Strength score
 */
export function calculatePasswordStrength(password: string): number {
  let score = 0;

  // Length
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 25;

  // Variety
  if (/[a-z]/.test(password)) score += 12.5;
  if (/[A-Z]/.test(password)) score += 12.5;
  if (/[0-9]/.test(password)) score += 12.5;
  if (/[^a-zA-Z0-9]/.test(password)) score += 12.5;

  return Math.min(score, 100);
}

/**
 * Get password strength label
 *
 * @param password - Password to evaluate
 * @returns Strength label
 */
export function getPasswordStrengthLabel(password: string): string {
  const score = calculatePasswordStrength(password);
  if (score < 25) return "Weak";
  if (score < 50) return "Fair";
  if (score < 75) return "Good";
  return "Strong";
}

/**
 * Sanitize user input for display
 *
 * @param input - User input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 1000);
}
