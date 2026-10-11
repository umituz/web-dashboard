/**
 * Permission model — generalized from the texora/visora fleet pattern.
 *
 * Hosts keep their own role and permission vocabularies (string unions
 * in the app); the package treats them as opaque strings and stays
 * camp-agnostic. A matrix maps each role to either the full-grant
 * wildcard `"*"` or a list of permission strings, which may themselves
 * end in `.*` to grant every permission of a module
 * (e.g. `"sales.*"` grants `"sales.view"`).
 */

/** A single permission, e.g. "sales.view". Opaque to the package. */
export type Permission = string;

/** A role key, e.g. "owner", "operator". Opaque to the package. */
export type RoleKey = string;

/** Full-grant wildcard — grants every permission. */
export const PERMISSION_WILDCARD = "*" as const;

/**
 * What a role grants: the wildcard or an explicit permission list
 * (module wildcards like `"sales.*"` allowed).
 */
export type RoleGrant = typeof PERMISSION_WILDCARD | readonly string[];

/** Role x permission matrix. */
export type PermissionMatrix = Readonly<Record<RoleKey, RoleGrant>>;

/** Display metadata for a role (matrix screens). */
export interface RoleInfo {
  key: RoleKey;
  label: string;
  description?: string;
}
