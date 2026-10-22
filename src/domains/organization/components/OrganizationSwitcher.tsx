import { NativeSelect } from "@umituz/web-design-system/atoms";
import type { OrganizationRecord } from "../types";

export interface OrganizationSwitcherProps {
  organizations: readonly OrganizationRecord[];
  activeOrganizationId?: string;
  onSwitch: (organizationId: string) => void;
  label?: string;
}

/**
 * Minimal org picker — renders nothing below two organizations. Hosts keep
 * multi-org state; this only emits the selection.
 */
export const OrganizationSwitcher = ({
  organizations,
  activeOrganizationId,
  onSwitch,
  label = "Organization",
}: OrganizationSwitcherProps) => {
  if (organizations.length < 2) return null;

  return (
    <div className="udb-org-switcher">
      <NativeSelect
        label={label}
        value={activeOrganizationId ?? organizations[0]?.id ?? ""}
        options={organizations.map((org) => ({ value: org.id, label: org.name }))}
        onValueChange={onSwitch}
      />
    </div>
  );
};
