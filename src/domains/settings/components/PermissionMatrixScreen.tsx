import { Check, Minus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@umituz/web-design-system/organisms";
import { cn } from "@umituz/web-design-system/utils/cn";
import { hasPermission } from "../../permissions/hasPermission";
import type {
  Permission,
  PermissionEntry,
  PermissionGroup,
  PermissionMatrix,
  RoleInfo,
} from "../../permissions/types";

export interface PermissionMatrixScreenProps {
  matrix: PermissionMatrix;
  roles: RoleInfo[];
  groups?: PermissionGroup[];
  permissions?: (Permission | PermissionEntry)[];
  onToggle?: (role: string, permission: Permission, granted: boolean) => void;
}

const toEntry = (
  column: Permission | PermissionEntry,
): { key: Permission; label: string } =>
  typeof column === "string"
    ? { key: column, label: column }
    : { key: column.key, label: column.label ?? column.key };

export const PermissionMatrixScreen = ({
  matrix,
  roles,
  groups,
  permissions,
  onToggle,
}: PermissionMatrixScreenProps) => {
  const columns = groups
    ? groups.flatMap((group) => group.permissions.map(toEntry))
    : (permissions ?? []).map(toEntry);
  const hasGroups = Boolean(groups && groups.length > 0);

  return (
    <Table className="udb-matrix">
      <TableHeader>
        {hasGroups && (
          <TableRow className="udb-matrix__group-row">
            <TableHead className="udb-matrix__corner" />
            {groups!.map((group, index) => (
              <TableHead
                key={group.key ?? group.label ?? index}
                colSpan={group.permissions.length}
                scope="colgroup"
                className="udb-matrix__group"
              >
                {group.label ?? ""}
              </TableHead>
            ))}
          </TableRow>
        )}
        <TableRow>
          <TableHead />
          {columns.map((column) => (
            <TableHead key={column.key} className="udb-matrix__col">
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {roles.map((role) => (
          <TableRow key={role.key}>
            <TableCell className="udb-matrix__role">{role.label}</TableCell>

            {columns.map((column) => {
              const granted = hasPermission(matrix, role.key, column.key);
              const cell = granted ? (
                <Check className="udb-matrix__check" aria-hidden="true" />
              ) : (
                <Minus className="udb-matrix__deny" aria-hidden="true" />
              );
              return (
                <TableCell key={column.key} className="udb-matrix__cell-td">
                  {onToggle ? (
                    <button
                      type="button"
                      className={cn(
                        "udb-matrix__cell",
                        granted && "udb-matrix__cell--on",
                      )}
                      aria-pressed={granted}
                      aria-label={`${role.label} — ${column.label}`}
                      onClick={() => onToggle(role.key, column.key, granted)}
                    >
                      {cell}
                    </button>
                  ) : (
                    cell
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PermissionMatrixScreen;
