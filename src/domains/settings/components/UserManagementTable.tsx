/**
 * UserManagementTable — admin skeleton for the users screen.
 * Config-driven: rows and role catalog come in as props, role
 * changes delegate out. No fetching, no package-side copy beyond
 * the empty state.
 */

import { Users } from "lucide-react";
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

  if (users.length === 0) {
    return (
      <div className="udb-empty">
        <div className="udb-empty__icon">
          <Users className="udb-empty__glyph" aria-hidden="true" />
        </div>
        <p className="udb-empty__text">{t(SETTINGS_ADMIN_KEYS.users.empty)}</p>
      </div>
    );
  }

  return (
    <div className="udb-table__wrap">
      <table className="udb-table">
        <thead>
          <tr>
            <th className="udb-table__th">{t("settings.users.columns.name")}</th>
            <th className="udb-table__th">{t("settings.users.columns.email")}</th>
            <th className="udb-table__th">{t("settings.users.columns.role")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="udb-table__row">
              <td className="udb-table__td">{user.name}</td>
              <td className="udb-table__td">{user.email}</td>
              <td className="udb-table__td">
                {onRoleChange ? (
                  <select
                    className="udb-period-select__select"
                    value={user.role}
                    aria-label={t("settings.users.columns.role")}
                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                  >
                    {roles.map((role) => (
                      <option key={role.key} value={role.key}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  roles.find((role) => role.key === user.role)?.label ?? user.role
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementTable;
