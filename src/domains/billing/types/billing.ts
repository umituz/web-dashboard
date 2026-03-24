/**
 * Billing Types
 *
 * Type definitions for billing and subscription system
 */

import type { ComponentType, ReactElement } from "react";
import { SUBSCRIPTION_STATUS, INVOICE_STATUS, BILLING_CYCLE, CURRENCY } from "../constants/billing";

/**
 * Billing cycle
 */
export type BillingCycle = typeof BILLING_CYCLE[keyof typeof BILLING_CYCLE];

/**
 * Subscription status
 */
export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];

/**
 * Invoice status
 */
export type InvoiceStatus = typeof INVOICE_STATUS[keyof typeof INVOICE_STATUS];

/**
 * Plan type
 */
export type PlanType = "free" | "basic" | "pro" | "enterprise" | "custom";

/**
 * Currency
 */
export type Currency = typeof CURRENCY[keyof typeof CURRENCY];

/**
 * Plan pricing tier
 */
export interface PlanTier {
  /** Plan ID */
  id: string;
  /** Plan type */
  type: PlanType;
  /** Plan name */
  name: string;
  /** Plan description */
  description: string;
  /** Badge text */
  badge?: string;
  /** Badge color */
  badgeColor?: string;
  /** Monthly price */
  monthlyPrice: number;
  /** Yearly price */
  yearlyPrice: number;
  /** Currency */
  currency: Currency;
  /** Features list */
  features: (string | { text: string; bold?: boolean; included?: boolean })[];
  /** Highlight/recommend */
  highlight?: boolean;
  /** Maximum users/seats */
  maxUsers?: number;
  /** Storage limit in GB */
  storageLimit?: number;
  /** API call limit */
  apiLimit?: number;
}

/**
 * Subscription info
 */
export interface Subscription {
  /** Subscription ID */
  id: string;
  /** Plan ID */
  planId: string;
  /** Plan details */
  plan: PlanTier;
  /** Subscription status */
  status: SubscriptionStatus;
  /** Billing cycle */
  cycle: BillingCycle;
  /** Current period start */
  currentPeriodStart: string;
  /** Current period end */
  currentPeriodEnd: string;
  /** Cancel at period end */
  cancelAtPeriodEnd?: boolean;
  /** Trial end date */
  trialEnd?: string;
  /** User/seat count */
  seats?: number;
}

/**
 * Payment method type
 */
export type PaymentMethodType = "card" | "bank_account" | "wallet";

/**
 * Payment method
 */
export interface PaymentMethod {
  /** Payment method ID */
  id: string;
  /** Type */
  type: PaymentMethodType;
  /** Is default */
  isDefault: boolean;
  /** Card details */
  card?: {
    /** Last 4 digits */
    last4: string;
    /** Brand (Visa, Mastercard) */
    brand: string;
    /** Expiry month */
    expiryMonth: number;
    /** Expiry year */
    expiryYear: number;
    /** Cardholder name */
    name?: string;
  };
  /** Bank account details */
  bankAccount?: {
    /** Last 4 digits */
    last4: string;
    /** Bank name */
    bankName: string;
    /** Account type */
    accountType?: "checking" | "savings";
  };
  /** Created date */
  createdAt: string;
}

/**
 * Invoice item
 */
export interface InvoiceItem {
  /** Item description */
  description: string;
  /** Quantity */
  quantity: number;
  /** Unit price */
  unitPrice: number;
  /** Amount */
  amount: number;
}

/**
 * Invoice
 */
export interface Invoice {
  /** Invoice ID */
  id: string;
  /** Invoice number */
  number: string;
  /** Amount */
  amount: number;
  /** Currency */
  currency: Currency;
  /** Status */
  status: InvoiceStatus;
  /** Invoice date */
  date: string;
  /** Due date */
  dueDate: string;
  /** Paid date */
  paidAt?: string;
  /** Invoice URL */
  invoiceUrl?: string;
  /** PDF download URL */
  pdfUrl?: string;
  /** Line items */
  items?: InvoiceItem[];
  /** Subtotal */
  subtotal?: number;
  /** Tax amount */
  tax?: number;
  /** Total amount */
  total?: number;
}

/**
 * Usage metric
 */
export interface UsageMetric {
  /** Metric ID */
  id: string;
  /** Metric name */
  name: string;
  /** Current usage */
  current: number;
  /** Limit */
  limit: number;
  /** Unit */
  unit: string;
  /** Reset period */
  resetPeriod: "daily" | "monthly" | "yearly";
  /** Reset date */
  resetAt?: string;
}

/**
 * Billing summary
 */
export interface BillingSummary {
  /** Current subscription */
  subscription: Subscription;
  /** Payment methods */
  paymentMethods: PaymentMethod[];
  /** Default payment method */
  defaultPaymentMethod?: PaymentMethod;
  /** Upcoming invoice */
  upcomingInvoice?: {
    amount: number;
    currency: Currency;
    date: string;
  };
  /** Usage metrics */
  usage: UsageMetric[];
  /** Recent invoices */
  recentInvoices: Invoice[];
}

/**
 * Plan comparison props
 */
export interface PlanComparisonProps {
  /** Available plans */
  plans: PlanTier[];
  /** Selected plan ID */
  selectedPlan?: string;
  /** Billing cycle */
  cycle: BillingCycle;
  /** Show yearly toggle */
  showCycleToggle?: boolean;
  /** Show features */
  showFeatures?: boolean;
  /** On plan select */
  onPlanSelect?: (planId: string) => void;
  /** On cycle change */
  onCycleChange?: (cycle: BillingCycle) => void;
  /** Loading state */
  loading?: boolean;
}

/**
 * Payment methods list props
 */
export interface PaymentMethodsListProps {
  /** Payment methods */
  paymentMethods: PaymentMethod[];
  /** Loading state */
  loading?: boolean;
  /** On set default */
  onSetDefault?: (methodId: string) => void;
  /** On remove */
  onRemove?: (methodId: string) => void;
  /** On add new */
  onAddNew?: () => void;
}

/**
 * Invoice card props
 */
export interface InvoiceCardProps {
  /** Invoice data */
  invoice: Invoice;
  /** Compact view */
  compact?: boolean;
  /** On click */
  onClick?: (invoice: Invoice) => void;
}

/**
 * Usage card props
 */
export interface UsageCardProps {
  /** Usage metric */
  metric: UsageMetric;
  /** Show progress bar */
  showProgress?: boolean;
  /** Show limit */
  showLimit?: boolean;
}

/**
 * Billing portal props
 */
export interface BillingPortalProps {
  /** Billing summary */
  billing: BillingSummary;
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string;
  /** Show tabs */
  showTabs?: boolean;
  /** Active tab */
  activeTab?: string;
  /** On tab change */
  onTabChange?: (tab: string) => void;
}

/**
 * Billing layout props
 */
export interface BillingLayoutProps {
  /** Billing configuration */
  config: BillingConfig;
  /** Children content */
  children?: React.ReactNode;
}

/**
 * Billing configuration
 */
export interface BillingConfig {
  /** Brand name */
  brandName: string;
  /** Available plans */
  plans: PlanTier[];
  /** Supported currencies */
  currencies?: Currency[];
  /** Default currency */
  defaultCurrency?: Currency;
  /** Enable yearly discounts */
  enableYearlyDiscount?: boolean;
  /** Yearly discount percentage */
  yearlyDiscount?: number;
  /** Tax rate */
  taxRate?: number;
  /** Support email */
  supportEmail?: string;
  /** Cancel subscription route */
  cancelRoute?: string;
  /** Update payment route */
  updatePaymentRoute?: string;
  /** Invoice history route */
  invoiceHistoryRoute?: string;
}
