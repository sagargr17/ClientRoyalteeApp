"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarClock, Grid2x2, Receipt, ArrowRight } from "lucide-react";
import AuthGate from "@/components/AuthGate";
import PageHeader from "@/components/PageHeader";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/lib/auth-context";
import { getMyInvoices, getAvailableSlots } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/format";
import type { Invoice, Slot } from "@/lib/types";

function HomeContent() {
  const { customer, token } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);

  useEffect(() => {
    if (!token) return;
    getMyInvoices(token)
      .then(setInvoices)
      .catch(() => setInvoices([]));
    getAvailableSlots(token)
      .then(setSlots)
      .catch(() => setSlots([]));
  }, [token]);

  const nextSlot = slots?.find((s) => s.status === "booked");
  const openInvoices = invoices?.filter((i) => i.status !== "paid").length ?? 0;

  const tiles = [
    { href: "/slots", label: "Book a slot", icon: CalendarClock },
    { href: "/items", label: "View Items", icon: Grid2x2 },
    { href: "/invoices", label: "My history", icon: Receipt },
  ];

  return (
    <div>
      <PageHeader eyebrow="Welcome back" title={customer?.name ?? "Your account"} />

      <section className="px-5 pt-4">
        <div className="rounded-card bg-ink px-5 py-5 text-white">
          <p className="text-xs text-white/60">Next booking</p>
          {slots === null ? (
            <div className="mt-3">
              <Spinner size={18} />
            </div>
          ) : nextSlot ? (
            <div className="mt-1">
              <p className="font-display text-lg font-semibold">
                {nextSlot.label ?? "Reserved slot"}
              </p>
              <p className="mt-0.5 text-sm text-white/70">
                {formatDate(nextSlot.starts_at)} · {formatTime(nextSlot.starts_at)}
              </p>
            </div>
          ) : (
            <div className="mt-1">
              <p className="font-display text-lg font-semibold">Nothing booked yet</p>
              <Link
                href="/slots"
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-ember-300"
              >
                Find an open slot <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3 px-5 pt-5">
        {tiles.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-2 rounded-card border border-line bg-paper px-2 py-4 text-center transition-transform active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ember-50 text-ember-500">
              <Icon size={18} strokeWidth={1.75} />
            </div>
            <span className="text-xs font-medium text-ink">{label}</span>
          </Link>
        ))}
      </section>

      <section className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <p className="font-display text-base font-semibold">Recent activity</p>
          <Link href="/invoices" className="text-sm text-ember-500">
            See all
          </Link>
        </div>

        <div className="mt-3 space-y-2">
          {invoices === null ? (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          ) : invoices.length === 0 ? (
            <p className="rounded-card border border-dashed border-line px-4 py-6 text-center text-sm text-clay">
              No invoices yet — they&rsquo;ll show up here after your first visit.
            </p>
          ) : (
            invoices.slice(0, 3).map((inv, idx) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between rounded-card border border-line px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{inv.invoice_number}</p>
                  <p className="text-xs text-clay">{formatDate(inv.issued_at)}</p>
                </div>
                {openInvoices > 0 && inv.status !== "paid" && (
                  <span className="rounded-full bg-ember-50 px-2.5 py-1 text-xs font-medium text-ember-600">
                    {inv.status}
                  </span>
                )}
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthGate>
      <HomeContent />
    </AuthGate>
  );
}
