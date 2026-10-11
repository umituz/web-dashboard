/**
 * UserManagementTable — admin skeleton for the users screen.
 * Config-driven: rows and role catalog come in as props, role
 * changes delegate out.
 */

import { DataTable, type Column } from "@umituz/web-design-system/organisms";
import { useT } from "../../../i18n";
import { SETTINGS_ADMIN_KEYS } from "../utils/i18nKeys";
import type { RoleKey, RoleInfo } from "../../permissions/types";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  status?: string;
}

export interface UserManagementTableProps {
  users: ManagedUser[];
  roles: RoleInfo[];
  /** Provide to render an editable role select per row. */
  onRoleChange?: (userId: string, role: RoleKey) => void;
}

export const UserManagementTable = ({
  users,
  roles,
  onRoleChange,
}: UserManagementTableProps) => {
  const t = useT();

  const columns: Column<ManagedUser>[] = [
    { id: "name", header: t("settings.users.columns.name"), accessor: "name" },
    { id: "email", header: t("settings.users.columns.email"), accessor: "email" },
    {
      id: "role",
      header: t("settings.users.columns.role"),
      accessor: (user) =>
        onRoleChange ? (
          <select
            className="udb-period-select__select"
            value={user.role}
            aria-label={t("settings.users.columns.role")}
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
      emptyState={{ title: t(SETTINGS_ADMIN_KEYS.users.empty) }}
    />
  );
};

export default UserManagementTable;
