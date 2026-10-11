/**
 * hasPermission — pure permission lookup against a matrix.
 *
 * Deny-by-default: unknown roles, unknown permissions and empty
 * grants all resolve to `false`. Only an exact entry, a module
 * wildcard ("sales.*") or the full wildcard ("*") grants access.
 */

import {
  PERMISSION_WILDCARD,
  type Permission,
  type PermissionMatrix,
  type RoleGrant,
  type RoleKey,
} from "./types";

const MODULE_WILDCARD_SUFFIX = ".*";

const grantIncludes = (grant: RoleGrant, permission: Permission): boolean => {
  if (grant === PERMISSION_WILDCARD) return true;
  return grant.some(
    (entry) =>
      entry === permission ||
      (entry.endsWith(MODULE_WILDCARD_SUFFIX) &&
        permission.startsWith(entry.slice(0, -1))),
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
