import type { ReactNode } from "react";

export interface SectionHeaderProps {
  /** Small uppercase label above the title. */
  kicker?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/** Section-level heading (h2) with an optional actions row — the in-page
 *  counterpart to PageHeader for stacked dashboard sections. */
export const SectionHeader = ({
  kicker,
  title,
  subtitle,
  description,
  actions,
  className,
}: SectionHeaderProps) => (
  <div className={`udb-sectionheader${className ? ` ${className}` : ""}`}>
    <div className="udb-sectionheader__main">
      {kicker !== undefined && <p className="udb-sectionheader__kicker">{kicker}</p>}
      {title !== undefined && <h2 className="udb-sectionheader__title">{title}</h2>}
      {(subtitle ?? description) !== undefined && (
        <p className="udb-sectionheader__subtitle">{subtitle ?? description}</p>
      )}
    </div>
    {actions !== undefined && <div className="udb-sectionheader__actions">{actions}</div>}
  </div>
);
