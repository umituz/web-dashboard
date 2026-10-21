import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SwipeCard } from './SwipeCard';
import { OnboardingIntlProvider } from './OnboardingIntl';
import type { OnboardingLabels } from '../types';

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

function renderCard(props: Partial<React.ComponentProps<typeof SwipeCard>> = {}) {
  return render(
    <OnboardingIntlProvider labels={labels}>
      <SwipeCard
        text="I want to feel better"
        category="Mood"
        onSwipeLeft={vi.fn()}
        onSwipeRight={vi.fn()}
        {...props}
      />
    </OnboardingIntlProvider>,
  );
}

describe('SwipeCard', () => {
  it('triggers onSwipeRight on ArrowRight and onSwipeLeft on ArrowLeft', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    renderCard({ onSwipeLeft, onSwipeRight });
    const card = screen.getByRole('group');
    card.focus();
    fireEvent.keyDown(card, { key: 'ArrowRight' });
    expect(onSwipeRight).toHaveBeenCalledTimes(1);
    expect(onSwipeLeft).not.toHaveBeenCalled();
    fireEvent.keyDown(card, { key: 'ArrowLeft' });
    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
  });

  it('renders the AGREE / DISAGREE badges and the swipe hint', () => {
    renderCard();
    expect(screen.getByText('Agree')).toBeTruthy();
    expect(screen.getByText('Disagree')).toBeTruthy();
    expect(screen.getByText(/arrow keys/)).toBeTruthy();
  });

  it('ignores unrelated keys', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    renderCard({ onSwipeLeft, onSwipeRight });
    fireEvent.keyDown(screen.getByRole('group'), { key: 'Enter' });
    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });
});
