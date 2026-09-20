/**
 * Auth Layout Component
 *
 * Configurable layout wrapper for authentication pages.
 * Strings stay localizable via the optional `translate` prop; when it
 * is not provided the embedded English fallbacks are rendered.
 */

import { BrandLogo } from "../../layouts/components";
import { cn } from "@umituz/web-design-system/utils";
import { AUTH_KEYS } from "../utils/i18nKeys";
import type { AuthLayoutProps, Translate } from "../types/auth";

/**
 * Embedded fallbacks used when no `translate` prop is supplied.
 * Keys mirror the AUTH_KEYS catalog so consumers can override
 * every string via their own i18n setup.
 */
const DEFAULT_STRINGS: Record<string, string> = {
  [AUTH_KEYS.layout.backToHome]: "Back to home",
  [AUTH_KEYS.layout.orContinueWith]: "Or continue with",
  [AUTH_KEYS.layout.allRightsReserved]: "All rights reserved.",
};

export const AuthLayout = ({
  config,
  translate,
  onSocialLogin,
  children,
}: AuthLayoutProps) => {
  const t: Translate = translate ?? ((key) => DEFAULT_STRINGS[key] ?? key);
  // Prefer an explicit home route; fall back to afterLoginRoute for backwards compatibility.
  const homeRoute = config.homeRoute ?? config.afterLoginRoute;
  const footerLinks = config.footerLinks ?? [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrandLogo size={32} />
          <span className="font-bold text-xl text-foreground">{config.brandName}</span>
        </div>

        {/* Additional Header Content */}
        {homeRoute && (
          <a
            href={homeRoute}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t(AUTH_KEYS.layout.backToHome)}
          </a>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-secondary/30">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-background border border-border rounded-2xl shadow-sm p-8">
            {/* Tagline */}
            {config.brandTagline && (
              <p className="text-center text-sm text-muted-foreground mb-6">
                {config.brandTagline}
              </p>
            )}

            {/* Children Content (Forms) */}
            {children}
          </div>

          {/* Social Login */}
          {config.showSocialLogin && config.socialProviders && config.socialProviders.length > 0 && (
            <div className="mt-6 space-y-4">
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-secondary/30 text-muted-foreground">
                    {t(AUTH_KEYS.layout.orContinueWith)}
                  </span>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {config.socialProviders.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    className={cn(
                      "flex items-center justify-center gap-2 px-4 py-3 rounded-lg border",
                      "bg-background hover:bg-muted transition-colors",
                      "text-sm font-medium text-foreground"
                    )}
                    onClick={() => onSocialLogin?.(provider.id)}
                  >
                    <span className="text-lg">{provider.icon}</span>
                    <span>{provider.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {config.brandName}. {t(AUTH_KEYS.layout.allRightsReserved)}
          </p>
          {footerLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
