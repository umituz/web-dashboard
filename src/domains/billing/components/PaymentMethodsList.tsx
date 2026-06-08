/**
 * Payment Methods List
 *
 * Manages saved payment methods with a11y semantics and
 * brand-specific card icon styling. Confirmation modal is
 * intentionally out of scope — the consumer provides onRemove
 * and is expected to handle the confirm step.
 */

import { useState } from "react";
import {
  CreditCard,
  Trash2,
  Check,
  Plus,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@umituz/web-design-system/utils";
import { Button } from "@umituz/web-design-system/atoms";
import type { PaymentMethod, PaymentMethodsListProps } from "../types/billing";
import { formatCardNumber, formatExpiry } from "../utils/billing";
import { BILLING_KEYS } from "../utils/i18nKeys";

/**
 * Map card brand → CSS gradient. Keeping it small + brand-accurate
 * rather than the previous one-gradient-fits-all hack.
 */
const BRAND_GRADIENT: Record<string, string> = {
  visa: "from-blue-700 to-blue-500",
  mastercard: "from-orange-500 to-red-500",
  amex: "from-cyan-700 to-cyan-500",
  discover: "from-amber-500 to-orange-500",
  default: "from-slate-700 to-slate-500",
};

const cardGradient = (brand: string | undefined): string => {
  if (!brand) return BRAND_GRADIENT.default;
  const key = brand.toLowerCase();
  return BRAND_GRADIENT[key] ?? BRAND_GRADIENT.default;
};

export const PaymentMethodsList = ({
  paymentMethods,
  loading = false,
  busyId,
  onSetDefault,
  onRemove,
  onAddNew,
}: PaymentMethodsListProps) => {
  const { t } = useTranslation();
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">{t(BILLING_KEYS.common.loading)}</span>
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard
          className="h-12 w-12 mx-auto text-muted-foreground mb-4"
          aria-hidden="true"
        />
        <p className="text-muted-foreground mb-6">
          {t(BILLING_KEYS.paymentMethods.none)}
        </p>
        {onAddNew && (
          <Button onClick={onAddNew} variant="outline">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            {t(BILLING_KEYS.paymentMethods.add)}
          </Button>
        )}
      </div>
    );
  }

  const requestRemove = (id: string) => setPendingRemove(id);
  const cancelRemove = () => setPendingRemove(null);
  const confirmRemove = (id: string) => {
    onRemove?.(id);
    setPendingRemove(null);
  };

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <PaymentMethodItem
          key={method.id}
          method={method}
          allMethods={paymentMethods}
          onRemove={onRemove}
          isBusy={busyId === method.id}
          pendingRemove={pendingRemove === method.id}
          onRequestRemove={requestRemove}
          onCancelRemove={cancelRemove}
          onConfirmRemove={confirmRemove}
          onSetDefault={onSetDefault}
        />
      ))}

      {onAddNew && (
        <Button onClick={onAddNew} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          {t(BILLING_KEYS.paymentMethods.add)}
        </Button>
      )}
    </div>
  );
};

interface PaymentMethodItemProps {
  method: PaymentMethod;
  allMethods: PaymentMethod[];
  onRemove?: (id: string) => void;
  isBusy: boolean;
  pendingRemove: boolean;
  onRequestRemove: (id: string) => void;
  onCancelRemove: () => void;
  onConfirmRemove: (id: string) => void;
  onSetDefault?: (id: string) => void;
}

const PaymentMethodItem = ({
  method,
  allMethods,
  onRemove,
  isBusy,
  pendingRemove,
  onRequestRemove,
  onCancelRemove,
  onConfirmRemove,
  onSetDefault,
}: PaymentMethodItemProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        method.isDefault ? "border-primary bg-primary/5" : "border-border bg-background",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={cn(
              "w-12 h-8 rounded bg-gradient-to-br flex items-center justify-center shrink-0",
              cardGradient(method.card?.brand),
            )}
          >
            {method.card && (
              <CreditCard className="h-5 w-5 text-white" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">
              {method.card
                ? formatCardNumber(method.card.last4, method.card.brand)
                : t(BILLING_KEYS.paymentMethods.bankAccount)}
            </p>
            <p className="text-sm text-muted-foreground">
              {method.card
                ? `${t(BILLING_KEYS.paymentMethods.expires)} ${formatExpiry(
                    method.card.expiryMonth,
                    method.card.expiryYear,
                  )}`
                : method.bankAccount
                ? `${method.bankAccount.bankName} •••• ${method.bankAccount.last4}`
                : null}
            </p>
          </div>
          {method.isDefault && (
            <span
              className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full font-medium shrink-0"
              aria-label={t(BILLING_KEYS.paymentMethods.default)}
            >
              {t(BILLING_KEYS.paymentMethods.default)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!method.isDefault && onSetDefault && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSetDefault(method.id)}
              disabled={isBusy}
              aria-label={t(BILLING_KEYS.paymentMethods.setDefault)}
            >
              <Check className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
          {onRemove && paymentMethodsAllowsRemove(method, allMethods) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRequestRemove(method.id)}
              disabled={isBusy}
              className="text-muted-foreground hover:text-destructive"
              aria-label={t(BILLING_KEYS.paymentMethods.remove)}
            >
              {isBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          )}
        </div>
      </div>

      {pendingRemove && (
        <div
          role="alert"
          className="mt-3 flex items-center justify-between gap-3 p-3 rounded-lg border border-destructive/30 bg-destructive/5"
        >
          <span className="flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t(BILLING_KEYS.paymentMethods.removeConfirm)}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onCancelRemove}>
              {t(BILLING_KEYS.paymentMethods.cancelRemove)}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onConfirmRemove(method.id)}
            >
              {t(BILLING_KEYS.paymentMethods.confirmRemove)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * A payment method is removable if there is at least one other method
 * left — a user must always have at least one valid payment method.
 */
const paymentMethodsAllowsRemove = (
  method: PaymentMethod,
  all: PaymentMethod[],
): boolean => all.length > 1 || !method.isDefault;
