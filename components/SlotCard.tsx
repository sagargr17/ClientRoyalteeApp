"use client";

import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { formatDate, formatTime } from "@/lib/format";
import type { Slot } from "@/lib/types";

export default function SlotCard({
  slot,
  onBook,
  booking,
}: {
  slot: Slot;
  onBook: (id: Slot["id"]) => void;
  booking: boolean;
}) {
  const isBooked = slot.status === "booked";
  const isFull = slot.status === "full";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between rounded-card border border-line px-4 py-3.5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-col items-center justify-center rounded-stub bg-cloud text-ink">
          <Clock size={16} className="text-ember-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink">
            {slot.label ?? formatDate(slot.starts_at)}
          </p>
          <p className="text-xs text-clay">
            {formatDate(slot.starts_at)} · {formatTime(slot.starts_at)}
            {slot.spots_left !== undefined && !isBooked && !isFull
              ? ` · ${slot.spots_left} left`
              : ""}
          </p>
        </div>
      </div>

      {isBooked ? (
        <span className="flex items-center gap-1 rounded-full bg-moss/10 px-3 py-1.5 text-xs font-medium text-moss">
          <Check size={13} /> Booked
        </span>
      ) : isFull ? (
        <span className="rounded-full bg-cloud px-3 py-1.5 text-xs font-medium text-clay">
          Full
        </span>
      ) : (
        <button
          onClick={() => onBook(slot.id)}
          disabled={booking}
          className="rounded-full bg-ember-500 px-3.5 py-1.5 text-xs font-semibold text-white transition-transform active:scale-90 disabled:opacity-50"
        >
          {booking ? "Booking…" : "Book"}
        </button>
      )}
    </motion.div>
  );
}
