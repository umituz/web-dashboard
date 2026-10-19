import type { ReactNode } from 'react';
import { cn } from '../../theme/cn';

export interface ScreenContainerProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * Standard layout for an onboarding screen.
 * Owns safe-area, padding, header/footer slots. Per project rules this is the SOLE
 * layout for authenticated onboarding screens — no per-page layout duplication.
 */
export function ScreenContainer({ children, header, footer, className }: ScreenContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 pb-8 pt-6 sm:px-6',
        className,
      )}
    >
      {header && <div className="flex flex-col gap-3">{header}</div>}
      <main className="flex flex-1 flex-col gap-6">{children}</main>
      {footer && <div className="flex flex-col gap-3">{footer}</div>}
    </div>
  );
}
