"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock } from "lucide-react";
import AuthGate from "@/components/AuthGate";
import PageHeader from "@/components/PageHeader";
import SlotCard from "@/components/SlotCard";
import EmptyState from "@/components/EmptyState";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/lib/auth-context";
import { bookSlot, getAvailableSlots, ApiError } from "@/lib/api";
import type { Slot } from "@/lib/types";

function SlotsContent() {
  const { token } = useAuth();
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [bookingId, setBookingId] = useState<Slot["id"] | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    getAvailableSlots(token)
      .then(setSlots)
      .catch(() => setError("Couldn't load slots. Pull to refresh."));
  }, [token]);

  useEffect(load, [load]);

  async function handleBook(id: Slot["id"]) {
    if (!token) return;
    setBookingId(id);
    try {
      const updated = await bookSlot(token, id);
      setSlots((prev) =>
        (prev ?? []).map((s) => (s.id === id ? { ...s, ...updated, status: "booked" } : s))
      );
      setToast("Slot booked");
      setTimeout(() => setToast(null), 2200);
    } catch (err) {
      setToast(err instanceof ApiError ? err.message : "Couldn't book that slot");
      setTimeout(() => setToast(null), 2600);
    } finally {
      setBookingId(null);
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Availability" title="Book a slot" />

      <div className="px-5 pt-4">
        {slots === null ? (
          <div className="flex justify-center py-14">
            <Spinner />
          </div>
        ) : error ? (
          <p className="py-6 text-center text-sm text-ember-600">{error}</p>
        ) : slots.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No open slots right now"
            description="Check back later — new slots open up as they're released."
          />
        ) : (
          <div className="space-y-2.5 pb-4">
            {slots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                onBook={handleBook}
                booking={bookingId === slot.id}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit rounded-full bg-ink px-4 py-2.5 text-sm text-white shadow-soft"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SlotsPage() {
  return (
    <AuthGate>
      <SlotsContent />
    </AuthGate>
  );
}
