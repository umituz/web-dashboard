import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { hasPermission } from "./hasPermission";
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

  const value = useMemo<PermissionsContextValue>(
    () => ({ matrix, role: role ?? null, can }),
    [matrix, role, can],
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

export interface RequirePermissionProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export const RequirePermission = ({
  permission,
  children,
  fallback = null,
}: RequirePermissionProps) => {
  const { can } = usePermissions();
  if (can(permission)) return <>{children}</>;

  return <>{fallback}</>;

};

export interface CanProps extends RequirePermissionProps {}

export const Can = ({ permission, children, fallback }: CanProps) => (
  <RequirePermission permission={permission} fallback={fallback}>
    {children}
  </RequirePermission>

);
