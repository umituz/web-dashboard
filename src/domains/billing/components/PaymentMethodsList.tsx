/**
 * Payment Methods List Component
 *
 * Display and manage payment methods
 */

import { CreditCard, Trash2, Check, Plus, Loader2 } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import { Button } from "@umituz/web-design-system/atoms";
import type { PaymentMethodsListProps } from "../types/billing";
import { formatCardNumber, formatExpiry } from "../utils/billing";

export const PaymentMethodsList = ({
  paymentMethods,
  loading = false,
  onSetDefault,
  onRemove,
  onAddNew,
}: PaymentMethodsListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-6">No payment methods yet</p>
        <Button onClick={onAddNew} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className={cn(
            "flex items-center justify-between p-4 rounded-xl border",
            method.isDefault
              ? "border-primary bg-primary/5"
              : "border-border bg-background"
          )}
        >
          <div className="flex items-center gap-4">
            {/* Card Icon */}
            <div className="w-12 h-8 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              {method.card && (
                <CreditCard className="h-5 w-5 text-white" />
              )}
            </div>

            {/* Card Details */}
            <div>
              <p className="font-medium text-foreground">
                {method.card && formatCardNumber(method.card.last4, method.card.brand)}
              </p>
              <p className="text-sm text-muted-foreground">
                Expires {method.card && formatExpiry(method.card.expiryMonth, method.card.expiryYear)}
              </p>
            </div>

            {/* Default Badge */}
            {method.isDefault && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full font-medium">
                Default
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!method.isDefault && onSetDefault && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSetDefault(method.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            {onRemove && paymentMethods.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(method.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}

      {/* Add New Button */}
      {onAddNew && (
        <Button onClick={onAddNew} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      )}
    </div>
  );
};

export default PaymentMethodsList;
