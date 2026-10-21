import { useState } from 'react';
import { PrimaryButton } from '../PrimaryButton';
import { renderBundledIcon } from '../renderBundledIcon';
import { usePermissionPriming } from '../../hooks/usePermissionPriming';
import { useOnboardingAnalytics } from '../../hooks/useOnboardingAnalytics';
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
  const { status } = usePermissionPriming(config.permission);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    <div className="udb-onb-proof">
      {doesIconNameResolve(iconName) && (
        <div className="udb-onb-hero udb-onb-hero--lg" aria-hidden="true">
          {renderBundledIcon(iconName, 'udb-onb-icon--lg')}
        </div>

      )}
      <div className="udb-onb-question__head">
        <h2 className="udb-onb-title">{config.title}</h2>

        <p className="udb-onb-lead">{config.description}</p>

      </div>

      <ul className="udb-onb-list">
        {config.benefits.map((benefit) => (
          <li key={benefit} className="udb-onb-benefit">
            <span className="udb-onb-benefit__dot" />
            <span>{benefit}</span>

          </li>

        ))}
      </ul>

      {error && (
        <p role="alert" className="udb-onb-error">
          {error}
        </p>

      )}
      <PrimaryButton onClick={handleRequest} loading={isRequesting}>
        {isPermissionGranted(status) ? labels.continueAction : config.cta ?? labels.allowAccess}
      </PrimaryButton>

    </div>

  );
}
