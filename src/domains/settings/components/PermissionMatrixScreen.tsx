import { Check, Minus } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils/cn";
import { hasPermission } from "../../permissions/hasPermission";
import type {
  Permission,
  PermissionMatrix,
  RoleInfo,
} from "../../permissions/types";

export interface PermissionMatrixScreenProps {
  matrix: PermissionMatrix;
  roles: RoleInfo[];
  permissions: Permission[];
  onToggle?: (role: string, permission: Permission, granted: boolean) => void;
}

export const PermissionMatrixScreen = ({
  matrix,
  roles,
  permissions,
  onToggle,
}: PermissionMatrixScreenProps) => (
  <div className="udb-table__wrap">
    <table className="udb-table">
      <thead>
        <tr>
          <th className="udb-table__th" />
          {permissions.map((permission) => (
            <th key={permission} className="udb-table__th udb-table__th--code">
              {permission}
            </th>

          ))}
        </tr>

      </thead>

      <tbody>
        {roles.map((role) => (
          <tr key={role.key} className="udb-table__row">
            <td className="udb-table__td udb-table__td--strong">{role.label}</td>

            {permissions.map((permission) => {
              const granted = hasPermission(matrix, role.key, permission);
              const cell = granted ? (
                <Check className="udb-matrix__check" aria-hidden="true" />
              ) : (
                <Minus className="udb-matrix__deny" aria-hidden="true" />
              );
              return (
                <td key={permission} className="udb-table__td udb-table__td--center">
                  {onToggle ? (
                    <button
                      type="button"
                      className={cn(
                        "udb-matrix__cell",
                        granted && "udb-matrix__cell--on",
                      )}
                      aria-pressed={granted}
                      onClick={() => onToggle(role.key, permission, granted)}
                    >
                      {cell}
                    </button>

                  ) : (
                    cell
                  )}
                </td>

              );
            })}
          </tr>

        ))}
      </tbody>

    </table>

  </div>

);

export default PermissionMatrixScreen;
