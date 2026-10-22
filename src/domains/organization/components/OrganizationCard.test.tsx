import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { OrganizationCard } from "./OrganizationCard";
import type { OrganizationRecord } from "../types";

const ORG: OrganizationRecord = {
  id: "org-1",
  name: "Northwind Labs",
  legalName: "Northwind Laboratories GmbH",
  plan: "pro",
};

describe("OrganizationCard", () => {
  it("renders initials, plan, legal name and member count", () => {
    render(<OrganizationCard organization={ORG} memberCount={4} />);
    expect(screen.getByText("NL")).not.toBeNull();
    expect(screen.getByText("Plan: pro")).not.toBeNull();
    expect(screen.getByText("Northwind Laboratories GmbH")).not.toBeNull();
    expect(screen.getByText("4 members")).not.toBeNull();
  });

  it("shows the sole-member hint with the invite CTA at one member", () => {
    const onInvite = vi.fn();
    render(<OrganizationCard organization={ORG} memberCount={1} onInvite={onInvite} />);
    fireEvent.click(screen.getByText("Invite teammates"));
    expect(onInvite).toHaveBeenCalledTimes(1);
  });

  it("hides the sole-member hint without an invite handler or with a team", () => {
    const { rerender } = render(<OrganizationCard organization={ORG} memberCount={1} />);
    expect(screen.queryByText("Invite teammates")).toBeNull();
    rerender(
      <OrganizationCard organization={ORG} memberCount={3} onInvite={() => undefined} />,
    );
    expect(screen.queryByText("Invite teammates")).toBeNull();
  });

  it("becomes a clickable card with onClick", () => {
    const onClick = vi.fn();
    render(<OrganizationCard organization={ORG} onClick={onClick} />);
    fireEvent.click(screen.getByText("Northwind Labs"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
