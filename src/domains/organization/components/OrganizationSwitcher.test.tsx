import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import type { OrganizationRecord } from "../types";

const ORGS: readonly OrganizationRecord[] = [
  { id: "org-1", name: "Northwind Labs" },
  { id: "org-2", name: "Contoso" },
];

describe("OrganizationSwitcher", () => {
  it("renders nothing below two organizations", () => {
    const { container } = render(
      <OrganizationSwitcher
        organizations={[ORGS[0]!]}
        activeOrganizationId="org-1"
        onSwitch={() => undefined}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("lists the organizations and emits switches", () => {
    const onSwitch = vi.fn();
    render(
      <OrganizationSwitcher
        organizations={ORGS}
        activeOrganizationId="org-1"
        onSwitch={onSwitch}
      />,
    );
    const select = screen.getByLabelText("Workspace") as HTMLSelectElement;
    expect(select.value).toBe("org-1");
    fireEvent.change(select, { target: { value: "org-2" } });
    expect(onSwitch).toHaveBeenCalledWith("org-2");
  });

  it("leads with the personal workspace when given", () => {
    const onSwitch = vi.fn();
    render(
      <OrganizationSwitcher
        organizations={ORGS}
        personalWorkspace={{ id: "personal", label: "Personal workspace" }}
        activeOrganizationId="personal"
        onSwitch={onSwitch}
      />,
    );
    const select = screen.getByLabelText("Workspace") as HTMLSelectElement;
    const options = Array.from(select.querySelectorAll("option"));
    expect(options[0]?.textContent).toBe("Personal workspace");
    expect(options).toHaveLength(3);
    fireEvent.change(select, { target: { value: "org-1" } });
    expect(onSwitch).toHaveBeenCalledWith("org-1");
  });

  it("stays hidden with a single organization and no personal workspace", () => {
    const { container } = render(
      <OrganizationSwitcher
        organizations={[ORGS[0]!]}
        personalWorkspace={{ id: "personal", label: "Personal workspace" }}
        onSwitch={() => undefined}
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });
});
