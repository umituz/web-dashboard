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
} from "./components";

// Hooks
export {
  useBilling,
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
  BillingLayoutProps,
  BillingConfig,
} from "./types";
