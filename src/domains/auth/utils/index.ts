/**
 * Auth Utilities
 *
 * Export all auth utilities
 */

export {
  isValidEmail,
  isValidPassword,
  validateLogin,
  validateRegister,
  validateForgotPassword,
  validateResetPassword,
  getUserDisplayName,
  getUserInitials,
  isEmailVerified,
  formatUserCreatedAt,
  maskEmail,
  generateResetToken,
  calculatePasswordStrength,
  getPasswordStrengthLabel,
  sanitizeInput,
} from "./auth";
