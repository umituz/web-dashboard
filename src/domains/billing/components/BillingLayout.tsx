/**
 * Billing Layout
 *
 * Page wrapper for the billing domain. All copy is i18n-keyed;
 * brand name and dashboard route come from config (no hardcoded strings).
 */

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BrandLogo } from "../../layouts/components";
import type { BillingLayoutProps } from "../types/billing";
import { BILLING_KEYS } from "../utils/i18nKeys";

/**
 * Default brand logo size used across billing pages. Centralized so
 * one tweak keeps every page visually consistent.
 */
const BRAND_LOGO_SIZE = 32;

export const BillingLayout = ({ config, children }: BillingLayoutProps) => {
  const { t } = useTranslation();
  const dashboardRoute = config.cancelRoute ?? "/dashboard";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          to={dashboardRoute}
          className="flex items-center gap-2"
          aria-label={config.brandName}
        >
          <BrandLogo size={BRAND_LOGO_SIZE} />
          <span className="font-bold text-xl text-foreground">{config.brandName}</span>
        </Link>
        <Link
          to={dashboardRoute}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t(BILLING_KEYS.page.backToDashboard)}
        </Link>
      </header>

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t(BILLING_KEYS.page.title)}
          </h1>
          <p className="text-muted-foreground">
            {t(BILLING_KEYS.page.description)}
          </p>
        </div>

        {children}
      </main>

      {config.supportEmail && (
        <footer className="border-t border-border px-4 sm:px-6 py-4">
          <div className="container max-w-6xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              {t(BILLING_KEYS.page.needHelp)}{' '}
              <a
                href={`mailto:${config.supportEmail}`}
                className="text-primary hover:underline"
                aria-label={t(BILLING_KEYS.page.contactAria, { email: config.supportEmail })}
              >
                {config.supportEmail}
              </a>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default BillingLayout;
