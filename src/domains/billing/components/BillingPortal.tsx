/**
 * Billing Portal
 *
 * Main billing portal with tabs.
 * Uses proper a11y semantics (role=tablist, role=tab, aria-selected, aria-controls)
 * and delegates tab content to dedicated subcomponents.
 */

import { CreditCard, FileText, BarChart3, Settings, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@umituz/web-design-system/utils";
import type { BillingPortalProps, BillingTabId } from "../types/billing";
import { BILLING_KEYS } from "../utils/i18nKeys";
import { PaymentMethodsList } from "./PaymentMethodsList";
import { InvoiceCard } from "./InvoiceCard";
import { PlanTab } from "./PlanTab";
import { OverviewTab } from "./OverviewTab";

const TABS: ReadonlyArray<{ id: BillingTabId; labelKey: string; icon: typeof BarChart3 }> = [
  { id: "overview", labelKey: BILLING_KEYS.portal.tabs.overview, icon: BarChart3 },
  { id: "payment-methods", labelKey: BILLING_KEYS.portal.tabs.paymentMethods, icon: CreditCard },
  { id: "invoices", labelKey: BILLING_KEYS.portal.tabs.invoices, icon: FileText },
  { id: "plan", labelKey: BILLING_KEYS.portal.tabs.plan, icon: Settings },
];

const LOCALE = 'en-US';

export const BillingPortal = ({
  billing,
  loading = false,
  error,
  showTabs = true,
  activeTab = "overview",
  onTabChange,
  onAddPaymentMethod,
  onSetDefaultPaymentMethod,
  onRemovePaymentMethod,
  onViewInvoice,
  onChangePlan,
  onCancelSubscription,
}: BillingPortalProps) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-24"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">{t(BILLING_KEYS.common.loading)}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center py-24 gap-4 text-destructive"
        role="alert"
      >
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
        <p>{error}</p>
      </div>
    );
  }

  if (!billing) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab billing={billing} locale={LOCALE} />;
      case "payment-methods":
        return (
          <PaymentMethodsList
            paymentMethods={billing.paymentMethods}
            onAddNew={onAddPaymentMethod}
            onSetDefault={onSetDefaultPaymentMethod}
            onRemove={onRemovePaymentMethod}
          />
        );
      case "invoices":
        return <InvoiceList invoices={billing.recentInvoices} onView={onViewInvoice} locale={LOCALE} />;
      case "plan":
        return (
          <PlanTab
            subscription={billing.subscription}
            onChangePlan={onChangePlan}
            onCancelSubscription={onCancelSubscription}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {showTabs && (
        <div className="border-b border-border mb-6" role="tablist" aria-orientation="horizontal">
          <div className="flex gap-6">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`billing-tab-${tab.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls="billing-tab-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => onTabChange?.(tab.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                      e.preventDefault();
                      const idx = TABS.findIndex((tt) => tt.id === activeTab);
                      const nextIdx =
                        e.key === 'ArrowRight'
                          ? (idx + 1) % TABS.length
                          : (idx - 1 + TABS.length) % TABS.length;
                      onTabChange?.(TABS[nextIdx].id);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 pb-4 border-b-2 transition-colors",
                    isActive
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="font-medium">{t(tab.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div
        id="billing-tab-panel"
        role="tabpanel"
        aria-labelledby={`billing-tab-${activeTab}`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

/**
 * Invoices list — extracted inline so BillingPortal stays focused on layout.
 */
const InvoiceList = ({
  invoices,
  onView,
  locale,
}: {
  invoices: NonNullable<BillingPortalProps['billing']>['recentInvoices'];
  onView?: (invoice: NonNullable<BillingPortalProps['billing']>['recentInvoices'][number]) => void;
  locale: string;
}) => {
  const { t } = useTranslation();

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
        <p>{t(BILLING_KEYS.portal.invoices.empty)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} onClick={onView} locale={locale} />
      ))}
    </div>
  );
};

export default BillingPortal;
