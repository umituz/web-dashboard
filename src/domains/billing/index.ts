/**
 * Billing Domain
 *
 * Main entry point for billing domain
 */

// Components
export {
  PlanComparison,
  PaymentMethodsList,
  InvoiceCard,
  UsageCard,
  BillingPortal,
  BillingLayout,
  BillingPage,
} from "./components";

// Hooks
export {
  useBilling,
  createStubBillingApiClient,
} from "./hooks";
export type {
  BillingApiClient,
  UseBillingOptions,
  UseBillingReturn,
} from "./hooks";

// Utils
export {
  formatPrice,
  calculateDiscount,
  calculateProratedAmount,
  getPlanPrice,
  calculateUsagePercentage,
  isNearLimit,
  getStatusColor,
  getStatusLabel,
  getInvoiceStatusColor,
  getInvoiceStatusLabel,
  formatCardNumber,
  formatExpiry,
  getDaysRemaining,
  isTrialExpiringSoon,
  getNextBillingDate,
  groupInvoicesByStatus,
  calculateInvoiceTotal,
  sortInvoicesByDate,
  formatFeature,
  isPopularPlan,
  getTrialDaysText,
  transformPolarProductToPlan,
  transformPolarProducts,
  getStatusLabelKey,
  getInvoiceStatusLabelKey,
  BILLING_KEYS,
} from "./utils";

// Types
export type {
  BillingCycle,
  SubscriptionStatus,
  PlanType,
  Currency,
  PlanTier,
  Subscription,
  PaymentMethodType,
  PaymentMethod,
  PaymentMethodInput,
  InvoiceStatus,
  InvoiceItem,
  Invoice,
  UsageMetric,
  BillingSummary,
  PlanComparisonProps,
  PaymentMethodsListProps,
  InvoiceCardProps,
  UsageCardProps,
  BillingPortalProps,
  BillingTabId,
  BillingLayoutProps,
  BillingConfig,
  BillingPageProps,
} from "./types";

// Constants
export { DEFAULT_BILLING_CONFIG, CURRENCY } from "./constants/billing";
