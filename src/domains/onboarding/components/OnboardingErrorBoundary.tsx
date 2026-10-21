import { Component, Fragment, type ContextType, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';
import { OnboardingIntlContext, type OnboardingIntl } from './OnboardingIntl';

export interface OnboardingErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  renderError?: (error: Error, retry: () => void) => ReactNode;
}

interface OnboardingErrorBoundaryState {
  error: Error | null;
  attempt: number;
}

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
    console.error('[onboarding] render error', error, info.componentStack);
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
      <div role="alert" className="udb-onb udb-onb-errorpage">
        <div className="udb-onb-errorpage__icon" aria-hidden="true">
          <AlertTriangle className="udb-onb-icon--lg" />
        </div>

        <h2 className="udb-onb-title">{labels.somethingWentWrong}</h2>

        <p className="udb-onb-lead">{error.message || labels.unexpectedError}</p>

        <PrimaryButton onClick={this.retry}>{labels.tryAgain}</PrimaryButton>

      </div>

    );
  }
}
