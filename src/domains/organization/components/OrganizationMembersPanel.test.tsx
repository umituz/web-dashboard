import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { OrganizationMembersPanel } from "./OrganizationMembersPanel";
import type { OrgInvitation, OrgMember } from "../types";
import type { RoleInfo } from "../../permissions/types";

const ROLES: readonly RoleInfo[] = [
  { key: "owner", label: "Owner" },
  { key: "member", label: "Member" },
];

const MEMBERS: readonly OrgMember[] = [
  {
    id: "u-1",
    name: "Ada Lovelace",
    email: "ada@example.com",
    role: "owner",
    status: "active",
    isOwner: true,
  },
  {
    id: "u-2",
    name: "Grace Hopper",
    email: "grace@example.com",
    role: "member",
    status: "active",
  },
  {
    id: "u-3",
    name: "Katherine Johnson",
    email: "katherine@example.com",
    role: "member",
    status: "active",
  },
];

const INVITATIONS: readonly OrgInvitation[] = [
  {
    id: "inv-1",
    email: "new@example.com",
    role: "member",
    status: "pending",
  },
  {
    id: "inv-2",
    email: "gone@example.com",
    role: "member",
    status: "revoked",
  },
];

const mount = (props: Partial<Parameters<typeof OrganizationMembersPanel>[0]> = {}) =>
  render(
    <OrganizationMembersPanel members={MEMBERS} roles={ROLES} currentMemberId="u-2" {...props} />,
  );

describe("OrganizationMembersPanel", () => {
  it("renders member rows with status badges and the member count", () => {
    mount();
    expect(screen.getByText(/Members/).textContent).toContain("(3)");
    expect(screen.getAllByText("Active")).toHaveLength(3);
    expect(screen.getByText("ada@example.com")).not.toBeNull();
  });

  it("opens the invite form on demand and hands the payload to onInvite", () => {
    const onInvite = vi.fn();
    mount({ onInvite });
    fireEvent.click(screen.getByText("Invite member"));
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "new@example.com" },
    });
    fireEvent.click(screen.getByText("Send invite"));
    expect(onInvite).toHaveBeenCalledWith({
      email: "new@example.com",
      role: "owner",
    });
  });

  it("locks the self row and owner rows against removal and role changes", () => {
    const onRemove = vi.fn();
    const onRoleChange = vi.fn();
    mount({ onRemove, onRoleChange });

    const removeButtons = screen
      .queryAllByRole("button")
      .filter((b) => b.textContent === "Remove");
    expect(removeButtons).toHaveLength(1);
    fireEvent.click(removeButtons[0]!);
    expect(onRemove).toHaveBeenCalledWith("u-3");

    const selects = screen.getAllByLabelText("Role");
    expect(selects).toHaveLength(1);
    fireEvent.change(selects[0]!, { target: { value: "owner" } });
    expect(onRoleChange).toHaveBeenCalledWith("u-3", "owner");
  });

  it("hides invite and remove affordances when handlers are absent", () => {
    mount();
    expect(screen.queryByText("Invite member")).toBeNull();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("offers ownership transfer only to owners, never on self or owner rows", () => {
    const onTransferOwnership = vi.fn();

    const { unmount } = mount({ onTransferOwnership });
    expect(screen.queryByText("Make owner")).toBeNull();
    unmount();

    mount({ onTransferOwnership, currentMemberId: "u-1" });
    const transferButtons = screen
      .queryAllByRole("button")
      .filter((b) => b.textContent === "Make owner");
    expect(transferButtons).toHaveLength(2);
    fireEvent.click(transferButtons[0]!);
    expect(onTransferOwnership).toHaveBeenCalledWith("u-2");
  });

  it("lets non-owners leave but never the owner", () => {
    const onLeave = vi.fn();

    mount({ onLeave });
    fireEvent.click(screen.getByText("Leave organization"));
    expect(onLeave).toHaveBeenCalledTimes(1);

    const { unmount } = mount({ onLeave });
    unmount();
    const { container } = mount({ onLeave, currentMemberId: "u-1" });
    expect(
      Array.from(container.querySelectorAll("button")).filter(
        (b) => b.textContent === "Leave organization",
      ),
    ).toHaveLength(0);
  });

  it("shows seat usage and blocks the invite form at the limit", () => {
    mount({ onInvite: () => undefined, seatLimit: 3 });
    expect(screen.getByText("Seat limit reached")).not.toBeNull();
    expect(screen.queryByText("Invite member")).toBeNull();

    const { unmount } = mount({ onInvite: () => undefined, seatLimit: 5 });
    unmount();
    mount({ onInvite: () => undefined, seatLimit: 5 });
    expect(screen.getByText("3 of 5 seats used")).not.toBeNull();
    expect(screen.getByText("Invite member")).not.toBeNull();
  });

  it("renders invitations in their own section with pending-only actions", () => {
    const onRevoke = vi.fn();
    const onResend = vi.fn();
    mount({ invitations: INVITATIONS, onRevokeInvitation: onRevoke, onResendInvitation: onResend });

    expect(screen.getByText("Invitations")).not.toBeNull();
    expect(screen.getByText("new@example.com")).not.toBeNull();
    expect(screen.getByText("Pending")).not.toBeNull();
    expect(screen.getByText("Revoked")).not.toBeNull();

    fireEvent.click(screen.getByText("Resend"));
    expect(onResend).toHaveBeenCalledWith("inv-1");
    fireEvent.click(screen.getByText("Revoke"));
    expect(onRevoke).toHaveBeenCalledWith("inv-1");

    expect(
      screen.queryAllByRole("button").filter((b) => b.textContent === "Resend"),
    ).toHaveLength(1);
  });
});
