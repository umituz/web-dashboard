/**
 * useBilling Hook
 *
 * Core billing hook for managing subscription and payments
 */

import { useState, useCallback, useEffect } from "react";
import type {
  BillingSummary,
  BillingCycle,
  PlanTier,
  PaymentMethod,
  Invoice,
  UsageMetric,
} from "../types/billing";
import { formatPrice } from "../utils/billing";

interface UseBillingOptions {
  /** Billing API base URL */
  apiUrl?: string;
  /** Initial billing data */
  initialData?: BillingSummary;
}

interface BillingActions {
  /** Load billing summary */
  loadBilling: () => Promise<void>;
  /** Update subscription plan */
  updatePlan: (planId: string) => Promise<void>;
  /** Cancel subscription */
  cancelSubscription: () => Promise<void>;
  /** Update billing cycle */
  updateCycle: (cycle: BillingCycle) => Promise<void>;
  /** Add payment method */
  addPaymentMethod: (paymentMethodDetails: any) => Promise<PaymentMethod>;
  /** Remove payment method */
  removePaymentMethod: (methodId: string) => Promise<void>;
  /** Set default payment method */
  setDefaultPaymentMethod: (methodId: string) => Promise<void>;
  /** Get invoice URL */
  getInvoiceUrl: (invoiceId: string) => Promise<string>;
}

/**
 * useBilling hook
 *
 * Manages billing state and actions
 *
 * @param options - Hook options
 * @returns Billing state and actions
 */
export function useBilling(options: UseBillingOptions = {}) {
  const { apiUrl = "/api/billing", initialData } = options;

  // State
  const [billing, setBilling] = useState<BillingSummary | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load billing summary
  const loadBilling = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, call your billing API
      // const response = await fetch(apiUrl);
      // const data = await response.json();

      // Mock data for demo
      const mockBilling: BillingSummary = {
        subscription: {
          id: "sub_123",
          planId: "pro",
          plan: {
            id: "pro",
            type: "pro",
            name: "Pro Plan",
            description: "For growing teams",
            monthlyPrice: 49,
            yearlyPrice: 490,
            currency: "USD",
            features: [
              "Up to 10 users",
              "100GB storage",
              "100K API calls/month",
              "Priority support",
            ],
          },
          status: "active",
          cycle: "monthly",
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          seats: 5,
        },
        paymentMethods: [
          {
            id: "pm_123",
            type: "card",
            isDefault: true,
            card: {
              last4: "4242",
              brand: "Visa",
              expiryMonth: 12,
              expiryYear: 2025,
              name: "John Doe",
            },
            createdAt: new Date().toISOString(),
          },
        ],
        defaultPaymentMethod: {
          id: "pm_123",
          type: "card",
          isDefault: true,
          card: {
            last4: "4242",
            brand: "Visa",
            expiryMonth: 12,
            expiryYear: 2025,
            name: "John Doe",
          },
          createdAt: new Date().toISOString(),
        },
        upcomingInvoice: {
          amount: 49,
          currency: "USD",
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        usage: [
          {
            id: "storage",
            name: "Storage",
            current: 67.5,
            limit: 100,
            unit: "GB",
            resetPeriod: "monthly",
            resetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "api",
            name: "API Calls",
            current: 75000,
            limit: 100000,
            unit: "calls",
            resetPeriod: "monthly",
            resetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        recentInvoices: [],
      };

      setBilling(mockBilling);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load billing";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  // Update subscription plan
  const updatePlan = useCallback(async (planId: string) => {
    if (!billing) return;

    setIsLoading(true);
    setError(null);

    try {
      // In production, call your billing API
      // await fetch(`${apiUrl}/subscription`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ planId }),
      // });

      // Mock update
      setBilling((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          subscription: {
            ...prev.subscription,
            planId,
          },
        };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update plan";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, billing]);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, call your billing API
      // await fetch(`${apiUrl}/subscription/cancel`, { method: 'POST' });

      // Mock cancel
      setBilling((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          subscription: {
            ...prev.subscription,
            status: "canceled",
            cancelAtPeriodEnd: true,
          },
        };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to cancel subscription";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  // Update billing cycle
  const updateCycle = useCallback(async (cycle: BillingCycle) => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, call your billing API
      // await fetch(`${apiUrl}/subscription/cycle`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ cycle }),
      // });

      // Mock update
      setBilling((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          subscription: {
            ...prev.subscription,
            cycle,
          },
        };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update cycle";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  // Add payment method
  const addPaymentMethod = useCallback(async (paymentMethodDetails: any) => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, call your billing API
      // const response = await fetch(`${apiUrl}/payment-methods`, {
      //   method: 'POST',
      //   body: JSON.stringify(paymentMethodDetails),
      // });
      // const newMethod = await response.json();

      // Mock add
      const newMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: "card",
        isDefault: false,
        card: paymentMethodDetails,
        createdAt: new Date().toISOString(),
      };

      setBilling((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          paymentMethods: [...prev.paymentMethods, newMethod],
        };
      });

      return newMethod;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add payment method";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  // Remove payment method
  const removePaymentMethod = useCallback(async (methodId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, call your billing API
      // await fetch(`${apiUrl}/payment-methods/${methodId}`, {
      //   method: 'DELETE',
      // });

      // Mock remove
      setBilling((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          paymentMethods: prev.paymentMethods.filter((pm) => pm.id !== methodId),
        };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove payment method";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  // Set default payment method
  const setDefaultPaymentMethod = useCallback(async (methodId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, call your billing API
      // await fetch(`${apiUrl}/payment-methods/${methodId}/default`, {
      //   method: 'PATCH',
      // });

      // Mock update
      setBilling((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          paymentMethods: prev.paymentMethods.map((pm) => ({
            ...pm,
            isDefault: pm.id === methodId,
          })),
          defaultPaymentMethod: prev.paymentMethods.find((pm) => pm.id === methodId),
        };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to set default payment method";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  // Get invoice URL
  const getInvoiceUrl = useCallback(async (invoiceId: string) => {
    // In production, call your billing API
    // const response = await fetch(`${apiUrl}/invoices/${invoiceId}`);
    // const data = await response.json();
    // return data.invoiceUrl;

    return `#invoice-${invoiceId}`;
  }, [apiUrl]);

  const actions: BillingActions = {
    loadBilling,
    updatePlan,
    cancelSubscription,
    updateCycle,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    getInvoiceUrl,
  };

  return {
    billing,
    isLoading,
    error,
    ...actions,
  };
}
