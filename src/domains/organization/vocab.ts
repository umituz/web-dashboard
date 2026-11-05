import { statusVocab, type StatusVocab } from "@umituz/web-design-system/organisms";
import type { InvitationStatus, MemberStatus } from "./types";

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

export const memberStatusVocab = (
  labelOverrides?: Partial<Record<MemberStatus, string>>,
): StatusVocab =>
  statusVocab(
    { ...DEFAULT_MEMBER_STATUS_LABELS, ...labelOverrides },
    MEMBER_STATUS_TONES,
  );

const DEFAULT_INVITATION_STATUS_LABELS: Record<InvitationStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  revoked: "Revoked",
  expired: "Expired",
  declined: "Declined",
};

const INVITATION_STATUS_TONES: Record<
  InvitationStatus,
  "info" | "success" | "neutral" | "warning"
> = {
  pending: "info",
  accepted: "success",
  revoked: "neutral",
  expired: "warning",
  declined: "neutral",
};

export const invitationStatusVocab = (
  labelOverrides?: Partial<Record<InvitationStatus, string>>,
): StatusVocab =>
  statusVocab(
    { ...DEFAULT_INVITATION_STATUS_LABELS, ...labelOverrides },
    INVITATION_STATUS_TONES,
  );
