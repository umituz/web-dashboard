import { statusVocab, type StatusVocab } from "@umituz/web-design-system/organisms";
import type { MemberStatus } from "./types";

/**
 * Up to two leading initials from a display name ("Northwind Labs" -> "NL",
 * "madeline" -> "M"). Used wherever an avatar block needs stable letters.
 */
export const initialsOf = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const DEFAULT_MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  invited: "Invited",
  active: "Active",
  suspended: "Suspended",
};

const MEMBER_STATUS_TONES: Record<MemberStatus, "info" | "success" | "warning"> = {
  invited: "info",
  active: "success",
  suspended: "warning",
};

/**
 * Status vocab for membership rows — label overrides merge over the
 * fleet-wide defaults (invited/active/suspended).
 */
export const memberStatusVocab = (
  labelOverrides?: Partial<Record<MemberStatus, string>>,
): StatusVocab =>
  statusVocab(
    { ...DEFAULT_MEMBER_STATUS_LABELS, ...labelOverrides },
    MEMBER_STATUS_TONES,
  );
