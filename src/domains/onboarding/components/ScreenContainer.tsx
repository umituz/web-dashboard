import type { ReactNode } from 'react';
import { cn } from '@umituz/web-design-system/utils/cn';

export interface ScreenContainerProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function ScreenContainer({ children, header, footer, className }: ScreenContainerProps) {
  return (
    <div className={cn('udb-onb-screen', className)}>
      {header && <div className="udb-onb-screen__header">{header}</div>}

      <main className="udb-onb-screen__main">{children}</main>

      {footer && <div className="udb-onb-screen__footer">{footer}</div>}

    </div>

  );
}
