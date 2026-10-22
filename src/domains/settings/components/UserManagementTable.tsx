import { DataTable, type Column } from "@umituz/web-design-system/organisms";
import { StatusBadge, type StatusVocab } from "@umituz/web-design-system/organisms";
import type { RoleKey, RoleInfo } from "../../permissions/types";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  status?: string;
  /** Owner rows are shielded from removal/role changes when `isRowLocked` is not overridden. */
  isOwner?: boolean;
}

export interface UserManagementTableLabels {
  nameColumn: string;
  emailColumn: string;
  roleColumn: string;
  empty: string;
  statusColumn?: string;
  removeColumn?: string;
  removeLabel?: string;
}

export interface UserManagementTableProps {
  users: ManagedUser[];
  roles: RoleInfo[];
  labels: UserManagementTableLabels;
  onRoleChange?: (userId: string, role: RoleKey) => void;
  /** Renders a status column with badges when provided. */
  statusVocab?: StatusVocab;
  /** Renders a remove action column when provided; guarded rows stay hidden. */
  onRemove?: (userId: string) => void;
  /** Rows that must never be removed or role-changed; defaults to owner rows. */
  isRowLocked?: (user: ManagedUser) => boolean;
}

export const UserManagementTable = ({
  users,
  roles,
  labels,
  onRoleChange,
  statusVocab,
  onRemove,
  isRowLocked = (user) => Boolean(user.isOwner),
}: UserManagementTableProps) => {
  const columns: Column<ManagedUser>[] = [
    { id: "name", header: labels.nameColumn, accessor: "name" },
    { id: "email", header: labels.emailColumn, accessor: "email" },
    {
      id: "role",
      header: labels.roleColumn,
      accessor: (user) =>
        onRoleChange && !(isRowLocked?.(user) ?? false) ? (
          <select
            className="udb-period-select__select"
            value={user.role}
            aria-label={labels.roleColumn}
            onChange={(e) => onRoleChange(user.id, e.target.value as RoleKey)}
          >
            {roles.map((role) => (
              <option key={role.key} value={role.key}>
                {role.label}
              </option>

            ))}
          </select>

        ) : (
          roles.find((role) => role.key === user.role)?.label ?? user.role
        ),
    },
  ];

  if (statusVocab) {
    columns.push({
      id: "status",
      header: labels.statusColumn ?? "Status",
      accessor: (user) =>
        user.status ? <StatusBadge vocab={statusVocab} value={user.status} /> : null,
    });
  }

  if (onRemove) {
    columns.push({
      id: "remove",
      header: labels.removeColumn ?? "",
      align: "right",
      accessor: (user) =>
        isRowLocked?.(user) ?? false ? null : (
          <button
            type="button"
            className="udb-link-button"
            onClick={() => onRemove(user.id)}
          >
            {labels.removeLabel ?? "Remove"}
          </button>
        ),
    });
  }

  return (
    <DataTable
      data={users}
      columns={columns}
      emptyState={{ title: labels.empty }}
    />
  );
};

export default UserManagementTable;
