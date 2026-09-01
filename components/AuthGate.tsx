"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Spinner from "./Spinner";
import BottomNav from "./BottomNav";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isReady, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) router.replace("/verify");
  }, [isReady, isAuthenticated, router]);

  if (!isReady || !isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 pb-4">{children}</div>
      <BottomNav />
    </div>
  );
}
