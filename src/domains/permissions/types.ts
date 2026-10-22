export type Permission = string;

export type RoleKey = string;

export const PERMISSION_WILDCARD = "*" as const;

export type RoleGrant = typeof PERMISSION_WILDCARD | readonly string[];

export type PermissionMatrix = Readonly<Record<RoleKey, RoleGrant>>;

export interface RoleInfo {
  key: RoleKey;
  label: string;
  description?: string;
}

export interface PermissionOverrides {
  grant?: readonly Permission[];
  revoke?: readonly Permission[];
}

export interface PermissionEntry {
  key: Permission;
  label?: string;
}

export interface PermissionGroup {
  key?: string;
  label?: string;
  permissions: readonly (Permission | PermissionEntry)[];
}

