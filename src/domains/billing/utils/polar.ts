/**
 * Polar.sh Integration Helpers
 *
 * Transform Polar.sh product/price shapes into the billing PlanTier format.
 * No `any`, no magic numbers, no implicit fallbacks that mask failures.
 */

import type { PlanTier } from "../types/billing";
import { CURRENCY, type Currency } from "../constants/billing";

/**
 * Number of months in a year — single source of truth for
 * monthly/yearly price conversions.
 */
const MONTHS_IN_YEAR = 12;

/**
 * Supported Polar price intervals. Anything else throws rather than
 * silently producing wrong amounts.
 */
const POLAR_INTERVALS = {
  month: 'month',
  year: 'year',
} as const;

/**
 * Subset of Polar product fields we actually consume.
 * Kept local so the package works whether or not
 * `@umituz/web-polar-payment` is installed.
 */
export interface PolarProduct {
  id: string;
  name: string;
  description: string | null;
  is_archived: boolean;
  prices: PolarPrice[];
  benefits: Array<{ description: string | null }>;
}

export interface PolarPrice {
  amount: number;
  currency: string;
  recurring_interval?: string;
  is_archived: boolean;
}

const KNOWN_CURRENCIES: ReadonlySet<string> = new Set(Object.values(CURRENCY));

/**
 * Convert a polar currency code to a typed Currency.
 * Throws on unknown codes so bad data fails loud instead of
 * producing a plan with an un-renderable currency.
 */
const toCurrency = (raw: string): Currency => {
  const upper = raw.toUpperCase();
  if (KNOWN_CURRENCIES.has(upper)) return upper as Currency;
  throw new Error(`Unsupported currency from Polar: ${raw}`);
};

/**
 * Convert a single Polar price to a normalized monthly amount.
 * Throws when the price has no recognized recurring interval.
 */
const toMonthlyAmount = (amount: number, interval: string | undefined): number => {
  if (interval === POLAR_INTERVALS.month) return amount;
  if (interval === POLAR_INTERVALS.year) return amount / MONTHS_IN_YEAR;
  throw new Error(
    `Cannot convert Polar price to monthly: unsupported interval "${interval ?? 'undefined'}"`,
  );
};

export function transformPolarProductToPlan(
  product: PolarProduct,
  price: PolarPrice,
): PlanTier {
  const monthlyAmount = toMonthlyAmount(price.amount, price.recurring_interval);
  const yearlyAmount = price.recurring_interval === POLAR_INTERVALS.year
    ? price.amount
    : price.amount * MONTHS_IN_YEAR;

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? '',
    monthlyPrice: Math.round(monthlyAmount),
    yearlyPrice: Math.round(yearlyAmount),
    currency: toCurrency(price.currency),
    features: product.benefits
      .map((benefit) => benefit.description ?? '')
      .filter((description) => description.length > 0),
  };
}

export function transformPolarProducts(products: PolarProduct[]): PlanTier[] {
  return products
    .filter((product) => !product.is_archived)
    .flatMap((product) =>
      product.prices
        .filter((price) => !price.is_archived)
        .map((price) => transformPolarProductToPlan(product, price)),
    );
}
