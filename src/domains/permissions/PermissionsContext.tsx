/**
 * Permissions context — provides the matrix + active role and a
 * `can(permission)` helper bound to them. Guard components
 * (<RequirePermission>, <Can>) consume this context.
 */

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { useT } from "../../i18n";
import { hasPermission } from "./hasPermission";
import { PERMISSIONS_KEYS } from "./utils/i18nKeys";
import type { Permission, PermissionMatrix, RoleKey } from "./types";

export interface PermissionsProviderProps {
  /** Role x permission matrix. */
  matrix: PermissionMatrix;
  /** Active user's role. */
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

/** Default lock screen rendered by RequirePermission when denied. */
const ForbiddenFallback = () => {
  const t = useT();
  return (
    <div className="udb-empty" role="alert">
      <div className="udb-empty__icon">
        <Lock className="udb-empty__glyph" aria-hidden="true" />
      </div>
      <p className="udb-empty__text">{t(PERMISSIONS_KEYS.forbidden.title)}</p>
      <p className="udb-empty__hint">{t(PERMISSIONS_KEYS.forbidden.hint)}</p>
    </div>
  );
};

export interface RequirePermissionProps {
  /** Permission required to render the children. */
  permission: Permission;
  children: ReactNode;
  /** Rendered instead of the default lock screen when denied. */
  fallback?: ReactNode;
}

/**
 * Page-level permission gate — renders the fallback (lock screen by
 * default) instead of the children when `can(permission)` is false.
 */
export const RequirePermission = ({
  permission,
  children,
  fallback,
}: RequirePermissionProps) => {
  const { can } = usePermissions();
  if (can(permission)) return <>{children}</>;
  return <>{fallback ?? <ForbiddenFallback />}</>;
};

export interface CanProps extends RequirePermissionProps {}

/** Declarative twin of RequirePermission for inline use. */
export const Can = ({ permission, children, fallback }: CanProps) => (
  <RequirePermission permission={permission} fallback={fallback}>
    {children}
  </RequirePermission>
);
