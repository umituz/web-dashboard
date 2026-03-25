/**
 * Billing Portal Component
 *
 * Main billing portal with tabs
 */

import { CreditCard, FileText, BarChart3, Settings, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import { Button } from "@umituz/web-design-system/atoms";
import type { BillingPortalProps } from "../types/billing";
import { UsageCard } from "./UsageCard";
import { PaymentMethodsList } from "./PaymentMethodsList";
import { InvoiceCard } from "./InvoiceCard";
import { getDaysRemaining, getStatusColor, getStatusLabel, formatPrice, getPlanPrice } from "../utils/billing";

export const BillingPortal = ({
  billing,
  loading = false,
  error,
  showTabs = true,
  activeTab = "overview",
  onTabChange,
}: BillingPortalProps) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "payment-methods", label: "Payment Methods", icon: CreditCard },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "plan", label: "Plan", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24 gap-4 text-destructive">
        <AlertCircle className="h-6 w-6" />
        <p>{error}</p>
      </div>
    );
  }

  if (!billing) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Current Subscription */}
            <div className="p-6 rounded-xl border border-border bg-background">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Current Subscription
              </h3>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {billing.subscription.plan.name}
                  </p>
                  <p className={cn("text-sm font-medium", getStatusColor(billing.subscription.status))}>
                    {getStatusLabel(billing.subscription.status)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatPrice(
                      getPlanPrice(billing.subscription.plan, billing.subscription.cycle),
                      billing.subscription.plan.currency
                    )}
                    /{billing.subscription.cycle}
                  </p>
                </div>
                <div className="text-right">
                  {billing.subscription.status === "trialing" && billing.subscription.trialEnd && (
                    <p className="text-sm text-muted-foreground">
                      {getDaysRemaining(billing.subscription.trialEnd)} days left in trial
                    </p>
                  )}
                  {billing.upcomingInvoice && (
                    <p className="text-sm text-muted-foreground">
                      Next billing:{" "}
                      {new Date(billing.upcomingInvoice.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Usage Metrics */}
            {billing.usage.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {billing.usage.map((metric) => (
                  <UsageCard key={metric.id} metric={metric} />
                ))}
              </div>
            )}

            {/* Upcoming Invoice */}
            {billing.upcomingInvoice && (
              <div className="p-6 rounded-xl border border-border bg-background">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Upcoming Invoice
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {formatPrice(billing.upcomingInvoice.amount, billing.upcomingInvoice.currency)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due {new Date(billing.upcomingInvoice.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "payment-methods":
        return (
          <PaymentMethodsList
            paymentMethods={billing.paymentMethods}
            onAddNew={() => console.log("Add payment method")}
            onSetDefault={(id) => console.log("Set default:", id)}
            onRemove={(id) => console.log("Remove:", id)}
          />
        );

      case "invoices":
        return (
          <div className="space-y-4">
            {billing.recentInvoices.length > 0 ? (
              billing.recentInvoices.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  onClick={(inv) => console.log("View invoice:", inv)}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No invoices yet</p>
              </div>
            )}
          </div>
        );

      case "plan":
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Plan management coming soon...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      {showTabs && (
        <div className="border-b border-border mb-6">
          <div className="flex gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={cn(
                    "flex items-center gap-2 pb-4 border-b-2 transition-colors",
                    activeTab === tab.id
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default BillingPortal;
