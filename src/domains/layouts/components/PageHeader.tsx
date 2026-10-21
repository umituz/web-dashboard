import type { ReactNode } from "react";
import { Link } from "react-router";

export interface PageHeaderCrumb {
  label: string;
  to?: string;
}

export interface PageHeaderProps {
  kicker?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  /** Small facts row (dates, counts, IDs…) under the title block. */
  meta?: ReactNode;
  breadcrumbs?: ReactNode | readonly PageHeaderCrumb[];
  actions?: ReactNode;
  className?: string;
}

const isCrumbList = (value: ReactNode | readonly PageHeaderCrumb[]): value is readonly PageHeaderCrumb[] =>
  Array.isArray(value) && value.every((item) => typeof item === "object" && item !== null && "label" in item);

export const PageHeader = ({
  kicker,
  title,
  subtitle,
  description,
  meta,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) => {
  const crumbNode =
    breadcrumbs === undefined
      ? undefined
      : isCrumbList(breadcrumbs)
        ? breadcrumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="udb-pageheader__crumb">
              {crumb.to !== undefined ? <Link to={crumb.to}>{crumb.label}</Link> : crumb.label}
            </span>
          ))
        : breadcrumbs;
  return (
    <div className={`udb-pageheader${className ? ` ${className}` : ""}`}>
      {crumbNode !== undefined && <div className="udb-pageheader__breadcrumbs">{crumbNode}</div>}
      <div className="udb-pageheader__main">
        {kicker !== undefined && <p className="udb-pageheader__kicker">{kicker}</p>}
        {title !== undefined && <h1 className="udb-pageheader__title">{title}</h1>}
        {(subtitle ?? description) !== undefined && (
          <p className="udb-pageheader__subtitle">{subtitle ?? description}</p>
        )}
        {meta !== undefined && <div className="udb-pageheader__meta">{meta}</div>}
      </div>
      {actions !== undefined && <div className="udb-pageheader__actions">{actions}</div>}
    </div>
  );
};
