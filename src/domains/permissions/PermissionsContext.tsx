import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { Navigate } from "react-router";
import { hasAnyPermission, hasPermission } from "./hasPermission";
import type { Permission, PermissionMatrix, RoleKey } from "./types";
import { AccessDenied, type AccessDeniedProps } from "./AccessDenied";

export interface PermissionsProviderProps {
  matrix: PermissionMatrix;
  role: RoleKey | null | undefined;
  children: ReactNode;
}

interface PermissionsContextValue {
  matrix: PermissionMatrix;
  role: RoleKey | null;
  can: (permission: Permission) => boolean;
  canAny: (permissions: readonly Permission[]) => boolean;
}

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

export const PermissionsProvider = ({
  matrix,
  role,
  children,
}: PermissionsProviderProps) => {
  const can = useCallback(
    (permission: Permission) => hasPermission(matrix, role, permission),
    [matrix, role],
  );

  const canAny = useCallback(
    (permissions: readonly Permission[]) =>
      hasAnyPermission(matrix, role, permissions),
    [matrix, role],
  );

  const value = useMemo<PermissionsContextValue>(
    () => ({ matrix, role: role ?? null, can, canAny }),
    [matrix, role, can, canAny],
  );

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = (): PermissionsContextValue => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions requires a <PermissionsProvider> ancestor");
  }
  return context;
};

const resolveAllowed = (
  can: (permission: Permission) => boolean,
  canAny: (permissions: readonly Permission[]) => boolean,
  permission?: Permission,
  anyOf?: readonly Permission[],
): boolean =>
  permission
    ? anyOf
      ? can(permission) || canAny(anyOf)
      : can(permission)
    : anyOf
      ? canAny(anyOf)
      : false;

export interface RequirePermissionProps {
  permission?: Permission;
  anyOf?: readonly Permission[];
  children?: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const RequirePermission = ({
  permission,
  anyOf,
  children,
  fallback = null,
  redirectTo,
}: RequirePermissionProps) => {
  const { can, canAny } = usePermissions();
  if (resolveAllowed(can, canAny, permission, anyOf)) return <>{children}</>;
  if (redirectTo !== undefined) return <Navigate to={redirectTo} replace />;
  return <>{fallback}</>;
};

export interface CanProps {
  permission?: Permission;
  anyOf?: readonly Permission[];
  children?: ReactNode;
  fallback?: ReactNode;
}

export const Can = ({
  permission,
  anyOf,
  children,
  fallback = null,
}: CanProps) => {
  const { can, canAny } = usePermissions();
  const allowed = resolveAllowed(can, canAny, permission, anyOf);
  return allowed ? <>{children}</> : <>{fallback}</>;
};

/**
 * Convenience hook that checks whether the current user has a specific permission.
 *
 * Example:
 * ```tsx
 * const canCreateProject = usePermission("projects.create");
 * ```
 */
export const usePermission = (permission: Permission): boolean => {
  const { can } = usePermissions();
  return can(permission);
};

export interface ProtectedRouteProps {
  permission?: Permission;
  anyOf?: readonly Permission[];
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
  accessDeniedProps?: AccessDeniedProps;
}

/**
 * Route-level permission guard. If the user lacks the permission:
 * - Renders `fallback` if provided
 * - Redirects to `redirectTo` if provided
 * - Otherwise displays `<AccessDenied {...accessDeniedProps} />`
 */
export const ProtectedRoute = ({
  permission,
  anyOf,
  children,
  redirectTo,
  fallback,
  accessDeniedProps,
}: ProtectedRouteProps) => {
  const { can, canAny } = usePermissions();
  const allowed = resolveAllowed(can, canAny, permission, anyOf);
  if (!allowed) {
    if (fallback !== undefined) return <>{fallback}</>;
    if (redirectTo !== undefined) return <Navigate to={redirectTo} replace />;
    return <AccessDenied {...accessDeniedProps} />;
  }
  return <>{children}</>;
};
