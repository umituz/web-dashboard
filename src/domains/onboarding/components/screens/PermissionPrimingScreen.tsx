import { useState } from 'react';
import { PrimaryButton } from '../shared/PrimaryButton';
import { renderBundledIcon } from '../shared/renderBundledIcon';
import { usePermissionPriming } from '../hooks/usePermissionPriming';
import { useOnboardingAnalytics } from '../hooks/useOnboardingAnalytics';
import { doesIconNameResolve } from '../../predicates/icon-name-resolves';
import { isPermissionGranted } from '../../predicates/permission-granted';
import { useOnboardingIntl } from '../OnboardingIntl';
import type { PermissionPrimingScreenConfig, PermissionStatus } from '../../types/screens';
import type { AnalyticsConfig } from '../../types/config';

const PERMISSION_DEFAULT_ICON: Record<string, string> = {
  camera: 'Camera',
  microphone: 'Mic',
  location: 'MapPin',
  notifications: 'Bell',
  photos: 'Image',
  contacts: 'Users',
};

export interface PermissionPrimingScreenProps {
  config: PermissionPrimingScreenConfig;
  onNext: (data: { status: PermissionStatus }) => void;
  analytics?: AnalyticsConfig;
}

export function PermissionPrimingScreen({ config, onNext, analytics }: PermissionPrimingScreenProps) {
  const { labels } = useOnboardingIntl();
  const { trackEvent } = useOnboardingAnalytics(analytics);
  // Hook tracks the live permission state for UI feedback; the screen invokes the
  // consumer-provided `config.onRequest` so the consumer controls the actual mechanism.
  const { status } = usePermissionPriming(config.permission);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Configured icon wins; fall back to the permission's default glyph when the
  // configured name is missing or not in the bundled registry.
  const iconName = doesIconNameResolve(config.iconName)
    ? config.iconName
    : PERMISSION_DEFAULT_ICON[config.permission];

  async function handleRequest() {
    setError(null);
    setIsRequesting(true);
    trackEvent({
      name: 'permission_requested',
      permission: config.permission,
      stepId: config.id,
      timestamp: Date.now(),
    });
    try {
      const next = await config.onRequest();
      trackEvent({
        name: next === 'granted' ? 'permission_granted' : 'permission_denied',
        permission: config.permission,
        stepId: config.id,
        timestamp: Date.now(),
      });
      onNext({ status: next });
    } catch (e) {
      trackEvent({
        name: 'permission_denied',
        permission: config.permission,
        stepId: config.id,
        timestamp: Date.now(),
      });
      const message = e instanceof Error ? e.message : labels.permissionRequestFailed;
      setError(message);
    } finally {
      setIsRequesting(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {doesIconNameResolve(iconName) && (
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[rgb(var(--uob-primary-50))] text-[rgb(var(--uob-primary-500))]"
          aria-hidden="true"
        >
          {renderBundledIcon(iconName, 'h-10 w-10')}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-[rgb(var(--uob-text-primary))] sm:text-3xl">
          {config.title}
        </h2>
        <p className="text-base text-[rgb(var(--uob-text-muted))]">{config.description}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {config.benefits.map((benefit) => (
          <li
            key={benefit}
            className="flex items-start gap-2 rounded-lg border border-[rgb(var(--uob-border))] bg-[rgb(var(--uob-surface))] p-3 text-sm text-[rgb(var(--uob-text-primary))]"
          >
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[rgb(var(--uob-primary-500))]" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
      {error && (
        <p
          role="alert"
          className="rounded-md border border-[rgb(var(--uob-error))] bg-[rgb(var(--uob-error))]/10 p-3 text-sm text-[rgb(var(--uob-error))]"
        >
          {error}
        </p>
      )}
      <PrimaryButton onClick={handleRequest} loading={isRequesting}>
        {isPermissionGranted(status) ? labels.continueAction : config.cta ?? labels.allowAccess}
      </PrimaryButton>
    </div>
  );
}
