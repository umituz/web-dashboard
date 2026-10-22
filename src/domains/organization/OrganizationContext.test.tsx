import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  OrganizationProvider,
  useOrganization,
  type OrganizationContextValue,
} from "./OrganizationContext";
import type { OrgMember, OrganizationRecord } from "./types";

const ORG: OrganizationRecord = { id: "org-1", name: "Northwind Labs", plan: "pro" };

const MEMBERS: readonly OrgMember[] = [
  { id: "u-1", name: "Ada Lovelace", email: "ada@example.com", role: "owner", isOwner: true },
  { id: "u-2", name: "Grace Hopper", email: "grace@example.com", role: "member" },
];

const captured: OrganizationContextValue[] = [];

const Probe = () => {
  captured.push(useOrganization());
  return null;
};

const mount = (props: Partial<Parameters<typeof OrganizationProvider>[0]> = {}) =>
  render(
    <OrganizationProvider organization={ORG} members={MEMBERS} currentUserId="u-2" {...props}>
      <Probe />
    </OrganizationProvider>,
  );

const last = (): OrganizationContextValue => captured[captured.length - 1]!;

describe("OrganizationProvider", () => {
  it("resolves the current member from the member list", () => {
    mount();
    expect(last().currentMember?.email).toBe("grace@example.com");
    expect(last().currentMember?.role).toBe("member");
    expect(last().members).toHaveLength(2);
  });

  it("bridges membership role into the permission matrix", () => {
    mount({ permissions: { matrix: { owner: ["*"], member: ["members.read"] } } });
    expect(last().can("members.read")).toBe(true);
    expect(last().can("members.invite")).toBe(false);
    expect(last().canAny(["members.read", "members.remove"])).toBe(true);
    expect(last().canAny(["members.invite"])).toBe(false);
  });

  it("applies grant/revoke overrides on top of the matrix", () => {
    mount({
      permissions: {
        matrix: { member: ["members.read"] },
        overrides: { grant: ["members.invite"], revoke: ["members.read"] },
      },
    });
    expect(last().can("members.invite")).toBe(true);
    expect(last().can("members.read")).toBe(false);
  });

  it("honors the wildcard grant except explicit revokes", () => {
    mount({
      permissions: {
        matrix: { member: "*" },
        overrides: { revoke: ["billing.manage"] },
      },
    });
    expect(last().can("members.invite")).toBe(true);
    expect(last().can("billing.manage")).toBe(false);
  });

  it("denies everything without a permission bridge", () => {
    mount();
    expect(last().can("members.read")).toBe(false);
    expect(last().canAny(["members.read"])).toBe(false);
  });

  it("resolves the active organization from the multi-org list", () => {
    mount({
      organizations: [ORG, { id: "org-2", name: "Contoso" }],
      activeOrganizationId: "org-2",
    });
    expect(last().organization.id).toBe("org-2");
    expect(last().organization.name).toBe("Contoso");
  });

  it("defaults the organization list to the single active org", () => {
    mount();
    expect(last().organizations).toEqual([ORG]);
  });

  it("switches organizations through the host callback", () => {
    const onSwitch = vi.fn();
    const SwitchProbe = () => {
      const { switchOrganization } = useOrganization();
      return (
        <button type="button" onClick={() => switchOrganization("org-2")}>
          switch
        </button>
      );
    };
    render(
      <OrganizationProvider organization={ORG} onSwitchOrganization={onSwitch}>
        <SwitchProbe />
      </OrganizationProvider>,
    );
    fireEvent.click(screen.getByText("switch"));
    expect(onSwitch).toHaveBeenCalledWith("org-2");
  });

  it("throws when useOrganization runs outside the provider", () => {
    expect(() => render(<Probe />)).toThrow(/OrganizationProvider/);
  });
});
