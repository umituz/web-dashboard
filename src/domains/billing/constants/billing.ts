/**
 * Billing Constants
 *
 * Centralized constants for billing domain to avoid hardcoded strings
 */

/**
 * Subscription status constants
 */
export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  TRIALING: "trialing",
  PAST_DUE: "past_due",
  CANCELED: "canceled",
  UNPAID: "unpaid",
  INCOMPLETE: "incomplete",
  REVOKED: "revoked",
} as const;

export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];

/**
 * Invoice status constants
 */
export const INVOICE_STATUS = {
  DRAFT: "draft",
  OPEN: "open",
  PAID: "paid",
  VOID: "void",
  UNCOLLECTIBLE: "uncollectible",
  REFUNDED: "refunded",
} as const;

export type InvoiceStatus = typeof INVOICE_STATUS[keyof typeof INVOICE_STATUS];

/**
 * Billing cycle constants
 */
export const BILLING_CYCLE = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const;

export type BillingCycle = typeof BILLING_CYCLE[keyof typeof BILLING_CYCLE];

/**
 * Currency constants
 */
export const CURRENCY = {
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  TRY: "TRY",
  JPY: "JPY",
} as const;

export type Currency = typeof CURRENCY[keyof typeof CURRENCY];

/**
 * Plan type constants
 */
export const PLAN_TYPE = {
  STANDARD: "standard",
  PRO: "pro",
  BUSINESS: "business",
  ENTERPRISE: "enterprise",
} as const;

export type PlanType = typeof PLAN_TYPE[keyof typeof PLAN_TYPE];
