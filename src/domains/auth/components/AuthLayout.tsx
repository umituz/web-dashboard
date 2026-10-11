/**
 * Auth Layout Component
 *
 * Configurable layout wrapper for authentication pages.
 * Strings stay localizable via the optional `translate` prop; when it
 * is not provided the embedded English fallbacks are rendered.
 * Styling is entirely `udb-auth*` classes from the package stylesheet.
 */

import { BrandLogo } from "../../layouts/components";
import { cn } from "../../../primitives";
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
    <div className="udb-root udb-auth">
      {/* Header */}
      <header className="udb-auth__header">
        <div className="udb-auth__brand">
          <BrandLogo size={32} />
          <span className="udb-auth__brand-name">{config.brandName}</span>
        </div>

        {/* Additional Header Content */}
        {homeRoute && (
          <a href={homeRoute} className="udb-auth__home-link">
            {t(AUTH_KEYS.layout.backToHome)}
          </a>
        )}
      </header>

      {/* Main Content */}
      <main className="udb-auth__main">
        <div className="udb-auth__column">
          {/* Card Container */}
          <div className="udb-auth__card">
            {/* Tagline */}
            {config.brandTagline && (
              <p className="udb-auth__tagline">
                {config.brandTagline}
              </p>
            )}

            {/* Children Content (Forms) */}
            {children}
          </div>

          {/* Social Login */}
          {config.showSocialLogin && config.socialProviders && config.socialProviders.length > 0 && (
            <div className="udb-auth__social">
              {/* Divider */}
              <div className="udb-divider-row">
                <span className="udb-divider-row__label">
                  {t(AUTH_KEYS.layout.orContinueWith)}
                </span>
              </div>

              {/* Social Buttons */}
              <div className="udb-social-grid">
                {config.socialProviders.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    className={cn("udb-social-btn")}
                    onClick={() => onSocialLogin?.(provider.id)}
                  >
                    <span className="udb-social-btn__icon">{provider.icon}</span>
                    <span>{provider.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="udb-auth__footer">
        <div className="udb-auth__footer-inner">
          <p>
            © {new Date().getFullYear()} {config.brandName}. {t(AUTH_KEYS.layout.allRightsReserved)}
          </p>
          {footerLinks.length > 0 && (
            <div className="udb-auth__footer-links">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="udb-auth__footer-link"
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
