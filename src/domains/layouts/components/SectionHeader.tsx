import type { ReactNode } from "react";

export interface SectionHeaderProps {
    kicker?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

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
