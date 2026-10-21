import type { ReactNode } from 'react';
import { Button, Spinner, type ButtonProps } from '@umituz/web-design-system/atoms';
import { useOnboardingIntl } from './OnboardingIntl';

export interface PrimaryButtonProps extends ButtonProps {
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export function PrimaryButton({
  children,
  loading = false,
  fullWidth = true,
  disabled,
  type,
  block,
  ...rest
}: PrimaryButtonProps) {
  const { labels } = useOnboardingIntl();
  return (
    <Button
      {...rest}
      type={type ?? 'button'}
      variant="primary"
      size="lg"
      block={block ?? fullWidth}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <Spinner size="sm" />
          <span>{labels.loading}</span>

        </>

      ) : (
        children
      )}
    </Button>

  );
}
