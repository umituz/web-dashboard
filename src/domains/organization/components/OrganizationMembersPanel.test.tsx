import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { OrganizationMembersPanel } from "./OrganizationMembersPanel";
import type { OrgMember } from "../types";
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
    status: "invited",
  },
  {
    id: "u-3",
    name: "Katherine Johnson",
    email: "katherine@example.com",
    role: "member",
    status: "active",
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
    expect(screen.getByText("Invited")).not.toBeNull();
    expect(screen.getAllByText("Active")).toHaveLength(2);
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
      .getAllByRole("button")
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
});
