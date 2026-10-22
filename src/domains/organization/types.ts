import type { PermissionMatrix, RoleKey } from "../permissions/types";

/**
 * Organization record — the tenant entity a signed-in user belongs to.
 * Field set follows the fleet consensus (id/name/legalName/plan/status +
 * locale trio); every field beyond id/name is optional so single-person
 * organizations and partially-provisioned tenants stay representable.
 */
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

/** Fleet-wide membership vocabulary (invite flow: invited -> active -> suspended). */
export type MemberStatus = "invited" | "active" | "suspended";

/**
 * Invitation lifecycle — the industry state machine
 * (pending -> accepted | revoked | expired | declined). Invitations are
 * first-class records, separate from memberships: they key on email, carry
 * an expiry, and can be revoked or resent while pending.
 */
export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired" | "declined";

/**
 * An outstanding (or settled) invitation. The host owns the backend record
 * (token, redemption route); the panel renders and emits revoke/resend.
 */
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

/**
 * A member row as the organization module consumes it. `role` is a RoleKey
 * resolved against the host's RoleInfo list; owners carry `isOwner` so UIs
 * can protect the last owner from removal/role changes. By convention `id`
 * is the member's user id — pre-acceptance people belong in `OrgInvitation`,
 * not here.
 */
export interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  status?: MemberStatus;
  isOwner?: boolean;
  joinedAt?: string;
}

/** Payload handed to the host when InviteForm validates. */
export interface OrgInviteInput {
  name?: string;
  email: string;
  role: RoleKey;
}

/** Permission bridge — ties membership role to a 7.6.0 permission matrix. */
export interface OrganizationPermissionBridge {
  matrix: PermissionMatrix;
  /** Defaults to the current member's role when omitted. */
  role?: RoleKey;
  /** Extra grant/revoke applied on top of the matrix (visora-style overrides). */
  overrides?: {
    grant?: readonly string[];
    revoke?: readonly string[];
  };
}
