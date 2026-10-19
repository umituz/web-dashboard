import type { ReactNode } from "react";

export interface PageHeaderCrumb {
  label: string;
  to?: string;
}

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  breadcrumbs?: ReactNode | readonly PageHeaderCrumb[];
  actions?: ReactNode;
  className?: string;
}

const isCrumbList = (value: ReactNode | readonly PageHeaderCrumb[]): value is readonly PageHeaderCrumb[] =>
  Array.isArray(value) && value.every((item) => typeof item === "object" && item !== null && "label" in item);

export const PageHeader = ({ title, subtitle, description, breadcrumbs, actions, className }: PageHeaderProps) => {
  const crumbNode =
    breadcrumbs === undefined
      ? undefined
      : isCrumbList(breadcrumbs)
        ? breadcrumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="udb-pageheader__crumb">
              {crumb.to !== undefined ? <a href={crumb.to}>{crumb.label}</a> : crumb.label}
            </span>
          ))
        : breadcrumbs;
  return (
    <div className={`udb-pageheader${className ? ` ${className}` : ""}`}>
      {crumbNode !== undefined && <div className="udb-pageheader__breadcrumbs">{crumbNode}</div>}
      <div className="udb-pageheader__main">
        <h1 className="udb-pageheader__title">{title}</h1>
        {(subtitle ?? description) !== undefined && (
          <p className="udb-pageheader__subtitle">{subtitle ?? description}</p>
        )}
      </div>
      {actions !== undefined && <div className="udb-pageheader__actions">{actions}</div>}
    </div>
  );
};
