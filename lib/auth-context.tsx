"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { verifyPin } from "./api";
import type { Customer, StoredSession } from "./types";

const STORAGE_KEY = "royalty.customer.session";

interface AuthContextValue {
  customer: Customer | null;
  token: string | null;
  expiresAt: number | null;
  isReady: boolean;
  isAuthenticated: boolean;
  secondsLeft: number;
  verify: (customerCode: string, accessPin: string) => Promise<void>;
  logout: (reason?: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.token || !parsed?.expiresAt) return null;
    if (parsed.expiresAt <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<StoredSession | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    setSession(readSession());
    setIsReady(true);
  }, []);

  const logout = useCallback(
    (_reason?: string) => {
      window.localStorage.removeItem(STORAGE_KEY);
      setSession(null);
      router.replace("/verify");
    },
    [router]
  );

  useEffect(() => {
    if (!session) {
      setSecondsLeft(0);
      return;
    }
    const tick = () => {
      const left = Math.max(0, Math.round((session.expiresAt - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0) logout("expired");
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [session, logout]);

  const verify = useCallback(async (customerCode: string, accessPin: string) => {
    const res = await verifyPin(customerCode, accessPin);
    const expiresAt = Date.now() + res.expires_in * 1000;
    const next: StoredSession = {
      token: res.token,
      customer: res.customer,
      expiresAt,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      customer: session?.customer ?? null,
      token: session?.token ?? null,
      expiresAt: session?.expiresAt ?? null,
      isReady,
      isAuthenticated: !!session,
      secondsLeft,
      verify,
      logout,
    }),
    [session, isReady, secondsLeft, verify, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
