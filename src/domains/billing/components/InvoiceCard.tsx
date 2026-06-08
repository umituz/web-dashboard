/**
 * Invoice Card
 *
 * Renders an invoice summary with optional compact/full view and
 * keyboard-accessible actions. External links use `rel="noopener noreferrer"`
 * to prevent tabnabbing.
 */

import { FileText, Download, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@umituz/web-design-system/utils";
import { Button } from "@umituz/web-design-system/atoms";
import type { InvoiceCardProps, Invoice } from "../types/billing";
import {
  formatPrice,
  getInvoiceStatusColor,
  getInvoiceStatusLabel,
} from "../utils/billing";
import { BILLING_KEYS } from "../utils/i18nKeys";

const LOCALE = 'en-US';

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

/**
 * Open an external URL in a new tab with safe rel attributes.
 */
const openExternal = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export const InvoiceCard = ({
  invoice,
  compact = false,
  onClick,
  onDownload,
}: InvoiceCardProps) => {
  const { t } = useTranslation();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(invoice);
    }
  };

  if (compact) {
    return (
      <div
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={onClick ? `Invoice ${invoice.number}` : undefined}
        onClick={onClick ? () => onClick(invoice) : undefined}
        onKeyDown={onClick ? handleKeyDown : undefined}
        className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">{invoice.number}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(invoice.date).toLocaleDateString(LOCALE)}
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
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Invoice ${invoice.number}` : undefined}
      onClick={onClick ? () => onClick(invoice) : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      className="p-6 rounded-xl border border-border hover:border-primary/50 bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
            <FileText className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-foreground">{invoice.number}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(invoice.date).toLocaleDateString(LOCALE, DATE_FORMAT_OPTIONS)}
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

      {invoice.items && invoice.items.length > 0 && (
        <div className="space-y-2 mb-4">
          {invoice.items.slice(0, 2).map((item, index) => (
            <div key={`${item.description}-${index}`} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.description}</span>
              <span className="text-foreground">
                {formatPrice(item.amount, invoice.currency)}
              </span>
            </div>
          ))}
          {invoice.items.length > 2 && (
            <p className="text-xs text-muted-foreground">
              +{invoice.items.length - 2} {t(BILLING_KEYS.invoice.moreItems)}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {t(BILLING_KEYS.invoice.due)}{' '}
          {new Date(invoice.dueDate).toLocaleDateString(LOCALE)}
        </p>

        <div className="flex items-center gap-2">
          {invoice.invoiceUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openExternal(invoice.invoiceUrl!);
              }}
              aria-label={t(BILLING_KEYS.invoice.viewInvoice)}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
          {invoice.pdfUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (onDownload) {
                  onDownload(invoice);
                } else {
                  openExternal(invoice.pdfUrl!);
                }
              }}
              aria-label={t(BILLING_KEYS.invoice.downloadPdf)}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;

/**
 * Re-export for type-safe callback in parent components.
 */
export type { Invoice };
