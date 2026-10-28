import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@umituz/web-design-system/atoms";

export interface AccessDeniedProps {
  title?: ReactNode;
  description?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  children?: ReactNode;
}

export const AccessDenied = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  children,
}: AccessDeniedProps) => {
  return (
    <div className="flex min-h-[320px] w-full flex-col items-center justify-center rounded-2xl border border-line bg-surface p-8 text-center shadow-xs">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
        {icon ?? <ShieldAlert className="h-7 w-7" aria-hidden="true" />}
      </div>
      {title && (
        <h2 className="mb-2 font-display text-xl font-bold tracking-tight text-ink">{title}</h2>
      )}
      {description && (
        <p className="max-w-md text-sm text-ink-2 leading-relaxed">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button variant="default" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
