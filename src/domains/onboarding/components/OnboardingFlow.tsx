import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { OnboardingScreen } from '../types/screens';
import type { OnboardingConfig } from '../types/config';
import { useOnboardingProgress } from './hooks/useOnboardingProgress';
import { useOnboardingAnalytics } from './hooks/useOnboardingAnalytics';
import { OnboardingIntlProvider } from './OnboardingIntl';
import { ProgressBar } from './shared/ProgressBar';
import { ScreenContainer } from './shared/ScreenContainer';
import { AnimationWrapper, type ScreenTransition } from './shared/AnimationWrapper';
import { OnboardingErrorBoundary } from './shared/OnboardingErrorBoundary';
import { useOnboardingIntl } from './OnboardingIntl';
import { checkFlowStructure } from '../validation/flow-structure-check';
import {
  WelcomeScreen,
  GoalQuestionScreen,
  PainPointsScreen,
  SocialProofScreen,
  TinderCardsScreen,
  PersonalizedSolutionScreen,
  ComparisonScreen,
  PreferencesScreen,
  PermissionPrimingScreen,
  ProcessingScreen,
  AppDemoScreen,
  ValueDeliveryScreen,
  AccountGateScreen,
  PaywallScreen,
} from './screens';

export interface OnboardingFlowProps {
  config: OnboardingConfig;
  /** Test/Storybook hook: skip persistence. */
  ephemeral?: boolean;
  /** Show progress bar — defaults to true. */
  showProgress?: boolean;
  /** Show back button on non-first screens — defaults to true. */
  allowBack?: boolean;
  /** Show skip button — defaults to true. Calls config.onSkip on click. */
  allowSkip?: boolean;
  /** Custom label for the skip button (overrides `labels.skip`). */
  skipLabel?: string;
  /** Transition style between screens — defaults to 'slide'. */
  transition?: ScreenTransition;
  /** Override the default error UI from inside the boundary. */
  renderError?: (error: Error, retry: () => void) => React.ReactNode;
}

/**
 * Factory + dispatch table: maps a screen type to its component.
 * Each screen is responsible for emitting its own data shape via onNext.
 */
type ProgressReturn = ReturnType<typeof useOnboardingProgress>;

function renderScreen(
  screen: OnboardingScreen,
  progress: ProgressReturn,
  config: OnboardingConfig,
  onStepCompleted: (data: unknown) => void,
) {
  switch (screen.type) {
    case 'welcome':
      return <WelcomeScreen config={screen} onNext={() => onStepCompleted(undefined)} />;
    case 'goal-question':
      return (
        <GoalQuestionScreen
          config={screen}
          onNext={(data) => onStepCompleted(data)}
          initialSelected={
            (progress.collected[screen.id] as { selected?: string[] } | undefined)?.selected
          }
        />
      );
    case 'pain-points':
      return (
        <PainPointsScreen
          config={screen}
          onNext={(data) => onStepCompleted(data)}
          initialSelected={
            (progress.collected[screen.id] as { selected?: string[] } | undefined)?.selected
          }
        />
      );
    case 'social-proof':
      return <SocialProofScreen config={screen} onNext={() => onStepCompleted(undefined)} />;
    case 'tinder-cards':
      return <TinderCardsScreen config={screen} onNext={(data) => onStepCompleted(data)} />;
    case 'personalized-solution': {
      // Deterministic: personalization is driven by the pain-points screen's
      // collected selections — never by "whichever screen happens to have a
      // `selected` field".
      const painScreen = config.screens.find((s) => s.type === 'pain-points');
      const painIds = painScreen
        ? ((progress.collected[painScreen.id] as { selected?: string[] } | undefined)
            ?.selected ?? [])
        : [];
      return (
        <PersonalizedSolutionScreen
          config={{ ...screen, selectedPainPointIds: painIds }}
          onNext={() => onStepCompleted(undefined)}
        />
      );
    }
    case 'comparison':
      return <ComparisonScreen config={screen} onNext={() => onStepCompleted(undefined)} />;
    case 'preferences':
      return <PreferencesScreen config={screen} onNext={(data) => onStepCompleted(data)} />;
    case 'permission-priming':
      return (
        <PermissionPrimingScreen
          config={screen}
          onNext={(data) => onStepCompleted({ status: data.status })}
          analytics={config.analytics}
        />
      );
    case 'processing':
      return <ProcessingScreen config={screen} onComplete={(data) => onStepCompleted(data)} />;
    case 'app-demo':
      return <AppDemoScreen config={screen} onNext={(data) => onStepCompleted(data)} />;
    case 'value-delivery':
      return <ValueDeliveryScreen config={screen} onNext={() => onStepCompleted(undefined)} />;
    case 'account-gate':
      return <AccountGateScreen config={screen} onNext={(data) => onStepCompleted(data)} />;
    case 'paywall':
      return (
        <PaywallScreen
          config={screen}
          onNext={(data) => onStepCompleted(data)}
          analytics={config.analytics}
        />
      );
    default: {
      // Exhaustive check — TypeScript will flag missing cases at compile time.
      const _exhaustive: never = screen;
      return _exhaustive;
    }
  }
}

/** Back/skip affordances. Rendered inside the intl provider so label overrides apply. */
function FlowFooterNavigation({
  allowBack,
  allowSkip,
  skipLabel,
  isFirst,
  onBack,
  onSkip,
  visible,
}: {
  allowBack: boolean;
  allowSkip: boolean;
  skipLabel?: string;
  isFirst: boolean;
  onBack: () => void;
  onSkip: () => void;
  visible: boolean;
}) {
  const { labels } = useOnboardingIntl();
  if (!visible) return null;
  return (
    <div className="flex items-center justify-between">
      {allowBack && !isFirst ? (
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold text-[rgb(var(--uob-text-muted))] underline-offset-4 hover:underline"
        >
          {labels.back}
        </button>
      ) : (
        <span />
      )}
      {allowSkip ? (
        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-semibold text-[rgb(var(--uob-text-muted))] underline-offset-4 hover:underline"
        >
          {skipLabel ?? labels.skip}
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

/**
 * OnboardingFlow — the orchestrator.
 * Responsibilities (SRP):
 *  1. Validate the configured flow at mount (fail fast on bad config).
 *  2. Own the progress state machine via useOnboardingProgress.
 *  3. Dispatch the active screen via the factory above.
 *  4. Emit lifecycle analytics (started / step / completed / abandoned — each exactly once).
 *  5. Provide skip/back affordances and progress.
 *  6. Wrap everything in an Error Boundary so a single broken screen never breaks the flow.
 *
 * Does NOT own:
 *  - Styling tokens (theme/cn)
 *  - Analytics provider internals (useOnboardingAnalytics)
 *  - Storage (useOnboardingProgress)
 *  - Screen-specific UI (rendered components)
 */
export function OnboardingFlow({
  config,
  ephemeral = false,
  showProgress = true,
  allowBack = true,
  allowSkip = true,
  skipLabel,
  transition = 'slide',
  renderError,
}: OnboardingFlowProps) {
  const progress = useOnboardingProgress({
    screens: config.screens,
    storageKey: config.storageKey,
    ephemeral,
  });
  const analytics = useOnboardingAnalytics(config.analytics);

  // Validate configuration once at mount. Surface errors rather than render broken UI.
  const validation = useMemo(() => checkFlowStructure(config.screens), [config.screens]);
  useEffect(() => {
    if (!validation.ok) {
      throw new Error(`[web-onboarding] invalid flow: ${validation.reason}`);
    }
  }, [validation]);

  // Lifecycle analytics — started fires exactly once, even if the consumer
  // recreates the config object on every render.
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    analytics.trackEvent({
      name: 'onboarding_started',
      category: config.category,
      timestamp: Date.now(),
    });
  }, [analytics, config.category]);

  // Completion — fires exactly once per finished run.
  const completedRef = useRef(false);
  useEffect(() => {
    if (!progress.isFinished || !progress.result) return;
    if (completedRef.current) return;
    completedRef.current = true;
    analytics.trackEvent({
      name: 'onboarding_completed',
      durationMs: progress.result.durationMs,
      timestamp: Date.now(),
    });
    config.onComplete?.(progress.result);
  }, [progress.isFinished, progress.result, analytics, config]);

  // Abandonment — when the flow unmounts without finishing AND the user had
  // engaged (advanced at least one step), report where they dropped off.
  // React StrictMode dev double-mounts happen before engagement, so they do not
  // produce spurious events.
  const abandonSnapshotRef = useRef({ engaged: false, finished: false, currentStep: 0, startedAt: new Date() });
  useEffect(() => {
    abandonSnapshotRef.current = {
      engaged: progress.completedSteps.length > 0,
      finished: progress.isFinished,
      currentStep: progress.currentStep,
      startedAt: progress.startedAt,
    };
  }, [progress.completedSteps.length, progress.isFinished, progress.currentStep, progress.startedAt]);
  useEffect(() => {
    return () => {
      const snapshot = abandonSnapshotRef.current;
      if (snapshot.finished || !snapshot.engaged) return;
      analytics.trackEvent({
        name: 'onboarding_abandoned',
        lastStepId: config.screens[Math.min(snapshot.currentStep, config.screens.length - 1)]?.id ?? '',
        durationMs: Math.max(0, Date.now() - snapshot.startedAt.getTime()),
        timestamp: Date.now(),
      });
    };
    // Config/analytics are read via closure on unmount; the effect intentionally
    // installs once for the lifetime of the flow.
  }, []);

  const handleStepCompleted = useCallback(
    (data: unknown) => {
      const current = config.screens[progress.currentStep];
      if (!current) return;
      analytics.trackEvent({
        name: 'onboarding_step_completed',
        stepId: current.id,
        stepType: current.type,
        index: progress.currentStep,
        timestamp: Date.now(),
      });
      progress.next(data);
    },
    [analytics, config.screens, progress],
  );

  const handleBack = useCallback(() => {
    if (progress.isFirst) return;
    progress.prev();
  }, [progress]);

  const handleSkip = useCallback(() => {
    const current = config.screens[progress.currentStep];
    if (!current) return;
    analytics.trackEvent({
      name: 'onboarding_step_skipped',
      stepId: current.id,
      index: progress.currentStep,
      timestamp: Date.now(),
    });
    config.onSkip?.();
  }, [analytics, config, progress.currentStep]);

  const active = config.screens[progress.currentStep];
  if (!active) {
    return null;
  }

  return (
    <OnboardingIntlProvider labels={config.labels} locale={config.locale}>
      <OnboardingErrorBoundary {...(renderError ? { renderError } : {})}>
        <div className="uob-flow">
          <ScreenContainer
            header={
              <>
                {config.headerSlot}
                {showProgress && (
                  <ProgressBar
                    current={progress.currentStep + 1}
                    total={progress.totalSteps}
                    showLabel
                  />
                )}
              </>
            }
            footer={
              <>
                <FlowFooterNavigation
                  allowBack={allowBack}
                  allowSkip={allowSkip && Boolean(config.onSkip)}
                  skipLabel={skipLabel}
                  isFirst={progress.isFirst}
                  onBack={handleBack}
                  onSkip={handleSkip}
                  visible={allowBack || allowSkip}
                />
                {config.footerSlot}
              </>
            }
          >
            <AnimationWrapper stepKey={active.id} transition={transition}>
              {renderScreen(active, progress, config, handleStepCompleted)}
            </AnimationWrapper>
          </ScreenContainer>
        </div>
      </OnboardingErrorBoundary>
    </OnboardingIntlProvider>
  );
}
