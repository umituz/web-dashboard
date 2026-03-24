/**
 * Billing Layout Component
 *
 * Layout wrapper for billing pages
 */

import { BrandLogo } from "../../layouts/components";
import type { BillingLayoutProps } from "../types/billing";

export const BillingLayout = ({ config, children }: BillingLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrandLogo size={28} />
          <span className="font-bold text-xl text-foreground">{config.brandName}</span>
        </div>
        <a
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to Dashboard
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground">
            Manage your subscription, payment methods, and invoices
          </p>
        </div>

        {/* Children Content */}
        {children}
      </main>

      {/* Support Link */}
      {config.supportEmail && (
        <footer className="border-t border-border px-6 py-4">
          <div className="container max-w-6xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact{" "}
              <a
                href={`mailto:${config.supportEmail}`}
                className="text-primary hover:underline"
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
