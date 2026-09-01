"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ScanLine } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onResult: (code: string) => void;
}

/** Pulls a customer_code out of either a raw code or a /verify/?c=CODE URL */
function extractCode(raw: string): string {
  try {
    const url = new URL(raw);
    const c = url.searchParams.get("c");
    if (c) return c;
  } catch {
    // not a URL, fall through
  }
  return raw.trim();
}

export default function QrScannerModal({ open, onClose, onResult }: Props) {
  const regionId = "qr-scan-region";
  const scannerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled) return;
      const scanner = new Html5Qrcode(regionId);
      scannerRef.current = scanner;
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText: string) => {
            onResult(extractCode(decodedText));
          },
          () => {
            // ignore per-frame scan misses
          }
        );
      } catch {
        setError("Camera unavailable. You can type your card code instead.");
      }
    })();

    return () => {
      cancelled = true;
      const scanner = scannerRef.current;
      if (scanner) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {});
      }
    };
  }, [open, onResult]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-t-card bg-paper p-5 pb-8"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 font-display text-base font-semibold">
                <ScanLine size={18} className="text-ember-500" />
                Scan your card
              </p>
              <button
                onClick={onClose}
                aria-label="Close scanner"
                className="rounded-full p-1.5 text-clay hover:bg-cloud"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-card bg-ink">
              <div id={regionId} className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover" />
              <div className="pointer-events-none absolute inset-x-6 top-0 h-0.5 bg-ember-400 animate-scan-line" />
            </div>

            {error ? (
              <p className="mt-4 text-center text-sm text-ember-600">{error}</p>
            ) : (
              <p className="mt-4 text-center text-sm text-clay">
                Line up the QR code from your card inside the frame.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
