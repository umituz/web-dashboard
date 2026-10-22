import {
  PERMISSION_WILDCARD,
  type Permission,
  type PermissionMatrix,
  type PermissionOverrides,
  type RoleGrant,
  type RoleKey,
} from "./types";

const MODULE_WILDCARD_SUFFIXES = [".*", ":*"] as const;

const matchesModuleWildcard = (
  entry: Permission,
  permission: Permission,
): boolean =>
  MODULE_WILDCARD_SUFFIXES.some((suffix) => {
    if (!entry.endsWith(suffix)) return false;
    return permission.startsWith(entry.slice(0, -suffix.length + 1));
  });

const grantIncludes = (grant: RoleGrant, permission: Permission): boolean => {
  if (grant === PERMISSION_WILDCARD) return true;
  return grant.some(
    (entry) =>
      entry === permission || matchesModuleWildcard(entry, permission),
  );
};

export const hasPermission = (
  matrix: PermissionMatrix | null | undefined,
  role: RoleKey | null | undefined,
  permission: Permission,
): boolean => {
  if (!matrix || !role) return false;
  const grant = matrix[role];
  if (grant === undefined) return false;
  return grantIncludes(grant, permission);
};

export const hasAnyPermission = (
  matrix: PermissionMatrix | null | undefined,
  role: RoleKey | null | undefined,
  permissions: readonly Permission[],
): boolean => permissions.some((p) => hasPermission(matrix, role, p));

export const effectivePermissions = (
  base: readonly Permission[],
  overrides?: PermissionOverrides,
): Set<Permission> => {
  const grants = overrides?.grant ?? [];
  const revokes = overrides?.revoke ?? [];
  return new Set([...base, ...grants].filter((p) => !revokes.includes(p)));
};
