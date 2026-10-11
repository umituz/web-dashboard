/**
 * PlatformsStep
 *
 * Connect-platform onboarding step. Icons are Lucide components —
 * emoji is forbidden by project rules. Platform `color` is a plain
 * CSS color (brand hex), applied inline — no utility classes.
 */

import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Pin,
  Hash,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../primitives";
import type { OnboardingState, PlatformOption } from "../types/onboarding";
import { ONBOARDING_KEYS } from "../utils/i18nKeys";

export interface PlatformsStepProps {
  state: OnboardingState;
  updateState: (updates: Partial<OnboardingState>) => void;
  platforms?: PlatformOption[];
}

/**
 * Default platform set with brand-accurate Lucide icons and
 * brand colors (CSS color strings, no emoji).
 */
const DEFAULT_PLATFORMS: PlatformOption[] = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "#c026d3" },
  { id: "twitter",   name: "Twitter / X", icon: Twitter, color: "#0f172a" },
  { id: "facebook",  name: "Facebook", icon: Facebook, color: "#1d4ed8" },
  { id: "linkedin",  name: "LinkedIn", icon: Linkedin, color: "#1e3a8a" },
  { id: "tiktok",    name: "TikTok", icon: Hash, color: "#111111" },
  { id: "youtube",   name: "YouTube", icon: Youtube, color: "#dc2626" },
  { id: "pinterest", name: "Pinterest", icon: Pin, color: "#b91c1c" },
];

export const PlatformsStep = ({
  state,
  updateState,
  platforms,
}: PlatformsStepProps) => {
  const { t } = useTranslation();
  const platformOptions = platforms ?? DEFAULT_PLATFORMS;

  const togglePlatform = (id: string) => {
    const isConnected = state.connectedPlatforms.includes(id);
    updateState({
      connectedPlatforms: isConnected
        ? state.connectedPlatforms.filter((p) => p !== id)
        : [...state.connectedPlatforms, id],
    });
  };

  const selectedCount = state.connectedPlatforms.length;

  return (
    <div className="udb-step udb-step--wide">
      <div className="udb-step__header">
        <h1 className="udb-step__title">
          {t(ONBOARDING_KEYS.platforms.title)}
        </h1>
        <p className="udb-step__description">
          {t(ONBOARDING_KEYS.platforms.description)}
        </p>
      </div>

      <div
        className="udb-platforms"
        role="group"
        aria-label={t(ONBOARDING_KEYS.platforms.title)}
      >
        {platformOptions.map((platform) => {
          const isConnected = state.connectedPlatforms.includes(platform.id);
          const Icon = platform.icon;
          return (
            <button
              key={platform.id}
              type="button"
              aria-pressed={isConnected}
              onClick={() => togglePlatform(platform.id)}
              className={cn(
                "udb-platform",
                isConnected && "udb-platform--connected",
              )}
            >
              <span
                className="udb-platform__icon-box"
                style={{ background: platform.color }}
              >
                <Icon className="udb-platform__icon" aria-hidden="true" />
              </span>

              <span className="udb-platform__meta">
                <span className="udb-platform__name">{platform.name}</span>
                <span
                  className={cn(
                    "udb-platform__state",
                    isConnected && "udb-platform__state--on",
                  )}
                >
                  {isConnected
                    ? t(ONBOARDING_KEYS.platforms.connected)
                    : t(ONBOARDING_KEYS.platforms.connect)}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {selectedCount > 0 && (
        <p className="udb-step__hint" role="status" aria-live="polite">
          {t(ONBOARDING_KEYS.platforms.selected, {
            count: selectedCount,
            plural: selectedCount === 1 ? '' : 's',
          })}
        </p>
      )}
    </div>
  );
};

export default PlatformsStep;
