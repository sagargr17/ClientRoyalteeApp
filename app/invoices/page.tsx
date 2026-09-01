"use client";

import { useEffect, useState } from "react";
import { Receipt } from "lucide-react";
import AuthGate from "@/components/AuthGate";
import PageHeader from "@/components/PageHeader";
import InvoiceCard from "@/components/InvoiceCard";
import EmptyState from "@/components/EmptyState";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/lib/auth-context";
import { getMyInvoices } from "@/lib/api";
import type { Invoice } from "@/lib/types";

function InvoicesContent() {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);

  useEffect(() => {
    if (!token) return;
    getMyInvoices(token)
      .then(setInvoices)
      .catch(() => setInvoices([]));
  }, [token]);

  return (
    <div>
      <PageHeader eyebrow={invoices ? `${invoices.length} total` : undefined} title="History" />

      <div className="px-5 pt-4">
        {invoices === null ? (
          <div className="flex justify-center py-14">
            <Spinner />
          </div>
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No invoices yet"
            description="Your invoices will appear here after your first visit."
          />
        ) : (
          <div className="space-y-2.5 pb-4">
            {invoices.map((inv) => (
              <InvoiceCard key={inv.id} invoice={inv} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <AuthGate>
      <InvoicesContent />
    </AuthGate>
  );
}
