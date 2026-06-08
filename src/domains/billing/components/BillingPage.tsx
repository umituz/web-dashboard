/**
 * BillingPage
 *
 * Compose BillingLayout + BillingPortal. Brand name and support
 * contact are required — there's no silent "Growth Factory" fallback
 * that pretends everything is fine when the consumer forgets to
 * provide them.
 */

import { BillingLayout, BillingPortal } from ".";
import type {
  BillingConfig,
  BillingPortalProps,
} from "../types/billing";
import { DEFAULT_BILLING_CONFIG } from "../constants/billing";

export interface BillingPageProps extends Omit<BillingPortalProps, "showTabs"> {
  /** Billing configuration */
  config: BillingConfig;
}

export const BillingPage = ({ config, ...portalProps }: BillingPageProps) => {
  const mergedConfig: BillingConfig = {
    ...DEFAULT_BILLING_CONFIG,
    ...config,
  };

  return (
    <BillingLayout config={mergedConfig}>
      <BillingPortal showTabs {...portalProps} />
    </BillingLayout>
  );
};

export default BillingPage;
