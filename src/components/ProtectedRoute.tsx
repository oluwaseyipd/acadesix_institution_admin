"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { user, hydrate } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to hydrate user state from local storage first
    hydrate();
    setLoading(false);
  }, [hydrate]);

  useEffect(() => {
    if (!loading) {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const cachedUserStr = typeof window !== "undefined" ? localStorage.getItem("admin_user") : null;

      if (!token || !cachedUserStr) {
        router.push("/auth/login");
        return;
      }

      try {
        const cachedUser = JSON.parse(cachedUserStr);
        const isStaff = cachedUser.is_staff || cachedUser.is_superuser;
        const hasAccess = cachedUser.role === "admin" || (cachedUser.role === "lecturer" && isStaff);

        if (!hasAccess || !cachedUser.university) {
          router.push("/auth/login");
        }
      } catch {
        router.push("/auth/login");
      }
    }
  }, [loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground animate-pulse">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
