import { describe, expect, it } from "vitest";
import { initialsOf, memberStatusVocab } from "./vocab";

describe("initialsOf", () => {
  it("takes up to two leading initials", () => {
    expect(initialsOf("Northwind Labs")).toBe("NL");
    expect(initialsOf("madeline")).toBe("M");
    expect(initialsOf("  a   berry owens ")).toBe("AB");
  });

  it("survives empty and blank names", () => {
    expect(initialsOf("")).toBe("");
    expect(initialsOf("   ")).toBe("");
  });
});

describe("memberStatusVocab", () => {
  it("covers the fleet membership vocabulary with tones", () => {
    const vocab = memberStatusVocab();
    expect(vocab.invited).toEqual({ label: "Invited", tone: "info" });
    expect(vocab.active).toEqual({ label: "Active", tone: "success" });
    expect(vocab.suspended).toEqual({ label: "Suspended", tone: "warning" });
  });

  it("merges label overrides over the defaults", () => {
    const vocab = memberStatusVocab({ invited: "Davetli", active: "Aktif" });
    expect(vocab.invited?.label).toBe("Davetli");
    expect(vocab.invited?.tone).toBe("info");
    expect(vocab.active?.label).toBe("Aktif");
    expect(vocab.suspended?.label).toBe("Suspended");
  });
});
