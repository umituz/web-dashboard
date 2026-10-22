import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { Navigate } from "react-router";
import { hasAnyPermission, hasPermission } from "./hasPermission";
import type { Permission, PermissionMatrix, RoleKey } from "./types";

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
