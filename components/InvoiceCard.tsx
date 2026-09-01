import { formatDate, formatMoney } from "@/lib/format";
import type { Invoice } from "@/lib/types";

const STATUS_STYLE: Record<string, string> = {
  paid: "bg-moss/10 text-moss",
  pending: "bg-ember-50 text-ember-600",
  overdue: "bg-red-50 text-red-600",
};

export default function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const badge = STATUS_STYLE[invoice.status] ?? "bg-cloud text-clay";

  return (
    <div className="flex items-center justify-between rounded-card border border-line px-4 py-3.5">
      <div>
        <p className="text-sm font-medium text-ink">{invoice.invoice_number}</p>
        <p className="text-xs text-clay">{formatDate(invoice.issued_at)}</p>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm font-medium text-ink">
          {formatMoney(invoice.amount, invoice.currency)}
        </p>
        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${badge}`}>
          {invoice.status}
        </span>
      </div>
    </div>
  );
}
