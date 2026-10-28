export {
  PermissionsProvider,
  usePermissions,
  usePermission,
  RequirePermission,
  ProtectedRoute,
  Can,
  type PermissionsProviderProps,
  type RequirePermissionProps,
  type ProtectedRouteProps,
  type CanProps,
} from "./PermissionsContext";
export {
  AccessDenied,
  type AccessDeniedProps,
} from "./AccessDenied";
export {
  hasPermission,
  hasAnyPermission,
  effectivePermissions,
} from "./hasPermission";
export {
  PERMISSION_WILDCARD,
  type Permission,
  type PermissionMatrix,
  type PermissionOverrides,
  type PermissionEntry,
  type PermissionGroup,
  type RoleGrant,
  type RoleKey,
  type RoleInfo,
} from "./types";
