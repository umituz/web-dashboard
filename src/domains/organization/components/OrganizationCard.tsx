import { CoverArt } from "@umituz/web-design-system/organisms";
import { Button } from "@umituz/web-design-system/atoms";
import type { OrganizationRecord } from "../types";
import { initialsOf } from "../vocab";

export interface OrganizationCardLabels {
  plan: string;
  memberCountPattern: string;
  soleOwnerHint: string;
  inviteCta: string;
}

export interface OrganizationCardProps {
  organization: OrganizationRecord;
  memberCount?: number;
  /** Shows the "invite your team" hint + CTA when memberCount is 1. */
  onInvite?: () => void;
  labels?: Partial<OrganizationCardLabels>;
  onClick?: () => void;
}

const DEFAULT_LABELS: OrganizationCardLabels = {
  plan: "Plan",
  memberCountPattern: "{count} members",
  soleOwnerHint: "You are a one-person organization — invite teammates to collaborate.",
  inviteCta: "Invite teammates",
};

const formatCount = (pattern: string, count: number): string =>
  pattern.replace("{count}", String(count));

export const OrganizationCard = ({
  organization,
  memberCount,
  onInvite,
  labels,
  onClick,
}: OrganizationCardProps) => {
  const text = { ...DEFAULT_LABELS, ...labels };
  const soleMember = memberCount === 1 && Boolean(onInvite);

  const body = (
    <>
      <CoverArt seed={organization.name} ratio="3/2" rounded="top">
        <span className="udb-org-card__initials">{initialsOf(organization.name)}</span>
      </CoverArt>
      <div className="udb-org-card__body">
        <div className="udb-org-card__head">
          <div>
            <h3 className="udb-org-card__name">{organization.name}</h3>
            {organization.legalName && organization.legalName !== organization.name && (
              <p className="udb-org-card__legal">{organization.legalName}</p>
            )}
          </div>
          {organization.plan && (
            <span className="udb-org-card__plan">
              {text.plan}: {organization.plan}
            </span>
          )}
        </div>
        {memberCount !== undefined && (
          <p className="udb-org-card__meta">
            {formatCount(text.memberCountPattern, memberCount)}
          </p>
        )}
        {soleMember && (
          <div className="udb-org-card__hint">
            <p>{text.soleOwnerHint}</p>
            <Button size="sm" onClick={onInvite}>
              {text.inviteCta}
            </Button>
          </div>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className="udb-org-card udb-org-card--clickable" onClick={onClick}>
        {body}
      </button>
    );
  }

  return <div className="udb-org-card">{body}</div>;
};
