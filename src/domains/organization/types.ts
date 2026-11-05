import type { PermissionMatrix, RoleKey } from "../permissions/types";

export interface OrganizationRecord {
  id: string;
  name: string;
  legalName?: string;
  plan?: string;
  status?: string;
  country?: string;
  currency?: string;
  locale?: string;
  timezone?: string;
}

export type MemberStatus = "invited" | "active" | "suspended";

export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired" | "declined";

export interface OrgInvitation {
  id: string;
  email: string;
  name?: string;
  role: RoleKey;
  status: InvitationStatus;
  invitedBy?: string;
  invitedAt?: string;
  expiresAt?: string;
}

export interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  status?: MemberStatus;
  isOwner?: boolean;
  joinedAt?: string;
}

export interface OrgInviteInput {
  name?: string;
  email: string;
  role: RoleKey;
}

export interface OrganizationPermissionBridge {
  matrix: PermissionMatrix;
  role?: RoleKey;
  overrides?: {
    grant?: readonly string[];
    revoke?: readonly string[];
  };
}
