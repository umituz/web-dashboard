/**
 * useAuth Hook
 *
 * Core authentication hook for managing auth state and actions
 */

import { useState, useCallback, useEffect } from "react";
import type {
  AuthState,
  User,
  AuthActions,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
} from "../types/auth";
import {
  validateLogin,
  validateRegister,
  validateForgotPassword,
  validateResetPassword,
} from "../utils/auth";

interface UseAuthOptions {
  /** Initial authenticated state */
  initialAuthenticated?: boolean;
  /** Current user data */
  initialUser?: User | null;
  /** Auth implementation (connects to your backend) */
  authProvider?: {
    login: (credentials: LoginCredentials) => Promise<User>;
    register: (data: RegisterData) => Promise<User>;
    logout: () => Promise<void>;
    forgotPassword: (data: ForgotPasswordData) => Promise<void>;
    resetPassword: (data: ResetPasswordData) => Promise<void>;
    refreshAuth: () => Promise<User | null>;
  };
}

/**
 * useAuth hook
 *
 * Manages authentication state and provides auth actions
 *
 * @param options - Hook options
 * @returns Auth state and actions
 */
export function useAuth(options: UseAuthOptions = {}) {
  const {
    initialAuthenticated = false,
    initialUser = null,
    authProvider,
  } = options;

  // State
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: initialAuthenticated,
    user: initialUser,
    isLoading: false,
    error: null,
  });

  // Update auth state helper
  const updateState = useCallback((updates: Partial<AuthState>) => {
    setAuthState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Login action
  const login = useCallback(async (credentials: LoginCredentials) => {
    // Validate credentials
    const validation = validateLogin(credentials);
    if (!validation.valid) {
      updateState({ error: validation.error });
      throw new Error(validation.error);
    }

    updateState({ isLoading: true, error: null });

    try {
      if (!authProvider) {
        throw new Error("Auth provider not configured");
      }

      const user = await authProvider.login(credentials);
      updateState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null,
      });

      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      updateState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [authProvider, updateState]);

  // Register action
  const register = useCallback(async (data: RegisterData) => {
    // Validate registration data
    const validation = validateRegister(data, false);
    if (!validation.valid) {
      updateState({ error: validation.error });
      throw new Error(validation.error);
    }

    updateState({ isLoading: true, error: null });

    try {
      if (!authProvider) {
        throw new Error("Auth provider not configured");
      }

      const user = await authProvider.register(data);
      updateState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null,
      });

      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      updateState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [authProvider, updateState]);

  // Logout action
  const logout = useCallback(async () => {
    updateState({ isLoading: true, error: null });

    try {
      if (!authProvider) {
        throw new Error("Auth provider not configured");
      }

      await authProvider.logout();

      updateState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Logout failed";
      updateState({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [authProvider, updateState]);

  // Forgot password action
  const forgotPassword = useCallback(async (data: ForgotPasswordData) => {
    // Validate email
    const validation = validateForgotPassword(data);
    if (!validation.valid) {
      updateState({ error: validation.error });
      throw new Error(validation.error);
    }

    updateState({ isLoading: true, error: null });

    try {
      if (!authProvider) {
        throw new Error("Auth provider not configured");
      }

      await authProvider.forgotPassword(data);
      updateState({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset email";
      updateState({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [authProvider, updateState]);

  // Reset password action
  const resetPassword = useCallback(async (data: ResetPasswordData) => {
    // Validate reset data
    const validation = validateResetPassword(data);
    if (!validation.valid) {
      updateState({ error: validation.error });
      throw new Error(validation.error);
    }

    updateState({ isLoading: true, error: null });

    try {
      if (!authProvider) {
        throw new Error("Auth provider not configured");
      }

      await authProvider.resetPassword(data);
      updateState({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reset password";
      updateState({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [authProvider, updateState]);

  // Update profile action
  const updateProfile = useCallback(async (data: Partial<User>) => {
    updateState({ isLoading: true, error: null });

    try {
      // Update local user state
      setAuthState((prev) => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data } : null,
        isLoading: false,
        error: null,
      }));

      // In production, call your API here
      // await authProvider?.updateProfile(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
      updateState({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [updateState]);

  // Refresh auth action
  const refresh = useCallback(async () => {
    updateState({ isLoading: true, error: null });

    try {
      if (!authProvider) {
        throw new Error("Auth provider not configured");
      }

      const user = await authProvider.refreshAuth();

      updateState({
        isAuthenticated: !!user,
        user,
        isLoading: false,
        error: null,
      });

      return user;
    } catch (error) {
      updateState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
      throw error;
    }
  }, [authProvider, updateState]);

  // Clear error action
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // Auth actions object
  const authActions: AuthActions = {
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    refresh,
  };

  return {
    ...authState,
    ...authActions,
    clearError,
  };
}
