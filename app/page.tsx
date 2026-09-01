"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Spinner from "@/components/Spinner";

export default function RootPage() {
  const router = useRouter();
  const { isReady, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    router.replace(isAuthenticated ? "/home" : "/verify");
  }, [isReady, isAuthenticated, router]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <Spinner />
    </div>
  );
}
