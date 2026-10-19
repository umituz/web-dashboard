/**
 * Every user-facing string the library renders lives here as an overridable
 * label. Applications serving non-English markets pass a `labels` subset (and
 * optionally a `locale`) via `OnboardingConfig`; anything not overridden falls
 * back to the English defaults.
 *
 * Labels are flat, serializable strings — no functions — so they can be fed
 * straight from any translation system (i18next, Lingui, a CMS, …).
 * Pattern labels use `{placeholder}` interpolation, e.g. `"Step {current} of {total}"`.
 */
export interface OnboardingLabels {
  /** Default CTA label when a screen defines no `cta`. */
  continueAction: string;
  /** Footer back affordance. */
  back: string;
  /** Footer skip affordance (the `skipLabel` prop takes precedence). */
  skip: string;
  /** Primary button label while `loading` is true. */
  loading: string;
  /** Progress bar label. `{current}`/`{total}` are interpolated. */
  stepOfPattern: string;
  /** Card counter label. `{current}`/`{total}` are interpolated. */
  countOfPattern: string;

  /** Question screens */
  selectAllThatApply: string;
  selectOne: string;
  /** Multi-select hint with a cap. `{max}` is interpolated. */
  pickUpToPattern: string;
  /** Single-select hint for the pain-points screen. */
  pickTheOne: string;
  /** Preferences screen subtitle. */
  tailorExperience: string;

  /** Swipe / tinder screens */
  agree: string;
  disagree: string;
  /** How to operate the swipe card (gesture + keyboard). */
  swipeHint: string;
  /** Shown when every card has been decided. */
  allDone: string;

  /** Comparison screen column headings */
  withoutUs: string;
  withUs: string;

  /** Social proof carousel controls */
  previous: string;
  nextAction: string;

  /** App demo screen CTA. */
  continueWithResult: string;

  /** Permission priming */
  allowAccess: string;
  permissionRequestFailed: string;

  /** Account gate */
  continueWithEmail: string;
  continueWithGoogle: string;
  continueWithApple: string;
  continueWithGitHub: string;
  skipForNow: string;
  signInFailed: string;

  /** Paywall */
  couldNotStartTrial: string;
  /** `{count}` interpolated, e.g. "7-day free trial". */
  trialDaysPattern: string;
  /** `{price}`/`{days}` interpolated, e.g. "$0.99 for the first 7 days". */
  trialIntroPattern: string;
  /** Reassurance line under the paywall CAs. */
  cancelAnytimeNote: string;

  /** Value delivery sharing */
  share: string;
  copied: string;

  /** Error boundary default UI */
  somethingWentWrong: string;
  unexpectedError: string;
  tryAgain: string;
}
