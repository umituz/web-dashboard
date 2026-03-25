/**
 * BillingPage Component
 *
 * Complete billing page for displaying subscription, invoices, and plan management
 * Data fetching should be handled by passing billing summary
 *
 * @example
 * ```tsx
 * <BillingPage
 *   billing={billingData}
 *   loading={false}
 *   activeTab="overview"
 *   onTabChange={(tab) => setActiveTab(tab)}
 * />
 * ```
 */

import { BillingLayout, BillingPortal } from ".";
import type { BillingPortalProps } from "../types/billing";

export interface BillingPageProps extends Omit<BillingPortalProps, "showTabs"> {
  /** Billing configuration */
  config?: {
    brandName?: string;
    supportEmail?: string;
  };
}

/**
 * BillingPage Component
 *
 * Ready-to-use billing page component
 * Combine BillingLayout with BillingPortal
 */
export const BillingPage = ({ config, ...portalProps }: BillingPageProps) => {
  const billingConfig = {
    brandName: config?.brandName || "Growth Factory",
    supportEmail: config?.supportEmail,
    plans: [],
  };

  return (
    <BillingLayout config={billingConfig}>
      <BillingPortal showTabs={true} {...portalProps} />
    </BillingLayout>
  );
};

export default BillingPage;
