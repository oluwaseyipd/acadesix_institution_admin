"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function GoogleCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleGoogleCallback, error: authError } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setLocalError("No authorization code provided by Google.");
      return;
    }

    const exchangeCode = async () => {
      const { success, error } = await handleGoogleCallback(code);
      if (!success && error) {
        setLocalError(error);
      }
    };

    exchangeCode();
  }, [handleGoogleCallback, searchParams]);

  const displayError = localError || authError;

  return (
    <div className="w-full bg-white dark:bg-card border border-border rounded-2xl p-8 shadow-card flex flex-col items-center gap-4 animate-fade-in">
      {displayError ? (
        <>
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
            <AlertCircle className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-destructive-foreground text-center max-w-xs leading-relaxed">
            {displayError}
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="mt-4 px-6 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-sm font-semibold transition-all shadow-glow"
          >
            Back to Login
          </button>
        </>
      ) : (
        <>
          <div className="w-10 h-10 rounded-full border-3 border-primary/20 border-t-primary animate-spin mb-2" />
          <p className="text-sm font-semibold text-foreground">
            Verifying academic credentials...
          </p>
          <p className="text-xs text-muted-foreground">
            Securing your connection to the institution dashboard
          </p>
        </>
      )}
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
      <div className="w-full max-w-[400px] flex flex-col items-center text-center gap-6">
        <header className="flex flex-col items-center gap-3">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-primary flex items-center justify-center text-white shadow-glow">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gradient tracking-tight">
            Acadexis
          </h1>
        </header>

        <Suspense fallback={
          <div className="w-full bg-white dark:bg-card border border-border rounded-2xl p-8 shadow-card flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-3 border-primary/20 border-t-primary animate-spin mb-2" />
            <p className="text-sm font-semibold text-foreground">Loading callback handler...</p>
          </div>
        }>
          <GoogleCallbackHandler />
        </Suspense>
      </div>
    </main>
  );
}
