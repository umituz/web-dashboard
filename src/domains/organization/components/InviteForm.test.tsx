import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { InviteForm } from "./InviteForm";
import type { RoleInfo } from "../../permissions/types";

const ROLES: readonly RoleInfo[] = [
  { key: "admin", label: "Admin" },
  { key: "member", label: "Member" },
];

const mount = (props: Partial<Parameters<typeof InviteForm>[0]> = {}) =>
  render(<InviteForm roles={ROLES} onInvite={() => undefined} {...props} />);

const submitButton = () =>
  screen.getByText("Send invite").closest("button") as HTMLButtonElement;

describe("InviteForm", () => {
  it("locks submit until the email is valid", () => {
    mount();
    expect(submitButton().disabled).toBe(true);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "not-an-email" },
    });
    expect(submitButton().disabled).toBe(true);
    expect(screen.getByText("Enter a valid email address")).not.toBeNull();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "grace@example.com" },
    });
    expect(submitButton().disabled).toBe(false);
    expect(screen.queryByText("Enter a valid email address")).toBeNull();
  });

  it("submits the trimmed payload with the chosen role and clears the form", () => {
    const onInvite = vi.fn();
    mount({ onInvite });
    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "  Grace Hopper " },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: " grace@example.com " },
    });
    fireEvent.change(screen.getByLabelText("Role"), { target: { value: "admin" } });
    fireEvent.click(submitButton());

    expect(onInvite).toHaveBeenCalledWith({
      name: "Grace Hopper",
      email: "grace@example.com",
      role: "admin",
    });
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe("");
  });

  it("omits the name key when the name is blank", () => {
    const onInvite = vi.fn();
    mount({ onInvite });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "g@x.com" },
    });
    fireEvent.click(submitButton());
    expect(onInvite).toHaveBeenCalledWith({ email: "g@x.com", role: "admin" });
  });

  it("locks submit while busy", () => {
    mount({ busy: true });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "g@x.com" },
    });
    expect(submitButton().disabled).toBe(true);
  });
});
