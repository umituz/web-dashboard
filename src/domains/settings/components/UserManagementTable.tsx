import { DataTable, type Column } from "@umituz/web-design-system/organisms";
import type { RoleKey, RoleInfo } from "../../permissions/types";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  status?: string;
}

export interface UserManagementTableLabels {
  nameColumn: string;
  emailColumn: string;
  roleColumn: string;
  empty: string;
}

export interface UserManagementTableProps {
  users: ManagedUser[];
  roles: RoleInfo[];
  labels: UserManagementTableLabels;
  onRoleChange?: (userId: string, role: RoleKey) => void;
}

export const UserManagementTable = ({
  users,
  roles,
  labels,
  onRoleChange,
}: UserManagementTableProps) => {
  const columns: Column<ManagedUser>[] = [
    { id: "name", header: labels.nameColumn, accessor: "name" },
    { id: "email", header: labels.emailColumn, accessor: "email" },
    {
      id: "role",
      header: labels.roleColumn,
      accessor: (user) =>
        onRoleChange ? (
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

  return (
    <DataTable
      data={users}
      columns={columns}
      emptyState={{ title: labels.empty }}
    />
  );
};

export default UserManagementTable;
