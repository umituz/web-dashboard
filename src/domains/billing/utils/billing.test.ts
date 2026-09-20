/**
 * Tests for pure billing utility functions.
 */

import { describe, it, expect } from "vitest";
import type { Invoice, InvoiceStatus, UsageMetric } from "../types/billing";
import {
  calculateDiscount,
  calculateUsagePercentage,
  isNearLimit,
  groupInvoicesByStatus,
  calculateInvoiceTotal,
  sortInvoicesByDate,
  formatExpiry,
  getPlanPrice,
  getStatusLabelKey,
  getInvoiceStatusLabelKey,
} from "./billing";
import { BILLING_KEYS } from "./i18nKeys";

const makeInvoice = (id: string, status: InvoiceStatus, amount: number, date: string): Invoice =>
  ({
    id,
    number: `INV-${id}`,
    date,
    dueDate: date,
    amount,
    currency: "USD",
    status,
  }) as Invoice;

const makeMetric = (current: number, limit: number): UsageMetric =>
  ({
    id: "m1",
    name: "Posts",
    current,
    limit,
    unit: "posts",
  }) as UsageMetric;

describe("calculateDiscount", () => {
  it("returns 0 when the monthly price is 0", () => {
    expect(calculateDiscount(0, 100)).toBe(0);
  });

  it("returns 0 when yearly is not cheaper", () => {
    expect(calculateDiscount(10, 240)).toBe(0); // 240/12 = 20 > 10
  });

  it("computes the yearly discount percentage", () => {
    // yearly monthly equivalent = 96/12 = 8 → (12-8)/12 = 33%
    expect(calculateDiscount(12, 96)).toBe(33);
  });

  it("never returns a negative discount", () => {
    expect(calculateDiscount(10, 121)).toBe(0);
  });
});

describe("calculateUsagePercentage / isNearLimit", () => {
  it("returns 0 for an unlimited (limit 0) metric", () => {
    expect(calculateUsagePercentage(makeMetric(50, 0))).toBe(0);
    expect(isNearLimit(makeMetric(50, 0))).toBe(false);
  });

  it("clamps the percentage at 100", () => {
    expect(calculateUsagePercentage(makeMetric(150, 100))).toBe(100);
  });

  it("detects near-limit at the default 80% threshold", () => {
    expect(isNearLimit(makeMetric(79, 100))).toBe(false);
    expect(isNearLimit(makeMetric(80, 100))).toBe(true);
  });
});

describe("groupInvoicesByStatus", () => {
  it("always includes every status key, even when empty", () => {
    const grouped = groupInvoicesByStatus([]);
    const expectedKeys: InvoiceStatus[] = [
      "draft",
      "open",
      "paid",
      "void",
      "uncollectible",
      "refunded",
    ];
    expect(Object.keys(grouped).sort()).toEqual(expectedKeys.sort());
    expectedKeys.forEach((key) => expect(grouped[key]).toEqual([]));
  });

  it("groups invoices by status", () => {
    const grouped = groupInvoicesByStatus([
      makeInvoice("1", "paid", 10, "2026-01-01"),
      makeInvoice("2", "paid", 20, "2026-02-01"),
      makeInvoice("3", "refunded", 30, "2026-03-01"),
    ]);
    expect(grouped.paid).toHaveLength(2);
    expect(grouped.refunded).toHaveLength(1);
    expect(grouped.draft).toHaveLength(0);
  });
});

describe("calculateInvoiceTotal", () => {
  const invoices = [
    makeInvoice("1", "paid", 10, "2026-01-01"),
    makeInvoice("2", "open", 20, "2026-02-01"),
  ];

  it("sums all invoices without a filter", () => {
    expect(calculateInvoiceTotal(invoices)).toBe(30);
  });

  it("filters by status first", () => {
    expect(calculateInvoiceTotal(invoices, "paid")).toBe(10);
  });
});

describe("sortInvoicesByDate", () => {
  it("sorts descending by default", () => {
    const sorted = sortInvoicesByDate([
      makeInvoice("1", "paid", 10, "2026-01-01"),
      makeInvoice("2", "paid", 10, "2026-03-01"),
    ]);
    expect(sorted[0].id).toBe("2");
  });

  it("sorts ascending on request", () => {
    const sorted = sortInvoicesByDate(
      [
        makeInvoice("1", "paid", 10, "2026-01-01"),
        makeInvoice("2", "paid", 10, "2026-03-01"),
      ],
      "asc",
    );
    expect(sorted[0].id).toBe("1");
  });

  it("does not mutate the input array", () => {
    const input = [
      makeInvoice("1", "paid", 10, "2026-01-01"),
      makeInvoice("2", "paid", 10, "2026-03-01"),
    ];
    sortInvoicesByDate(input);
    expect(input[0].id).toBe("1");
  });
});

describe("formatExpiry", () => {
  it("formats as MM/YY with zero padding", () => {
    expect(formatExpiry(3, 2027)).toBe("03/27");
  });
});

describe("getPlanPrice", () => {
  const plan = { id: "p", name: "Pro", monthlyPrice: 10, yearlyPrice: 100, currency: "USD" } as Parameters<
    typeof getPlanPrice
  >[0];

  it("returns the monthly price on the monthly cycle", () => {
    expect(getPlanPrice(plan, "monthly")).toBe(10);
  });

  it("returns the yearly price on the yearly cycle", () => {
    expect(getPlanPrice(plan, "yearly")).toBe(100);
  });
});

describe("status label keys", () => {
  it("maps every subscription status to its i18n key", () => {
    expect(getStatusLabelKey("active")).toBe(BILLING_KEYS.status.active);
    expect(getStatusLabelKey("past_due")).toBe(BILLING_KEYS.status.pastDue);
    expect(getStatusLabelKey("revoked")).toBe(BILLING_KEYS.status.revoked);
  });

  it("maps every invoice status to its i18n key", () => {
    expect(getInvoiceStatusLabelKey("paid")).toBe(BILLING_KEYS.invoiceStatus.paid);
    expect(getInvoiceStatusLabelKey("refunded")).toBe(BILLING_KEYS.invoiceStatus.refunded);
  });
});
