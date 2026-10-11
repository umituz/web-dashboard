import { describe, expect, it } from "vitest";
import { defaultT } from "./defaultT";

describe("defaultT", () => {
  it("humanizes the last key segment", () => {
    expect(defaultT("auth.login.welcomeBack")).toBe("Welcome back");
  });

  it("splits camelCase into words", () => {
    expect(defaultT("auth.passwordStrength.passwordsDoNotMatch")).toBe(
      "Passwords do not match",
    );
  });

  it("splits snake_case and kebab-case segments", () => {
    expect(defaultT("common.error_code")).toBe("Error code");
    expect(defaultT("common.error-code")).toBe("Error code");
  });

  it("keeps digits attached to their word", () => {
    expect(defaultT("analytics.common.last7Days")).toBe("Last7 days");
  });

  it("interpolates {{param}} placeholders the text carries", () => {
    expect(defaultT("custom.{{brand}} console", { brand: "Acme" })).toBe(
      "Acme console",
    );
  });

  it("ignores params the humanized text cannot place", () => {
    expect(defaultT("auth.login.signInTo", { brand: "Acme" })).toBe(
      "Sign in to",
    );
  });

  it("returns the raw key when it has no segments", () => {
    expect(defaultT("")).toBe("");
  });

  it("handles single-segment keys", () => {
    expect(defaultT("settings")).toBe("Settings");
  });
});
