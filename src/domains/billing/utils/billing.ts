/**
 * Billing Utilities
 *
 * Helper functions for billing operations
 */

import type {
  BillingCycle,
  Currency,
  PlanTier,
  Subscription,
  PaymentMethod,
  Invoice,
  InvoiceStatus,
  UsageMetric,
} from "../types/billing";

/**
 * Format price with currency
 *
 * @param amount - Amount to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted price string
 */
export function formatPrice(amount: number, currency: Currency = "USD"): string {
  const localeMap: Record<Currency, string> = {
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    TRY: "tr-TR",
    JPY: "ja-JP",
  };

  return new Intl.NumberFormat(localeMap[currency], {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Calculate yearly discount
 *
 * @param monthlyPrice - Monthly price
 * @param yearlyPrice - Yearly price
 * @returns Discount percentage
 */
export function calculateDiscount(monthlyPrice: number, yearlyPrice: number): number {
  const yearlyMonthly = yearlyPrice / 12;
  const discount = ((monthlyPrice - yearlyMonthly) / monthlyPrice) * 100;
  return Math.round(discount);
}

/**
 * Calculate prorated amount
 *
 * @param amount - Full amount
 * @param daysUsed - Days used in period
 * @param totalDays - Total days in period
 * @returns Prorated amount
 */
export function calculateProratedAmount(
  amount: number,
  daysUsed: number,
  totalDays: number
): number {
  if (totalDays === 0) return 0;
  return (amount / totalDays) * daysUsed;
}

/**
 * Get plan price by cycle
 *
 * @param plan - Plan tier
 * @param cycle - Billing cycle
 * @returns Price for cycle
 */
export function getPlanPrice(plan: PlanTier, cycle: BillingCycle): number {
  return cycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
}

/**
 * Calculate usage percentage
 *
 * @param metric - Usage metric
 * @returns Usage percentage (0-100)
 */
export function calculateUsagePercentage(metric: UsageMetric): number {
  if (metric.limit === 0) return 0;
  return Math.min((metric.current / metric.limit) * 100, 100);
}

/**
 * Check if usage is near limit
 *
 * @param metric - Usage metric
 * @param threshold - Warning threshold (default: 80)
 * @returns Whether near limit
 */
export function isNearLimit(metric: UsageMetric, threshold: number = 80): boolean {
  return calculateUsagePercentage(metric) >= threshold;
}

/**
 * Get subscription status color
 *
 * @param status - Subscription status
 * @returns Color class
 */
export function getStatusColor(status: SubscriptionStatus): string {
  const colorMap: Record<SubscriptionStatus, string> = {
    active: "text-green-600 dark:text-green-500",
    trialing: "text-blue-600 dark:text-blue-500",
    past_due: "text-orange-600 dark:text-orange-500",
    canceled: "text-gray-600 dark:text-gray-500",
    unpaid: "text-red-600 dark:text-red-500",
    incomplete: "text-yellow-600 dark:text-yellow-500",
  };

  return colorMap[status] || "text-gray-600";
}

/**
 * Get subscription status label
 *
 * @param status - Subscription status
 * @returns Human readable label
 */
export function getStatusLabel(status: SubscriptionStatus): string {
  const labelMap: Record<SubscriptionStatus, string> = {
    active: "Active",
    trialing: "Trial",
    past_due: "Past Due",
    canceled: "Canceled",
    unpaid: "Unpaid",
    incomplete: "Incomplete",
  };

  return labelMap[status] || status;
}

/**
 * Get invoice status color
 *
 * @param status - Invoice status
 * @returns Color class
 */
export function getInvoiceStatusColor(status: InvoiceStatus): string {
  const colorMap: Record<InvoiceStatus, string> = {
    draft: "text-gray-600 dark:text-gray-500",
    open: "text-orange-600 dark:text-orange-500",
    paid: "text-green-600 dark:text-green-500",
    void: "text-gray-600 dark:text-gray-500",
    uncollectible: "text-red-600 dark:text-red-500",
  };

  return colorMap[status] || "text-gray-600";
}

/**
 * Get invoice status label
 *
 * @param status - Invoice status
 * @returns Human readable label
 */
export function getInvoiceStatusLabel(status: InvoiceStatus): string {
  const labelMap: Record<InvoiceStatus, string> = {
    draft: "Draft",
    open: "Open",
    paid: "Paid",
    void: "Void",
    uncollectible: "Uncollectible",
  };

  return labelMap[status] || status;
}

/**
 * Format card number
 *
 * @param last4 - Last 4 digits
 * @param brand - Card brand
 * @returns Formatted card display
 */
export function formatCardNumber(last4: string, brand: string): string {
  return `${brand.toUpperCase()} •••• ${last4}`;
}

/**
 * Format expiry date
 *
 * @param month - Expiry month
 * @param year - Expiry year
 * @returns Formatted expiry (MM/YY)
 */
export function formatExpiry(month: number, year: number): string {
  return `${String(month).padStart(2, "0")}/${String(year).slice(-2)}`;
}

/**
 * Calculate remaining days
 *
 * @param endDate - End date string
 * @returns Days remaining
 */
export function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Check if trial is expiring soon
 *
 * @param trialEnd - Trial end date
 * @param daysThreshold - Days threshold (default: 7)
 * @returns Whether trial is expiring soon
 */
export function isTrialExpiringSoon(trialEnd: string, daysThreshold: number = 7): boolean {
  const daysRemaining = getDaysRemaining(trialEnd);
  return daysRemaining > 0 && daysRemaining <= daysThreshold;
}

/**
 * Calculate next billing date
 *
 * @param currentPeriodEnd - Current period end
 * @param cycle - Billing cycle
 * @returns Next billing date
 */
export function getNextBillingDate(
  currentPeriodEnd: string,
  cycle: BillingCycle
): Date {
  const nextDate = new Date(currentPeriodEnd);

  if (cycle === "monthly") {
    nextDate.setMonth(nextDate.getMonth() + 1);
  } else {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  }

  return nextDate;
}

/**
 * Group invoices by status
 *
 * @param invoices - Array of invoices
 * @returns Grouped invoices map
 */
export function groupInvoicesByStatus(
  invoices: Invoice[]
): Record<InvoiceStatus, Invoice[]> {
  const grouped: Record<string, Invoice[]> = {
    draft: [],
    open: [],
    paid: [],
    void: [],
    uncollectible: [],
  };

  invoices.forEach((invoice) => {
    if (grouped[invoice.status]) {
      grouped[invoice.status].push(invoice);
    }
  });

  return grouped as Record<InvoiceStatus, Invoice[]>;
}

/**
 * Calculate total invoice amount
 *
 * @param invoices - Array of invoices
 * @param status - Optional status filter
 * @returns Total amount
 */
export function calculateInvoiceTotal(
  invoices: Invoice[],
  status?: InvoiceStatus
): number {
  const filtered = status ? invoices.filter((inv) => inv.status === status) : invoices;
  return filtered.reduce((sum, inv) => sum + inv.amount, 0);
}

/**
 * Sort invoices by date
 *
 * @param invoices - Array of invoices
 * @param order - Sort order (default: desc)
 * @returns Sorted invoices
 */
export function sortInvoicesByDate(
  invoices: Invoice[],
  order: "asc" | "desc" = "desc"
): Invoice[] {
  return [...invoices].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return order === "asc" ? dateA - dateB : dateB - dateB;
  });
}

/**
 * Format feature list item
 *
 * @param feature - Feature item (string or object)
 * @returns Formatted feature
 */
export function formatFeature(
  feature: string | { text: string; bold?: boolean; included?: boolean }
): { text: string; bold?: boolean; included?: boolean } {
  if (typeof feature === "string") {
    return { text: feature, included: true };
  }
  return feature;
}

/**
 * Check if plan is popular
 *
 * @param plan - Plan tier
 * @param plans - All available plans
 * @returns Whether plan is popular (middle tier)
 */
export function isPopularPlan(plan: PlanTier, plans: PlanTier[]): boolean {
  const middleIndex = Math.floor(plans.length / 2);
  return plans[middleIndex]?.id === plan.id;
}

/**
 * Generate trial days text
 *
 * @param trialEnd - Trial end date
 * @returns Days remaining text
 */
export function getTrialDaysText(trialEnd: string): string {
  const days = getDaysRemaining(trialEnd);

  if (days === 0) return "Trial ends today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}
