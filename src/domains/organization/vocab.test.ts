import { describe, expect, it } from "vitest";
import { initialsOf, invitationStatusVocab, memberStatusVocab } from "./vocab";

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

describe("invitationStatusVocab", () => {
  it("covers the full invitation lifecycle with tones", () => {
    const vocab = invitationStatusVocab();
    expect(vocab.pending).toEqual({ label: "Pending", tone: "info" });
    expect(vocab.accepted).toEqual({ label: "Accepted", tone: "success" });
    expect(vocab.revoked).toEqual({ label: "Revoked", tone: "neutral" });
    expect(vocab.expired).toEqual({ label: "Expired", tone: "warning" });
    expect(vocab.declined).toEqual({ label: "Declined", tone: "neutral" });
  });

  it("merges label overrides over the defaults", () => {
    const vocab = invitationStatusVocab({ pending: "Bekliyor" });
    expect(vocab.pending?.label).toBe("Bekliyor");
    expect(vocab.pending?.tone).toBe("info");
  });
});
