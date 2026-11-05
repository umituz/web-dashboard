import type { ReactNode } from "react";
import { DataTable, type Column } from "@umituz/web-design-system/organisms";
import { StatusBadge, type StatusVocab } from "@umituz/web-design-system/organisms";
import type { RoleKey, RoleInfo } from "../../permissions/types";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  status?: string;
  isOwner?: boolean;
}

export interface UserManagementTableLabels {
  nameColumn: string;
  emailColumn: string;
  roleColumn: string;
  empty: string;
  statusColumn?: string;
  actionsColumn?: string;
  removeColumn?: string;
  removeLabel?: string;
}

export interface UserManagementTableProps {
  users: ManagedUser[];
  roles: RoleInfo[];
  labels: UserManagementTableLabels;
  onRoleChange?: (userId: string, role: RoleKey) => void;
  statusVocab?: StatusVocab;
  onRemove?: (userId: string) => void;
  rowActions?: (user: ManagedUser) => ReactNode;
  isRowLocked?: (user: ManagedUser) => boolean;
}

export const UserManagementTable = ({
  users,
  roles,
  labels,
  onRoleChange,
  statusVocab,
  onRemove,
  rowActions,
  isRowLocked = (user) => Boolean(user.isOwner),
}: UserManagementTableProps) => {
  const columns: Column<ManagedUser>[] = [
    { id: "name", header: labels.nameColumn, accessor: "name" },
    { id: "email", header: labels.emailColumn, accessor: "email" },
    {
      id: "role",
      header: labels.roleColumn,
      accessor: (user) =>
        onRoleChange && !isRowLocked(user) ? (
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

  if (onRemove || rowActions) {
    columns.push({
      id: "actions",
      header: labels.actionsColumn ?? labels.removeColumn ?? "",
      align: "right",
      accessor: (user) => {
        const extra = rowActions?.(user);
        const remove =
          onRemove && !isRowLocked(user) ? (
            <button
              type="button"
              className="udb-link-button"
              onClick={() => onRemove(user.id)}
            >
              {labels.removeLabel ?? "Remove"}
            </button>
          ) : null;
        if (!extra && !remove) return null;
        return <div className="udb-row-actions">{extra}{remove}</div>;
      },
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
