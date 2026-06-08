/**
 * SocialLoginButtons
 *
 * Renders a list of social auth providers as a row of icon buttons.
 * Generic over the provider id so adding a new provider is a config change,
 * not a code change.
 */

import { Button } from "@umituz/web-design-system/atoms";
import { GoogleIcon, AppleIcon } from "./SocialProviderIcons";

export type SocialProviderId = 'google' | 'apple';

export interface SocialLoginButtonsProps {
  /** Provider handlers keyed by provider id */
  onProvider: (id: SocialProviderId) => void;
  /** Translation function */
  translate: (key: string) => string;
  /** Disable all buttons (e.g., during form submission) */
  disabled?: boolean;
}

/**
 * Centralized provider config. Add new providers here and the UI follows.
 */
const SOCIAL_PROVIDERS: ReadonlyArray<{
  id: SocialProviderId;
  labelKey: string;
  Icon: typeof GoogleIcon;
}> = [
  { id: 'google', labelKey: 'auth.social.continueWithGoogle', Icon: GoogleIcon },
  { id: 'apple', labelKey: 'auth.social.continueWithApple', Icon: AppleIcon },
];

export const SocialLoginButtons = ({
  onProvider,
  translate,
  disabled = false,
}: SocialLoginButtonsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SOCIAL_PROVIDERS.map(({ id, labelKey, Icon }) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          onClick={() => onProvider(id)}
          disabled={disabled}
          aria-label={translate(labelKey)}
          className="w-full"
        >
          <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
          {translate(labelKey)}
        </Button>
      ))}
    </div>
  );
};
