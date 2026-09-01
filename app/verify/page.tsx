"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, ChevronLeft, CreditCard } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import PinKeypad from "@/components/PinKeypad";
import QrScannerModal from "@/components/QrScannerModal";
import Spinner from "@/components/Spinner";

function VerifyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { verify, isAuthenticated, isReady } = useAuth();

  const mockMode = process.env.NEXT_PUBLIC_MOCK_MODE === "true";


  const [step, setStep] = useState<"code" | "pin">("code");
  const [code, setCode] = useState(mockMode ? "CUST-A1B2C3" : "");

  console.log("code", code)
  const [pin, setPin] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const fromUrl = params.get("c");
    if (fromUrl) {
      setCode(fromUrl);
      setStep("pin");
    }
  }, [params]);

  useEffect(() => {
    if (isReady && isAuthenticated) router.replace("/home");
  }, [isReady, isAuthenticated, router]);

  useEffect(() => {
    if (pin.length === 4 && !submitting) {
      void handleSubmit(pin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  async function handleSubmit(finalPin: string) {
    setSubmitting(true);
    setError(null);
    try {
      await verify(code.trim(), finalPin);
      router.replace("/home");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.status === 401 || err.status === 400
            ? "That PIN doesn't match your card. Try again."
            : err.message
          : "Couldn't reach the server. Check your connection and try again.";
      setError(message);
      setPin("");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col px-6 pb-10 pt-10">
      <AnimatePresence mode="wait">
        {step === "code" ? (
          <motion.div
            key="code"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
            className="flex flex-1 flex-col"
          >
            <div className="mb-10">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-ember-50 text-ember-500">
                <CreditCard size={20} strokeWidth={1.75} />
              </div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">
                Bring up your card
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-clay">
                Scan the QR code on your card, or type the code printed
                underneath it.
              </p>
            </div>

            <button
              onClick={() => setScannerOpen(true)}
              className="mb-4 flex items-center justify-center gap-2 rounded-card bg-ember-500 py-4 font-display text-sm font-semibold text-white shadow-soft transition-transform active:scale-[0.98]"
            >
              <ScanLine size={18} />
              Scan QR code
            </button>

            <div className="my-2 flex items-center gap-3 text-xs text-clay">
              <span className="h-px flex-1 bg-line" />
              or enter it manually
              <span className="h-px flex-1 bg-line" />
            </div>

            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="CUST-A1B2C3"
              autoCapitalize="characters"
              className="mt-2 rounded-card border border-line bg-cloud px-4 py-3.5 font-mono text-sm tracking-wide text-ink placeholder:text-clay/70 focus:border-ember-400 focus:bg-paper focus:outline-none"
            />

            <button
              disabled={!code.trim()}
              onClick={() => setStep("pin")}
              className="mt-4 rounded-card border border-ink py-3.5 font-display text-sm font-semibold text-ink transition-opacity disabled:opacity-30"
            >
              Continue
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="pin"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
            className="flex flex-1 flex-col"
          >
            <button
              onClick={() => {
                setStep("code");
                setPin("");
                setError(null);
              }}
              className="mb-8 flex items-center gap-1 text-sm text-clay"
            >
              <ChevronLeft size={16} />
              Back
            </button>

            <div className="mb-10 text-center">
              <p className="text-sm text-clay">{code}</p>
              <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
                Enter your PIN
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-clay">
                The 4-digit PIN printed next to the QR code on your card.
              </p>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center">
              {submitting ? (
                <Spinner size={28} />
              ) : (
                <PinKeypad value={pin} onChange={setPin} shake={shake} />
              )}
            </div>

            {error && (
              <p className="mt-4 text-center text-sm text-ember-600">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <QrScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onResult={(scanned) => {
          setCode(scanned);
          setScannerOpen(false);
          setStep("pin");
        }}
      />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <VerifyInner />
    </Suspense>
  );
}
