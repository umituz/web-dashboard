/**
 * Auth Domain i18n Keys
 *
 * Centralized catalog of i18n keys used across auth components.
 * Components stay free of hardcoded strings and consume these
 * constants — the consumer app provides the actual translations.
 */

export const AUTH_KEYS = {
  // Login screen
  login: {
    welcomeBack: 'auth.login.welcomeBack',
    signInTo: 'auth.login.signInTo',
    submit: 'auth.login.submit',
    submitting: 'auth.login.submitting',
    rememberMe: 'auth.login.rememberMe',
    forgotPassword: 'auth.login.forgotPassword',
    noAccount: 'auth.login.noAccount',
    signUp: 'auth.login.signUp',
    orContinueWith: 'auth.login.orContinueWith',
  },

  // Register screen
  register: {
    createAccount: 'auth.register.createAccount',
    join: 'auth.register.join',
    fullName: 'auth.register.fullName',
    fullNamePlaceholder: 'auth.placeholders.fullName',
    confirmPassword: 'auth.register.confirmPassword',
    confirmPasswordPlaceholder: 'auth.placeholders.confirmPassword',
    acceptTerms: 'auth.register.acceptTerms',
    termsOfService: 'auth.register.termsOfService',
    privacyPolicy: 'auth.register.privacyPolicy',
    submit: 'auth.register.submit',
    submitting: 'auth.register.submitting',
    haveAccount: 'auth.register.haveAccount',
    signIn: 'auth.register.signIn',
    mustAcceptTerms: 'auth.register.mustAcceptTerms',
    passwordsDoNotMatch: 'auth.register.passwordsDoNotMatch',
  },

  // Forgot password
  forgotPassword: {
    title: 'auth.forgotPassword.title',
    description: 'auth.forgotPassword.description',
    submit: 'auth.forgotPassword.submit',
    submitting: 'auth.forgotPassword.submitting',
    backToSignIn: 'auth.forgotPassword.backToSignIn',
    successTitle: 'auth.forgotPassword.successTitle',
    successMessage: 'auth.forgotPassword.successMessage',
    sentTo: 'auth.forgotPassword.sentTo',
    checkEmail: 'auth.forgotPassword.checkEmail',
    step1: 'auth.forgotPassword.steps.step1',
    step2: 'auth.forgotPassword.steps.step2',
    step3: 'auth.forgotPassword.steps.step3',
  },

  // Reset password
  resetPassword: {
    title: 'auth.resetPassword.title',
    description: 'auth.resetPassword.description',
    newPassword: 'auth.resetPassword.newPassword',
    confirmNewPassword: 'auth.resetPassword.confirmNewPassword',
    submit: 'auth.resetPassword.submit',
    submitting: 'auth.resetPassword.submitting',
    successTitle: 'auth.resetPassword.successTitle',
    successMessage: 'auth.resetPassword.successMessage',
    goToSignIn: 'auth.resetPassword.goToSignIn',
  },

  // Shared fields
  fields: {
    email: 'auth.fields.email',
    password: 'auth.fields.password',
    name: 'auth.fields.name',
  },

  placeholders: {
    emailExample: 'auth.placeholders.emailExample',
    password: 'auth.placeholders.password',
    fullName: 'auth.placeholders.fullName',
  },

  // Errors
  errors: {
    invalidCredentials: 'auth.errors.invalidCredentials',
    loginFailed: 'auth.errors.loginFailed',
    registrationFailed: 'auth.errors.registrationFailed',
    emailRequired: 'auth.errors.emailRequired',
    emailInvalid: 'auth.errors.emailInvalid',
    passwordRequired: 'auth.errors.passwordRequired',
    passwordTooShort: 'auth.errors.passwordTooShort',
    passwordsDoNotMatch: 'auth.errors.passwordsDoNotMatch',
    sendResetFailed: 'auth.errors.sendResetFailed',
    resetFailed: 'auth.errors.resetFailed',
  },

  // Password strength
  passwordStrength: {
    weak: 'auth.passwordStrength.weak',
    fair: 'auth.passwordStrength.fair',
    good: 'auth.passwordStrength.good',
    strong: 'auth.passwordStrength.strong',
  },

  // Social
  social: {
    continueWithGoogle: 'auth.social.continueWithGoogle',
    continueWithApple: 'auth.social.continueWithApple',
  },

  // Accessibility
  a11y: {
    showPassword: 'auth.a11y.showPassword',
    hidePassword: 'auth.a11y.hidePassword',
  },
} as const;

export type AuthI18nKey = string;
