/**
 * Invoice Card Component
 *
 * Display invoice information
 */

import { FileText, Download, ExternalLink } from "lucide-react";
import { cn } from "@umituz/web-design-system/utils";
import { Button } from "@umituz/web-design-system/atoms";
import type { InvoiceCardProps } from "../types/billing";
import { formatPrice, getInvoiceStatusColor, getInvoiceStatusLabel } from "../utils/billing";

export const InvoiceCard = ({
  invoice,
  compact = false,
  onClick,
}: InvoiceCardProps) => {
  const handleClick = () => {
    onClick?.(invoice);
  };

  if (compact) {
    return (
      <div
        onClick={handleClick}
        className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 bg-background cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">
              {invoice.number}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(invoice.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-bold text-foreground">
            {formatPrice(invoice.amount, invoice.currency)}
          </p>
          <p className={cn("text-xs font-medium", getInvoiceStatusColor(invoice.status))}>
            {getInvoiceStatusLabel(invoice.status)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="p-6 rounded-xl border border-border hover:border-primary/50 bg-background cursor-pointer transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-bold text-foreground">{invoice.number}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(invoice.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">
            {formatPrice(invoice.amount, invoice.currency)}
          </p>
          <p className={cn("text-sm font-medium", getInvoiceStatusColor(invoice.status))}>
            {getInvoiceStatusLabel(invoice.status)}
          </p>
        </div>
      </div>

      {/* Items Preview */}
      {invoice.items && invoice.items.length > 0 && (
        <div className="space-y-2 mb-4">
          {invoice.items.slice(0, 2).map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.description}</span>
              <span className="text-foreground">
                {formatPrice(item.amount, invoice.currency)}
              </span>
            </div>
          ))}
          {invoice.items.length > 2 && (
            <p className="text-xs text-muted-foreground">
              +{invoice.items.length - 2} more items
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Due {new Date(invoice.dueDate).toLocaleDateString()}
        </p>

        <div className="flex items-center gap-2">
          {invoice.invoiceUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(invoice.invoiceUrl, "_blank");
              }}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
          {invoice.pdfUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(invoice.pdfUrl, "_blank");
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
