/**
 * PlatformsStep
 *
 * Connect-platform onboarding step. Icons are Lucide components —
 * emoji is forbidden by project rules.
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
import { cn } from "@umituz/web-design-system/utils";
import type { OnboardingState, PlatformOption } from "../types/onboarding";
import { ONBOARDING_KEYS } from "../utils/i18nKeys";

export interface PlatformsStepProps {
  state: OnboardingState;
  updateState: (updates: Partial<OnboardingState>) => void;
  platforms?: PlatformOption[];
}

/**
 * Default platform set with brand-accurate Lucide icons
 * and gradient backgrounds (no emoji).
 */
const DEFAULT_PLATFORMS: PlatformOption[] = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "from-purple-500 to-pink-500" },
  { id: "twitter",   name: "Twitter / X", icon: Twitter, color: "from-slate-700 to-slate-900" },
  { id: "facebook",  name: "Facebook", icon: Facebook, color: "from-blue-600 to-blue-700" },
  { id: "linkedin",  name: "LinkedIn", icon: Linkedin, color: "from-blue-700 to-blue-800" },
  { id: "tiktok",    name: "TikTok", icon: Hash, color: "from-slate-800 to-black" },
  { id: "youtube",   name: "YouTube", icon: Youtube, color: "from-red-600 to-red-700" },
  { id: "pinterest", name: "Pinterest", icon: Pin, color: "from-red-700 to-red-800" },
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
    <div className="w-full max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          {t(ONBOARDING_KEYS.platforms.title)}
        </h1>
        <p className="text-muted-foreground">
          {t(ONBOARDING_KEYS.platforms.description)}
        </p>
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
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
                "group bg-background border rounded-2xl p-6 flex flex-col items-center gap-4 transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isConnected
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                  : "border-border hover:border-primary/40",
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white group-hover:scale-110 transition-transform",
                  platform.color,
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>

              <div className="flex flex-col items-center">
                <span className="font-bold text-foreground text-sm">{platform.name}</span>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider mt-1 transition-colors",
                    isConnected ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {isConnected
                    ? t(ONBOARDING_KEYS.platforms.connected)
                    : t(ONBOARDING_KEYS.platforms.connect)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedCount > 0 && (
        <p
          className="mt-8 text-center text-sm text-muted-foreground animate-in fade-in"
          role="status"
          aria-live="polite"
        >
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
