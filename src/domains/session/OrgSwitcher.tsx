/**
 * OrgSwitcher — tenant switcher trigger + dropdown.
 *
 * Controlled component: tenants and the active id come in as props,
 * switches are delegated via onSwitch. Styled entirely with existing
 * udb-* classes (profile button, avatar, menu).
 */

import { useState } from "react";
import { Building2, Check, ChevronDown } from "lucide-react";
import { cn } from "../../primitives";
import { useT } from "../../i18n";
import { SESSION_KEYS } from "./utils/i18nKeys";
import type { Tenant } from "./types";

export interface OrgSwitcherProps {
  tenants: Tenant[];
  activeTenantId?: string | null;
  onSwitch: (tenantId: string) => void;
  disabled?: boolean;
  className?: string;
}

const initialsOf = (tenant: Tenant): string =>
  tenant.initials ??
  tenant.name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

export const OrgSwitcher = ({
  tenants,
  activeTenantId,
  onSwitch,
  disabled = false,
  className,
}: OrgSwitcherProps) => {
  const t = useT();
  const [open, setOpen] = useState(false);

  if (tenants.length === 0) return null;

  const active = tenants.find((tenant) => tenant.id === activeTenantId) ?? tenants[0];

  return (
    <div className={cn("udb-header__anchor", className)}>
      <button
        type="button"
        className="udb-profile-btn"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t(SESSION_KEYS.orgSwitcher.label)}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="udb-avatar">{initialsOf(active)}</span>
        <span className="udb-org">
          <span className="udb-org__name">{active.name}</span>
          {active.plan && <span className="udb-org__meta">{active.plan}</span>}
        </span>
        <ChevronDown
          className={cn(
            "udb-profile-btn__chevron",
            open && "udb-profile-btn__chevron--open",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="udb-overlay"
            aria-label="close tenant menu"
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          <div className="udb-menu udb-org-menu" role="menu">
            {tenants.map((tenant) => {
              const isActive = tenant.id === active.id;
              return (
                <button
                  key={tenant.id}
                  type="button"
                  role="menuitem"
                  className={cn(
                    "udb-menu__item",
                    isActive && "udb-menu__item--active",
                  )}
                  onClick={() => {
                    onSwitch(tenant.id);
                    setOpen(false);
                  }}
                >
                  <Building2 className="udb-menu__item-icon" aria-hidden="true" />
                  <span className="udb-org-menu__label">{tenant.name}</span>
                  {isActive && <Check className="udb-org-menu__check" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default OrgSwitcher;
