import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { OrganizationProfileForm } from "./OrganizationProfileForm";

const ORG = {
  name: "Northwind Labs",
  legalName: "Northwind Laboratories GmbH",
  timezone: "Europe/Berlin",
  email: "ops@northwind.example",
};

const mount = (props: Partial<Parameters<typeof OrganizationProfileForm>[0]> = {}) =>
  render(
    <OrganizationProfileForm value={ORG} onSave={() => undefined} {...props} />,
  );

const saveButton = () =>
  screen.getByText("Save changes").closest("button") as HTMLButtonElement;

const resetButton = () =>
  screen.getByText("Reset").closest("button") as HTMLButtonElement;

describe("OrganizationProfileForm", () => {
  it("renders the fields present in value by default, in canonical order", () => {
    mount();
    expect(screen.getByLabelText("Organization name")).not.toBeNull();
    expect(screen.getByLabelText("Legal name")).not.toBeNull();
    expect(screen.getByLabelText("Timezone")).not.toBeNull();
    expect(screen.getByLabelText("Email")).not.toBeNull();
    expect(screen.queryByLabelText("City")).toBeNull();
    expect(screen.queryByLabelText("Website")).toBeNull();
  });

  it("limits the form to the fields prop when given", () => {
    mount({ fields: ["name", "timezone"] });
    expect(screen.getByLabelText("Organization name")).not.toBeNull();
    expect(screen.getByLabelText("Timezone")).not.toBeNull();
    expect(screen.queryByLabelText("Legal name")).toBeNull();
  });

  it("overrides labels", () => {
    mount({ labels: { name: "Kurum adı", save: "Kaydet" } });
    expect(screen.getByLabelText("Kurum adı")).not.toBeNull();
    expect(screen.getByText("Kaydet")).not.toBeNull();
  });

  it("starts clean and enables save only after an edit", () => {
    mount();
    expect(saveButton().disabled).toBe(true);
    expect(resetButton().disabled).toBe(true);

    fireEvent.change(screen.getByLabelText("Legal name"), {
      target: { value: "Northwind Labs AG" },
    });
    expect(saveButton().disabled).toBe(false);
    expect(resetButton().disabled).toBe(false);
  });

  it("hands the edited draft to onSave and keeps untouched fields", () => {
    const onSave = vi.fn();
    mount({ onSave });
    fireEvent.change(screen.getByLabelText("Organization name"), {
      target: { value: "Northwind Group" },
    });
    fireEvent.click(saveButton());
    expect(onSave).toHaveBeenCalledWith({
      ...ORG,
      name: "Northwind Group",
    });
  });

  it("reset restores the initial values", () => {
    mount();
    const input = screen.getByLabelText("Organization name") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Temporary" } });
    fireEvent.click(resetButton());
    expect(input.value).toBe("Northwind Labs");
    expect(saveButton().disabled).toBe(true);
  });

  it("blocks save while the name is blank", () => {
    mount();
    fireEvent.change(screen.getByLabelText("Organization name"), {
      target: { value: "   " },
    });
    expect(saveButton().disabled).toBe(true);
  });

  it("renders a select for fields with options", () => {
    mount({
      selects: {
        timezone: [
          { value: "Europe/Berlin", label: "Berlin" },
          { value: "Europe/Istanbul", label: "Istanbul" },
        ],
      },
    });
    const select = screen.getByLabelText("Timezone") as HTMLSelectElement;
    expect(select.tagName).toBe("SELECT");
    expect(select.value).toBe("Europe/Berlin");
    expect(
      withinOptions(select).some((option) => option.textContent === "Istanbul"),
    ).toBe(true);
  });

  it("disables both actions while busy", () => {
    mount({ busy: true });
    expect(saveButton().disabled).toBe(true);
    expect(resetButton().disabled).toBe(true);
  });
});

const withinOptions = (select: HTMLSelectElement): HTMLOptionElement[] =>
  Array.from(select.querySelectorAll("option"));
