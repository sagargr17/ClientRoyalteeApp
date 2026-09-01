"use client";

import { useAuth } from "@/lib/auth-context";
import { formatCountdown } from "@/lib/format";

export default function PageHeader({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}) {
  const { secondsLeft } = useAuth();
  const low = secondsLeft > 0 && secondsLeft <= 120;

  return (
    <header className="flex items-start justify-between px-5 pb-2 pt-6">
      <div>
        {eyebrow && <p className="text-sm text-clay">{eyebrow}</p>}
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          {title}
        </h1>
      </div>
      {secondsLeft > 0 && (
        <div
          className={`mt-1 rounded-full px-2.5 py-1 font-mono text-xs ${
            low ? "bg-ember-500 text-white" : "bg-cloud text-clay"
          }`}
          title="Time left in this session"
        >
          {formatCountdown(secondsLeft)}
        </div>
      )}
    </header>
  );
}
