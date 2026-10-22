import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { PERMISSION_WILDCARD, effectivePermissions } from "../permissions";
import type { Permission } from "../permissions/types";
import type {
  OrganizationPermissionBridge,
  OrganizationRecord,
  OrgMember,
} from "./types";

export interface OrganizationProviderProps {
  organization: OrganizationRecord;
  /** Omit when membership lives outside this provider's scope. */
  members?: readonly OrgMember[];
  /** Resolves `currentMember` from the member list by id. */
  currentUserId?: string;
  /** Optional permission bridge; without it `can` always resolves false. */
  permissions?: OrganizationPermissionBridge;
  /** Multi-organization support: pass the full org list to enable switching. */
  organizations?: readonly OrganizationRecord[];
  activeOrganizationId?: string;
  onSwitchOrganization?: (organizationId: string) => void;
  children: ReactNode;
}

export interface OrganizationContextValue {
  organization: OrganizationRecord;
  members: readonly OrgMember[];
  currentMember: OrgMember | null;
  can: (permission: Permission) => boolean;
  canAny: (permissions: readonly Permission[]) => boolean;
  organizations: readonly OrganizationRecord[];
  switchOrganization: (organizationId: string) => void;
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export const OrganizationProvider = ({
  organization,
  members,
  currentUserId,
  permissions,
  organizations,
  activeOrganizationId,
  onSwitchOrganization,
  children,
}: OrganizationProviderProps) => {
  const currentMember = useMemo(
    () =>
      members && currentUserId !== undefined
        ? members.find((member) => member.id === currentUserId) ?? null
        : null,
    [members, currentUserId],
  );

  const resolveGrant = useMemo(() => {
    if (!permissions) return null;
    const role = permissions.role ?? currentMember?.role ?? null;
    if (!role) return null;
    const base = permissions.matrix[role];
    if (base === undefined) return null;
    if (base === PERMISSION_WILDCARD) return { wildcard: true as const, permissions };
    return { wildcard: false as const, set: effectivePermissions(base, permissions.overrides) };
  }, [permissions, currentMember]);

  const can = useCallback(
    (permission: Permission) => {
      if (!resolveGrant) return false;
      if (resolveGrant.wildcard) {
        return !resolveGrant.permissions.overrides?.revoke?.includes(permission);
      }
      return resolveGrant.set.has(permission);
    },
    [resolveGrant],
  );

  const canAny = useCallback(
    (list: readonly Permission[]) => list.some((p) => can(p)),
    [can],
  );

  const switchOrganization = useCallback(
    (organizationId: string) => onSwitchOrganization?.(organizationId),
    [onSwitchOrganization],
  );

  const value = useMemo<OrganizationContextValue>(
    () => ({
      organization:
        organizations && activeOrganizationId
          ? organizations.find((org) => org.id === activeOrganizationId) ?? organization
          : organization,
      members: members ?? [],
      currentMember,
      can,
      canAny,
      organizations: organizations ?? [organization],
      switchOrganization,
    }),
    [organization, organizations, activeOrganizationId, members, currentMember, can, canAny, switchOrganization],
  );

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
};

export const useOrganization = (): OrganizationContextValue => {
  const value = useContext(OrganizationContext);
  if (!value) {
    throw new Error("useOrganization must be used within OrganizationProvider");
  }
  return value;
};
