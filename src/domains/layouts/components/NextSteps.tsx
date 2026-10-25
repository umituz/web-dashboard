import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export interface NextStepLink {
  to: string;
  label: ReactNode;
  icon?: ReactNode;
}

export interface NextStepsProps {
  lead?: ReactNode;
  links: readonly NextStepLink[];
  className?: string;
}

export const NextSteps = ({ lead, links, className }: NextStepsProps) => {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2${className ? ` ${className}` : ""}`}>
      {lead && (
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {lead}
        </span>
      )}
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          {link.label} {link.icon ?? <ArrowRight size={12} aria-hidden="true" />}
        </Link>
      ))}
    </div>
  );
};
