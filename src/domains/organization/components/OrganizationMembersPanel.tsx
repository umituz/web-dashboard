import { useMemo, useState } from "react";
import { Button } from "@umituz/web-design-system/atoms";
import type { RoleInfo, RoleKey } from "../../permissions/types";
import { UserManagementTable } from "../../settings/components/UserManagementTable";
import type { OrgInviteInput, OrgMember } from "../types";
import { memberStatusVocab } from "../vocab";
import { InviteForm } from "./InviteForm";

export interface OrganizationMembersPanelLabels {
  title: string;
  invite: string;
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
  onRoleChange?: (memberId: string, role: RoleKey) => void;
  onRemove?: (memberId: string) => void;
  onInvite?: (input: OrgInviteInput) => void;
  inviteBusy?: boolean;
  statusLabels?: Partial<Record<OrgMember["status"] & string, string>>;
  labels?: Partial<OrganizationMembersPanelLabels>;
}

const DEFAULT_LABELS: OrganizationMembersPanelLabels = {
  title: "Members",
  invite: "Invite member",
  nameColumn: "Name",
  emailColumn: "Email",
  roleColumn: "Role",
  statusColumn: "Status",
  removeLabel: "Remove",
  empty: "No members yet",
};

export const OrganizationMembersPanel = ({
  members,
  roles,
  currentMemberId,
  onRoleChange,
  onRemove,
  onInvite,
  inviteBusy = false,
  statusLabels,
  labels,
}: OrganizationMembersPanelProps) => {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [inviting, setInviting] = useState(false);

  const vocab = useMemo(() => memberStatusVocab(statusLabels), [statusLabels]);

  const showInvite = Boolean(onInvite);
  const toggleInviting = () => setInviting((open) => !open);

  return (
    <section className="udb-members">
      <header className="udb-members__head">
        <h3 className="udb-members__title">
          {text.title} <span className="udb-members__count">({members.length})</span>
        </h3>
        {showInvite && (
          <Button size="sm" variant="secondary" onClick={toggleInviting}>
            {text.invite}
          </Button>
        )}
      </header>

      {showInvite && inviting && (
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
        statusVocab={vocab}
        onRoleChange={onRoleChange}
        onRemove={onRemove}
        isRowLocked={(user) => user.id === currentMemberId || Boolean(user.isOwner)}
      />
    </section>
  );
};
