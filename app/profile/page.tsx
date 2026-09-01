"use client";

import { LogOut, ShieldCheck } from "lucide-react";
import AuthGate from "@/components/AuthGate";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/lib/auth-context";
import { formatCountdown } from "@/lib/format";

function ProfileContent() {
  const { customer, secondsLeft, logout } = useAuth();

  return (
    <div>
      <PageHeader eyebrow="Your card" title="Account" />

      <div className="px-5 pt-4">
        <div className="rounded-card bg-ink px-5 py-6 text-white">
          <p className="text-xs uppercase tracking-wide text-white/50">Customer</p>
          <p className="mt-1 font-display text-xl font-semibold">
            {customer?.name ?? "—"}
          </p>
          <p className="mt-3 font-mono text-sm text-white/70">
            {customer?.customer_code ?? "—"}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-card border border-line px-4 py-3.5">
          <ShieldCheck size={18} className="shrink-0 text-ember-500" />
          <div>
            <p className="text-sm font-medium text-ink">Session active</p>
            <p className="text-xs text-clay">
              For your security, this pass expires {formatCountdown(secondsLeft)}{" "}
              after verifying — scan your card again anytime.
            </p>
          </div>
        </div>

        <button
          onClick={() => logout("manual")}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-card border border-line py-3.5 text-sm font-medium text-ink transition-transform active:scale-[0.98]"
        >
          <LogOut size={16} />
          End session
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGate>
      <ProfileContent />
    </AuthGate>
  );
}
