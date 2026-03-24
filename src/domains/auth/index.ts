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
export {
  useAuth,
} from "./hooks";

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
  getPasswordStrengthLabel,
  sanitizeInput,
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
} from "./types";
