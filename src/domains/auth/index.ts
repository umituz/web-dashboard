/**
 * Auth Domain
 *
 * Main entry point for authentication domain
 */

// Components
export {
  AuthLayout,
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
} from "./components";

// Hooks
export { useAuth, type AuthProvider } from "./hooks";

// Utils
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
  getPasswordStrengthBand,
  sanitizeInput,
  AUTH_KEYS,
  AUTH_VALIDATION_KEYS,
  type ValidationResult,
  type PasswordStrengthBand,
  type AuthValidationKey,
} from "./utils";

// Types
export type {
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  AuthState,
  User,
  AuthActions,
  AuthComponentProps,
  AuthStep,
  AuthConfig,
  SocialProvider,
  AuthLayoutProps,
  LoginFormProps,
  RegisterFormProps,
  ForgotPasswordFormProps,
  ResetPasswordFormProps,
  Translate,
} from "./types";
