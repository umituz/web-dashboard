import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({ title, subtitle, description, breadcrumbs, actions, className }: PageHeaderProps) => (
  <div className={`udb-pageheader${className ? ` ${className}` : ""}`}>
    {breadcrumbs !== undefined && <div className="udb-pageheader__breadcrumbs">{breadcrumbs}</div>}
    <div className="udb-pageheader__main">
      <h1 className="udb-pageheader__title">{title}</h1>
      {(subtitle ?? description) !== undefined && (
        <p className="udb-pageheader__subtitle">{subtitle ?? description}</p>
      )}
    </div>
    {actions !== undefined && <div className="udb-pageheader__actions">{actions}</div>}
  </div>
);
