import { Component, Fragment, type ContextType, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';
import { OnboardingIntlContext, type OnboardingIntl } from '../OnboardingIntl';

export interface OnboardingErrorBoundaryProps {
  children: ReactNode;
  /** Called when the boundary trips — useful for analytics. */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** Render a custom error UI. */
  renderError?: (error: Error, retry: () => void) => ReactNode;
}

interface OnboardingErrorBoundaryState {
  error: Error | null;
  /** Bumped on retry so the children subtree fully remounts, not just re-renders. */
  attempt: number;
}

/**
 * Catches render-time errors inside the onboarding flow.
 * Critical path rule: a broken screen must never produce a blank white page.
 * Retry clears the error AND remounts the children (a fresh subtree gets a
 * fresh chance at rendering — deterministic throws aside).
 */
export class OnboardingErrorBoundary extends Component<
  OnboardingErrorBoundaryProps,
  OnboardingErrorBoundaryState
> {
  static contextType = OnboardingIntlContext;
  declare context: ContextType<typeof OnboardingIntlContext>;

  state: OnboardingErrorBoundaryState = { error: null, attempt: 0 };

  static getDerivedStateFromError(error: Error): OnboardingErrorBoundaryState {
    return { error, attempt: 0 };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
     
    console.error('[web-onboarding] render error', error, info.componentStack);
  }

  retry = (): void => {
    this.setState((prev) => ({ error: null, attempt: prev.attempt + 1 }));
  };

  render(): ReactNode {
    const { error, attempt } = this.state;
    const intl: OnboardingIntl = this.context;

    if (!error) {
      return <Fragment key={attempt}>{this.props.children}</Fragment>;
    }

    if (this.props.renderError) return this.props.renderError(error, this.retry);

    const { labels } = intl;
    return (
      <div
        role="alert"
        className="uob-flow mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center"
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgb(var(--uob-error))]/10 text-[rgb(var(--uob-error))]"
          aria-hidden="true"
        >
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-semibold text-[rgb(var(--uob-text-primary))]">
          {labels.somethingWentWrong}
        </h2>
        <p className="text-sm text-[rgb(var(--uob-text-muted))]">
          {error.message || labels.unexpectedError}
        </p>
        <PrimaryButton onClick={this.retry}>{labels.tryAgain}</PrimaryButton>
      </div>
    );
  }
}
