/**
 * Polar.sh Integration Helpers
 *
 * Utility functions to transform Polar.sh data to billing types
 *
 * Note: These utilities require @umituz/web-polar-payment to be installed
 */

import type { PlanTier } from "../types/billing";

// Polar types - will be resolved if package is installed
type PolarProduct = {
  id: string;
  name: string;
  description: string | null;
  is_archived: boolean;
  prices: PolarPrice[];
  benefits: Array<{ description: string | null }>;
};

type PolarPrice = {
  amount?: number;
  currency: string;
  recurring_interval?: string;
  is_archived: boolean;
};

/**
 * Transform Polar product to billing plan format
 */
export function transformPolarProductToPlan(
  product: PolarProduct,
  price: PolarPrice
): PlanTier {
  const amount = price.amount || 0;
  const monthlyAmount = price.recurring_interval === "month" ? amount : amount / 12;

  return {
    id: product.id,
    name: product.name,
    description: product.description || "",
    monthlyPrice: Math.round(monthlyAmount),
    yearlyPrice: Math.round(amount),
    currency: price.currency.toUpperCase() as PlanTier["currency"],
    features: product.benefits
      .map((b: { description: string | null }) => b.description || "")
      .filter(Boolean),
  };
}

/**
 * Transform multiple Polar products to billing plans
 */
export function transformPolarProducts(products: PolarProduct[]): PlanTier[] {
  return products
    .filter((product) => !product.is_archived)
    .flatMap((product) => {
      const activePrices = product.prices.filter((p: PolarPrice) => !p.is_archived);
      return activePrices.map((price: PolarPrice) =>
        transformPolarProductToPlan(product, price)
      );
    });
}
