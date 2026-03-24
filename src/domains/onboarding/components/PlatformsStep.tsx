import { cn } from "@umituz/web-design-system/utils";
import type { OnboardingState } from "../types/onboarding";

interface PlatformsStepProps {
  /** Current onboarding state */
  state: OnboardingState;
  /** Update state function */
  updateState: (updates: Partial<OnboardingState>) => void;
  /** Platform options */
  platforms?: Array<{
    id: string;
    name: string;
    icon: string;
    color?: string;
  }>;
}

/**
 * Platform Selection Step
 *
 * Third step - select social media platforms to connect
 */
export const PlatformsStep = ({
  state,
  updateState,
  platforms,
}: PlatformsStepProps) => {
  // Default platforms
  const defaultPlatforms = [
    { id: "instagram", name: "Instagram", icon: "📸", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
    { id: "twitter", name: "Twitter / X", icon: "🐦", color: "bg-black" },
    { id: "facebook", name: "Facebook", icon: "👍", color: "bg-blue-600" },
    { id: "linkedin", name: "LinkedIn", icon: "💼", color: "bg-blue-700" },
    { id: "tiktok", name: "TikTok", icon: "🎵", color: "bg-black" },
    { id: "youtube", name: "YouTube", icon: "📺", color: "bg-red-600" },
    { id: "pinterest", name: "Pinterest", icon: "📌", color: "bg-red-700" },
    { id: "threads", name: "Threads", icon: "🧵", color: "bg-black" },
  ];

  const platformOptions = platforms || defaultPlatforms;

  const togglePlatform = (id: string) => {
    const isConnected = state.connectedPlatforms.includes(id);
    updateState({
      connectedPlatforms: isConnected
        ? state.connectedPlatforms.filter((p) => p !== id)
        : [...state.connectedPlatforms, id],
    });
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          Connect your platforms
        </h1>
        <p className="text-muted-foreground">
          Select the platforms you want to manage - you can add more later
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {platformOptions.map((platform) => {
          const isConnected = state.connectedPlatforms.includes(platform.id);

          return (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={cn(
                "group bg-background border rounded-2xl p-6 flex flex-col items-center gap-4 transition-all hover:scale-[1.02]",
                isConnected ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/40"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-2xl group-hover:scale-110 transition-transform",
                  platform.color
                )}
              >
                {platform.icon}
              </div>

              <div className="flex flex-col items-center">
                <span className="font-bold text-foreground text-sm">{platform.name}</span>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider mt-1 transition-colors",
                    isConnected ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {isConnected ? "Connected" : "Connect"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {state.connectedPlatforms.length > 0 && (
        <p className="mt-8 text-center text-sm text-muted-foreground animate-in fade-in">
          ✨ {state.connectedPlatforms.length} platform{state.connectedPlatforms.length > 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
};

export default PlatformsStep;
