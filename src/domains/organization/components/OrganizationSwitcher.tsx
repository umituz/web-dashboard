import { NativeSelect } from "@umituz/web-design-system/atoms";
import type { OrganizationRecord } from "../types";

export interface PersonalWorkspace {
  /** Stable id the host uses to scope data outside any organization. */
  id: string;
  label: string;
}

export interface OrganizationSwitcherProps {
  organizations: readonly OrganizationRecord[];
  activeOrganizationId?: string;
  onSwitch: (organizationId: string) => void;
  label?: string;
  /**
   * Side-by-side architecture (Clerk/GitHub style): the personal workspace
   * stays intact next to team organizations and leads the switcher.
   */
  personalWorkspace?: PersonalWorkspace;
}

export const OrganizationSwitcher = ({
  organizations,
  activeOrganizationId,
  onSwitch,
  label = "Workspace",
  personalWorkspace,
}: OrganizationSwitcherProps) => {
  const options = [
    ...(personalWorkspace ? [{ value: personalWorkspace.id, label: personalWorkspace.label }] : []),
    ...organizations.map((org) => ({ value: org.id, label: org.name })),
  ];

  if (options.length < 2) return null;

  return (
    <div className="udb-org-switcher">
      <NativeSelect
        label={label}
        value={activeOrganizationId ?? options[0]?.value ?? ""}
        options={options}
        onValueChange={onSwitch}
      />
    </div>
  );
};
