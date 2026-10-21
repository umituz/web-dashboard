import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { OnboardingFlow } from './OnboardingFlow';
import { defaultStorageKey } from '../utils/default-storage-key';
import type { OnboardingConfig, OnboardingScreen, OnboardingLabels } from '../types';

const labels: OnboardingLabels = {
  progressLabel: 'Onboarding progress',
  continueAction: 'Continue',
  back: 'Back',
  skip: 'Skip',
  loading: 'Loading…',
  stepOfPattern: 'Step {current} of {total}',
  countOfPattern: '{current} of {total}',
  selectAllThatApply: 'Select all that apply',
  selectOne: 'Select one',
  pickUpToPattern: 'Pick up to {max}',
  pickTheOne: 'Pick the one that bothers you most',
  tailorExperience: 'Tailor the experience to your needs',
  agree: 'Agree',
  disagree: 'Disagree',
  swipeHint: 'Swipe right if you agree, left if you don’t. Or use the arrow keys.',
  allDone: 'All done — that was easy.',
  withoutUs: 'Without us',
  withUs: 'With us',
  previous: 'Previous',
  nextAction: 'Next',
  continueWithResult: 'Continue with my result',
  allowAccess: 'Allow access',
  permissionRequestFailed: 'Permission request failed',
  continueWithEmail: 'Continue with email',
  continueWithGoogle: 'Continue with Google',
  continueWithApple: 'Continue with Apple',
  continueWithGitHub: 'Continue with GitHub',
  skipForNow: 'Skip for now',
  signInFailed: 'Sign-in failed',
  couldNotStartTrial: 'Could not start trial',
  trialDaysPattern: '{count}-day free trial',
  trialIntroPattern: '{price} for the first {days} days',
  cancelAnytimeNote: 'Cancel anytime. No hidden fees.',
  share: 'Share',
  copied: 'Copied!',
  somethingWentWrong: 'Something went wrong',
  unexpectedError: 'An unexpected error occurred during onboarding.',
  tryAgain: 'Try again',
};

const paywall: OnboardingScreen = {
  id: 'pay',
  type: 'paywall',
  title: 'Go Premium',
  subtitle: 'Everything, unlocked.',
  price: '$6.99',
  trialDays: 7,
  features: [{ iconName: 'Zap', text: 'Faster everything' }],
  cta: 'Start free trial',
  onAccept: async () => ({ accepted: true, trialStarted: true }),
};

const accountGate: OnboardingScreen = {
  id: 'gate',
  type: 'account-gate',
  title: 'Create your account',
  optional: false,
  signInMethod: 'email',
  onSignIn: async () => ({ signedIn: true, method: 'email' }),
};

const welcome: OnboardingScreen = {
  id: 'w',
  type: 'welcome',
  title: 'Welcome',
  subtitle: 'Hello',
  cta: 'Get started',
};

const minimalConfig = (overrides: Partial<OnboardingConfig> = {}): OnboardingConfig => ({
  category: 'health',
  screens: [welcome, accountGate, paywall],
  labels,
  ...overrides,
});

type FlowProps = Omit<Partial<React.ComponentProps<typeof OnboardingFlow>>, 'config'>;

function renderFlow(config: OnboardingConfig, props: FlowProps = {}) {
  return render(
    <OnboardingFlow config={{ ...config, storageKey: 'test:flow' }} ephemeral {...props} />,
  );
}

async function passAccountGate(nextTitle: string) {
  fireEvent.click(screen.getByRole('button', { name: 'Continue with email' }));
  await waitFor(() => expect(screen.getByText(nextTitle)).toBeTruthy());
}

beforeEach(() => {
  window.localStorage.clear();
      vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('OnboardingFlow — navigation', () => {
  it('renders the first screen with the progress label "Step 1 of 3"', () => {
    renderFlow(minimalConfig());
    expect(screen.getByText('Welcome')).toBeTruthy();
    expect(screen.getByText('Step 1 of 3')).toBeTruthy();
  });

  it('advances through screens via the primary CTA (§1.1)', () => {
    renderFlow(minimalConfig());
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(screen.getByText('Create your account')).toBeTruthy();
    expect(screen.getByText('Step 2 of 3')).toBeTruthy();
  });

  it('navigates back and offers no back affordance on the first screen (§1.2)', () => {
    renderFlow(minimalConfig());
    expect(screen.queryByText('Back')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    fireEvent.click(screen.getByText('Back'));
    expect(screen.getByText('Welcome')).toBeTruthy();
    expect(screen.getByText('Step 1 of 3')).toBeTruthy();
    expect(screen.queryByText('Back')).toBeNull();
  });

  it('invokes onSkip and fires onboarding_step_skipped (§1.3)', () => {
    const onSkip = vi.fn();
    const tracker = vi.fn();
    renderFlow(
      minimalConfig({
        onSkip,
        analytics: { trackEvents: true, provider: 'custom', customTracker: tracker },
      }),
    );
    fireEvent.click(screen.getByText('Skip'));
    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(tracker.mock.calls.map((c) => c[0].name)).toContain('onboarding_step_skipped');
  });

  it('hides the skip affordance when no onSkip is configured', () => {
    renderFlow(minimalConfig({ onSkip: undefined }));
    expect(screen.queryByText('Skip')).toBeNull();
  });
});

describe('OnboardingFlow — analytics funnel', () => {
  it('emits started, per-step completed, and completed — each exactly once', async () => {
    const tracker = vi.fn();
    const onComplete = vi.fn();
    renderFlow(
      minimalConfig({
        onComplete,
        analytics: { trackEvents: true, provider: 'custom', customTracker: tracker },
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    await passAccountGate('Go Premium');
    fireEvent.click(screen.getByRole('button', { name: 'Start free trial' }));

    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
    const names = tracker.mock.calls.map((c) => c[0].name);
    expect(names[0]).toBe('onboarding_started');
    expect(names.filter((n) => n === 'onboarding_started')).toHaveLength(1);
    expect(names.filter((n) => n === 'onboarding_step_completed')).toHaveLength(3);
    expect(names).toContain('paywall_viewed');
    expect(names).toContain('paywall_accepted');
    expect(names.filter((n) => n === 'onboarding_completed')).toHaveLength(1);
  });

  it('emits onboarding_abandoned on unmount after engagement, never before', () => {
    const tracker = vi.fn();
    const analytics = { trackEvents: true, provider: 'custom', customTracker: tracker } as const;
    const first = renderFlow(minimalConfig({ analytics }));
    first.unmount();     expect(tracker.mock.calls.map((c) => c[0].name)).not.toContain('onboarding_abandoned');

    const second = renderFlow(minimalConfig({ analytics }));
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    second.unmount();
    const names = tracker.mock.calls.map((c) => c[0].name);
    expect(names).toContain('onboarding_abandoned');
    const abandoned = tracker.mock.calls.find((c) => c[0].name === 'onboarding_abandoned');
    expect(abandoned?.[0].lastStepId).toBe('gate');
  });

  it('stays silent when analytics is disabled (§17.2)', () => {
    const tracker = vi.fn();
    renderFlow(
      minimalConfig({ analytics: { trackEvents: false, provider: 'custom', customTracker: tracker } }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(tracker).not.toHaveBeenCalled();
  });
});

describe('OnboardingFlow — validation & error boundary', () => {
  it('fails fast on duplicate step ids (§1.11)', () => {
    const bad = minimalConfig({ screens: [welcome, { ...welcome }] });
    expect(() => renderFlow(bad)).toThrow(/duplicate step id/);
  });

  const brokenDemo = (): OnboardingScreen => {
    const Boom = (): React.ReactNode => {
      throw new Error('demo boom');
    };
    return {
      id: 'demo',
      type: 'app-demo',
      demo: {
        component: Boom as unknown as React.ComponentType<Record<string, unknown>>,
        onSave: () => undefined,
      },
    };
  };

  it('recovers via the default error UI (§1.7)', () => {
    renderFlow(minimalConfig({ screens: [welcome, brokenDemo()] }));
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('demo boom')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
  });

  it('renders a custom renderError UI instead of the default (§1.8)', () => {
    renderFlow(minimalConfig({ screens: [welcome, brokenDemo()] }), {
      renderError: (err: Error, retry: () => void) => (
        <div>
          <p>Custom handler: {err.message}</p>

          <button type="button" onClick={retry}>
            Retry anyway
          </button>

        </div>

      ),
    });
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(screen.getByText('Custom handler: demo boom')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Retry anyway' })).toBeTruthy();
  });
});

describe('OnboardingFlow — persistence', () => {
  it('restores progress across remounts (non-ephemeral)', () => {
    const config = { ...minimalConfig(), storageKey: 'persist:1' };
    const { unmount } = render(<OnboardingFlow config={config} />);
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    unmount();

    render(<OnboardingFlow config={config} />);
    expect(screen.getByText('Create your account')).toBeTruthy();
    expect(screen.getByText('Step 2 of 3')).toBeTruthy();
  });

  it('does not persist in ephemeral mode', () => {
    renderFlow(minimalConfig());
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(localStorage.getItem('test:flow')).toBeNull();
    expect(localStorage.getItem(defaultStorageKey)).toBeNull();
  });
});

describe('OnboardingFlow — labels & locale', () => {
  it('renders the supplied labels verbatim', () => {
    renderFlow(
      minimalConfig({
        labels: { ...labels, back: 'Geri', skip: 'Atla' },
        onSkip: () => undefined,
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(screen.getByText('Geri')).toBeTruthy();
    expect(screen.getByText('Atla')).toBeTruthy();
  });

  it('formats counts with the configured locale', () => {
    renderFlow(
      minimalConfig({
        screens: [welcome, { ...paywall, socialProof: { text: 'Loved by', count: 1200000 } }],
        locale: 'de-DE',
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(screen.getByText(/1\.200\.000/)).toBeTruthy();
  });
});

describe('screens — account gate & paywall contracts', () => {
  it('account gate: no skip affordance when required (§14.1)', () => {
    renderFlow(minimalConfig());
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(screen.queryByText('Skip for now')).toBeNull();
  });

  it('account gate: optional gate offers "Skip for now" which advances unsigned-in (§14.2)', () => {
    renderFlow(minimalConfig({
      screens: [welcome, { ...accountGate, optional: true }, paywall],
    }));
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    fireEvent.click(screen.getByText('Skip for now'));
    expect(screen.getByText('Go Premium')).toBeTruthy();
  });

  it('account gate: sign-in failure shows an error and does not advance (§14.3)', async () => {
    const config = minimalConfig({
      screens: [
        welcome,
        {
          ...accountGate,
          onSignIn: async () => {
            throw new Error('provider down');
          },
        },
        paywall,
      ],
    });
    renderFlow(config);
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue with email' }));
    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toContain('provider down'),
    );
    expect(screen.getByText('Create your account')).toBeTruthy();   });

  it('paywall: accept advances and fires paywall_accepted (§15.1)', async () => {
    const tracker = vi.fn();
    const onComplete = vi.fn();
    renderFlow(
      minimalConfig({
        onComplete,
        analytics: { trackEvents: true, provider: 'custom', customTracker: tracker },
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    await passAccountGate('Go Premium');
    fireEvent.click(screen.getByRole('button', { name: 'Start free trial' }));
    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
    expect(tracker.mock.calls.map((c) => c[0].name)).toContain('paywall_accepted');
  });

  it('paywall: secondary CTA declines and advances (§15.2)', async () => {
    const onSecondaryCta = vi.fn();
    const tracker = vi.fn();
    renderFlow(
      minimalConfig({
        screens: [welcome, accountGate, { ...paywall, secondaryCta: 'No thanks', onSecondaryCta }],
        analytics: { trackEvents: true, provider: 'custom', customTracker: tracker },
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    await passAccountGate('Go Premium');
    fireEvent.click(screen.getByRole('button', { name: 'No thanks' }));
    expect(onSecondaryCta).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(tracker.mock.calls.map((c) => c[0].name)).toContain('paywall_declined'),
    );
  });

  it('paywall: a throwing onAccept KEEPS the user on the screen with an error (revised §15.3)', async () => {
    const onComplete = vi.fn();
    renderFlow(
      minimalConfig({
        onComplete,
        screens: [
          welcome,
          accountGate,
          {
            ...paywall,
            onAccept: async () => {
              throw new Error('charge failed');
            },
          },
        ],
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    await passAccountGate('Go Premium');
    fireEvent.click(screen.getByRole('button', { name: 'Start free trial' }));
    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toContain('charge failed'),
    );
        expect(screen.getByText('Go Premium')).toBeTruthy();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('paywall: renders "{count}-day free trial" without trialPrice (§15.4)', async () => {
    renderFlow(minimalConfig());
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    await passAccountGate('Go Premium');
    expect(screen.getByText('7-day free trial')).toBeTruthy();
  });

  it('paywall: uses the trial intro pattern when trialPrice is set (§15.4)', async () => {
    renderFlow(
      minimalConfig({ screens: [welcome, accountGate, { ...paywall, trialPrice: '$0.99' }] }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    await passAccountGate('Go Premium');
    expect(screen.getByText('$0.99 for the first 7 days')).toBeTruthy();
  });
});

describe('permission priming screen — funnel events', () => {
  const priming: OnboardingScreen = {
    id: 'perm',
    type: 'permission-priming',
    title: 'Stay on track',
    description: 'Reminders keep streaks alive.',
    permission: 'notifications',
    benefits: ['Timely nudges'],
    onRequest: async () => 'granted',
  };

  it('fires requested + granted and advances on success (§10.1)', async () => {
    const tracker = vi.fn();
    renderFlow(
      minimalConfig({
        screens: [welcome, priming, accountGate],
        analytics: { trackEvents: true, provider: 'custom', customTracker: tracker },
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    fireEvent.click(screen.getByRole('button', { name: 'Allow access' }));
    await waitFor(() => expect(screen.getByText('Create your account')).toBeTruthy());
    const names = tracker.mock.calls.map((c) => c[0].name);
    expect(names).toContain('permission_requested');
    expect(names).toContain('permission_granted');
  });

  it('shows an inline error and does NOT advance when onRequest throws (§10.3)', async () => {
    const tracker = vi.fn();
    renderFlow(
      minimalConfig({
        screens: [
          welcome,
          { ...priming, onRequest: async () => Promise.reject(new Error('user cancelled')) },
          accountGate,
        ],
        analytics: { trackEvents: true, provider: 'custom', customTracker: tracker },
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    fireEvent.click(screen.getByRole('button', { name: 'Allow access' }));
    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toContain('user cancelled'),
    );
    expect(screen.getByText('Stay on track')).toBeTruthy();     expect(tracker.mock.calls.map((c) => c[0].name)).toContain('permission_denied');
  });
});

describe('processing screen — auto-advance', () => {
  it('completes each step on its timer, then advances the flow (§11.1)', async () => {
    vi.useFakeTimers();
    try {
      const processing: OnboardingScreen = {
        id: 'proc',
        type: 'processing',
        title: 'Building your plan',
        steps: ['A', 'B', 'C'],
        durationMs: 300,         onComplete: () => undefined,
      };
      renderFlow(minimalConfig({ screens: [welcome, processing, accountGate] }));
      fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
      expect(screen.getByText('Building your plan')).toBeTruthy();

                  for (let i = 0; i < 3; i++) {
        await act(async () => {
          vi.advanceTimersByTime(100);
        });
      }
            expect(screen.getByText('Create your account')).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });
});
