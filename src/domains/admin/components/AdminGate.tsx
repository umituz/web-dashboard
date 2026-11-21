import type { ReactNode } from 'react';
import { AccessDenied } from '../../permissions/AccessDenied';

export interface AdminGateProps {
  readonly isAdmin: boolean;
  readonly isLoading?: boolean;
  readonly fallback?: ReactNode;
  readonly children: ReactNode;
}

export function AdminGate({
  isAdmin,
  isLoading = false,
  fallback,
  children,
}: AdminGateProps) {
  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Checking access"
        className="flex min-h-[240px] w-full items-center justify-center p-8 text-sm text-ink-3"
      >
        <span className="animate-pulse">Checking administrator permissions…</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      fallback ?? (
        <AccessDenied
          title="Admin Access Required"
          description="You do not have administrative privileges to view this section."
        />
      )
    );
  }

  return <>{children}</>;
}
