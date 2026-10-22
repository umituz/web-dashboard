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
    const select = screen.getByLabelText("Organization") as HTMLSelectElement;
    expect(select.value).toBe("org-1");
    fireEvent.change(select, { target: { value: "org-2" } });
    expect(onSwitch).toHaveBeenCalledWith("org-2");
  });
});
