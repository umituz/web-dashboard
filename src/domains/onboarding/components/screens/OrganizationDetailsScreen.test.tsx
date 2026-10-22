import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { OrganizationDetailsScreen } from './OrganizationDetailsScreen';
import { OnboardingIntlProvider } from '../OnboardingIntl';
import type { OnboardingLabels } from '../../types/labels';
import type { OrganizationDetailsScreenConfig } from '../../types/screens';

const LABELS: OnboardingLabels = {
  progressLabel: 'P',
  continueAction: 'Continue',
  back: 'Back',
  skip: 'Skip',
  loading: 'Loading',
  stepOfPattern: '{a} of {b}',
  countOfPattern: '{a}/{b}',
  selectAllThatApply: 'Select all',
  selectOne: 'Select one',
  pickUpToPattern: 'Pick {n}',
  pickTheOne: 'Pick one',
  tailorExperience: 'Tailor',
  agree: 'Agree',
  disagree: 'Disagree',
  swipeHint: 'Swipe',
  allDone: 'Done',
  withoutUs: 'Without',
  withUs: 'With',
  previous: 'Prev',
  nextAction: 'Next',
  continueWithResult: 'Continue',
  allowAccess: 'Allow',
  permissionRequestFailed: 'Failed',
  continueWithEmail: 'Email',
  continueWithGoogle: 'Google',
  continueWithApple: 'Apple',
  continueWithGitHub: 'GitHub',
  skipForNow: 'Skip',
  signInFailed: 'Failed',
  couldNotStartTrial: 'No trial',
  trialDaysPattern: '{n} days',
  trialIntroPattern: 'Trial',
  cancelAnytimeNote: 'Cancel anytime',
  share: 'Share',
  copied: 'Copied',
  somethingWentWrong: 'Error',
  unexpectedError: 'Unexpected',
  tryAgain: 'Retry',
};

const CONFIG: OrganizationDetailsScreenConfig = {
  id: 'org',
  type: 'organization-details',
  title: 'About your organization',
};

const mount = (
  props: Partial<Parameters<typeof OrganizationDetailsScreen>[0]> = {},
  labels?: Partial<OnboardingLabels>,
) =>
  render(
    <OnboardingIntlProvider labels={{ ...LABELS, ...labels }}>
      <OrganizationDetailsScreen config={CONFIG} onNext={() => undefined} {...props} />
    </OnboardingIntlProvider>,
  );

const continueButton = () =>
  screen.getByText('Continue').closest('button') as HTMLButtonElement;

describe('OrganizationDetailsScreen', () => {
  it('requires a non-blank organization name to continue', () => {
    mount();
    expect(continueButton().disabled).toBe(true);
    fireEvent.change(screen.getByLabelText('Organization name'), {
      target: { value: '  Northwind  ' },
    });
    expect(continueButton().disabled).toBe(false);
  });

  it('emits the trimmed name and selected team size', () => {
    const onNext = vi.fn();
    mount({
      onNext,
      config: {
        ...CONFIG,
        teamSizeOptions: [
          { id: '1', label: 'Just me' },
          { id: '2-10', label: '2-10' },
        ],
      },
    });
    fireEvent.change(screen.getByLabelText('Organization name'), {
      target: { value: ' Northwind ' },
    });
    fireEvent.change(screen.getByLabelText('Team size'), { target: { value: '2-10' } });
    fireEvent.click(continueButton());
    expect(onNext).toHaveBeenCalledWith({ name: 'Northwind', teamSize: '2-10' });
  });

  it('skips the team-size question without options', () => {
    mount();
    expect(screen.queryByLabelText('Team size')).toBeNull();
  });

  it('restores a previously collected answer', () => {
    mount({ initial: { name: 'Contoso', teamSize: '2-10' } });
    expect((screen.getByLabelText('Organization name') as HTMLInputElement).value).toBe(
      'Contoso',
    );
    expect(continueButton().disabled).toBe(false);
  });

  it('honors label overrides', () => {
    mount({}, { organizationNameLabel: 'Kurum adı' });
    expect(screen.getByLabelText('Kurum adı')).not.toBeNull();
  });
});
