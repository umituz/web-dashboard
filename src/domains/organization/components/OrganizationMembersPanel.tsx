import { useMemo, useState } from "react";
import { Button } from "@umituz/web-design-system/atoms";
import { StatusBadge } from "@umituz/web-design-system/organisms";
import type { RoleInfo, RoleKey } from "../../permissions/types";
import { UserManagementTable } from "../../settings/components/UserManagementTable";
import type {
  InvitationStatus,
  MemberStatus,
  OrgInviteInput,
  OrgInvitation,
  OrgMember,
} from "../types";
import { invitationStatusVocab, memberStatusVocab } from "../vocab";
import { InviteForm } from "./InviteForm";

export interface OrganizationMembersPanelLabels {
  title: string;
  invite: string;
  seatsPattern: string;
  seatsFull: string;
  leave: string;
  invitationsTitle: string;
  resendLabel: string;
  revokeLabel: string;
  makeOwnerLabel: string;
  nameColumn: string;
  emailColumn: string;
  roleColumn: string;
  statusColumn: string;
  removeLabel: string;
  empty: string;
}

export interface OrganizationMembersPanelProps {
  members: readonly OrgMember[];
  roles: readonly RoleInfo[];
  /** Self rows are always locked; owner rows lock by default. */
  currentMemberId?: string;
  /** Outstanding invitations, rendered in their own section. */
  invitations?: readonly OrgInvitation[];
  /** Blocks the invite form once members reach the seat limit. */
  seatLimit?: number;
  onRoleChange?: (memberId: string, role: RoleKey) => void;
  onRemove?: (memberId: string) => void;
  /** Atomic backend transfer is the host's job; the old owner usually drops to admin. */
  onTransferOwnership?: (memberId: string) => void;
  /** Self-service exit; hide it for owners — the last owner cannot leave. */
  onLeave?: () => void;
  onInvite?: (input: OrgInviteInput) => void;
  onRevokeInvitation?: (invitationId: string) => void;
  onResendInvitation?: (invitationId: string) => void;
  inviteBusy?: boolean;
  statusLabels?: Partial<Record<MemberStatus, string>>;
  invitationStatusLabels?: Partial<Record<InvitationStatus, string>>;
  labels?: Partial<OrganizationMembersPanelLabels>;
}

const DEFAULT_LABELS: OrganizationMembersPanelLabels = {
  title: "Members",
  invite: "Invite member",
  seatsPattern: "{used} of {limit} seats used",
  seatsFull: "Seat limit reached",
  leave: "Leave organization",
  invitationsTitle: "Invitations",
  resendLabel: "Resend",
  revokeLabel: "Revoke",
  makeOwnerLabel: "Make owner",
  nameColumn: "Name",
  emailColumn: "Email",
  roleColumn: "Role",
  statusColumn: "Status",
  removeLabel: "Remove",
  empty: "No members yet",
};

const formatSeats = (pattern: string, used: number, limit: number): string =>
  pattern.replace("{used}", String(used)).replace("{limit}", String(limit));

export const OrganizationMembersPanel = ({
  members,
  roles,
  currentMemberId,
  invitations,
  seatLimit,
  onRoleChange,
  onRemove,
  onTransferOwnership,
  onLeave,
  onInvite,
  onRevokeInvitation,
  onResendInvitation,
  inviteBusy = false,
  statusLabels,
  invitationStatusLabels,
  labels,
}: OrganizationMembersPanelProps) => {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [inviting, setInviting] = useState(false);

  const memberVocab = useMemo(() => memberStatusVocab(statusLabels), [statusLabels]);
  const inviteVocab = useMemo(
    () => invitationStatusVocab(invitationStatusLabels),
    [invitationStatusLabels],
  );

  const selfMember = useMemo(
    () => (currentMemberId ? members.find((m) => m.id === currentMemberId) : undefined),
    [members, currentMemberId],
  );
  const viewerIsOwner = Boolean(selfMember?.isOwner);

  const seatsFull = seatLimit !== undefined && members.length >= seatLimit;
  const inviteEnabled = Boolean(onInvite) && !seatsFull;
  const canLeave = Boolean(onLeave) && Boolean(selfMember) && !viewerIsOwner;
  const showInvitations = Boolean(invitations && invitations.length > 0);

  const rowActions =
    onTransferOwnership && viewerIsOwner
      ? (member: { id: string; isOwner?: boolean }) =>
          member.isOwner || member.id === currentMemberId ? null : (
            <button
              type="button"
              className="udb-link-button udb-link-button--muted"
              onClick={() => onTransferOwnership(member.id)}
            >
              {text.makeOwnerLabel}
            </button>
          )
      : undefined;

  const toggleInviting = () => setInviting((open) => !open);

  return (
    <section className="udb-members">
      <header className="udb-members__head">
        <h3 className="udb-members__title">
          {text.title} <span className="udb-members__count">({members.length})</span>
        </h3>
        <div className="udb-members__head-actions">
          {seatLimit !== undefined && (
            <span className="udb-members__seats">
              {seatsFull ? text.seatsFull : formatSeats(text.seatsPattern, members.length, seatLimit)}
            </span>
          )}
          {inviteEnabled && (
            <Button size="sm" variant="secondary" onClick={toggleInviting}>
              {text.invite}
            </Button>
          )}
          {canLeave && (
            <Button size="sm" variant="ghost" onClick={onLeave}>
              {text.leave}
            </Button>
          )}
        </div>
      </header>

      {inviteEnabled && inviting && (
        <div className="udb-members__invite">
          <InviteForm
            roles={roles}
            busy={inviteBusy}
            onInvite={(input) => onInvite?.(input)}
            onCancel={toggleInviting}
          />
        </div>
      )}

      <UserManagementTable
        users={[...members]}
        roles={[...roles]}
        labels={{
          nameColumn: text.nameColumn,
          emailColumn: text.emailColumn,
          roleColumn: text.roleColumn,
          statusColumn: text.statusColumn,
          removeLabel: text.removeLabel,
          empty: text.empty,
        }}
        statusVocab={memberVocab}
        onRoleChange={onRoleChange}
        onRemove={onRemove}
        rowActions={rowActions}
        isRowLocked={(user) => user.id === currentMemberId || Boolean(user.isOwner)}
      />

      {showInvitations && (
        <div className="udb-members__invitations">
          <h4 className="udb-members__invitations-title">{text.invitationsTitle}</h4>
          <ul className="udb-members__invitation-list">
            {invitations!.map((invitation) => (
              <li key={invitation.id} className="udb-members__invitation">
                <div className="udb-members__invitation-info">
                  <span className="udb-members__invitation-email">{invitation.email}</span>
                  <span className="udb-members__invitation-role">
                    {roles.find((role) => role.key === invitation.role)?.label ?? invitation.role}
                  </span>
                </div>
                <div className="udb-members__invitation-side">
                  <StatusBadge vocab={inviteVocab} value={invitation.status} />
                  {invitation.status === "pending" && (
                    <div className="udb-members__invitation-actions">
                      {onResendInvitation && (
                        <button
                          type="button"
                          className="udb-link-button udb-link-button--muted"
                          onClick={() => onResendInvitation(invitation.id)}
                        >
                          {text.resendLabel}
                        </button>
                      )}
                      {onRevokeInvitation && (
                        <button
                          type="button"
                          className="udb-link-button"
                          onClick={() => onRevokeInvitation(invitation.id)}
                        >
                          {text.revokeLabel}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
