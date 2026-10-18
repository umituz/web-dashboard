import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({ title, subtitle, actions, className }: PageHeaderProps) => (
  <div className={`udb-pageheader${className ? ` ${className}` : ""}`}>
    <div className="udb-pageheader__main">
      <h1 className="udb-pageheader__title">{title}</h1>
      {subtitle !== undefined && <p className="udb-pageheader__subtitle">{subtitle}</p>}
    </div>
    {actions !== undefined && <div className="udb-pageheader__actions">{actions}</div>}
  </div>
);
