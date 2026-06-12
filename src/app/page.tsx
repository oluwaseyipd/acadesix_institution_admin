"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function HomePage() {
  const router = useRouter();
  const { hydrate } = useAppStore();

  useEffect(() => {
    // Hydrate store from localStorage first
    hydrate();

    // Check credentials and redirect immediately
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const cachedUserStr = typeof window !== "undefined" ? localStorage.getItem("admin_user") : null;

    if (token && cachedUserStr) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  }, [hydrate, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground animate-pulse font-sans">Redirecting...</p>
      </div>
    </div>
  );
}