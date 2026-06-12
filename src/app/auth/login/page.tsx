"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, Mail, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error: authError, getGoogleAuthUrl } = useAuth();
  const { user, hydrate } = useAppStore();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (user && user.role === "admin" && user.university) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.email || !formData.password) {
      setLocalError("Please fill in all fields.");
      return;
    }

    const { success, error } = await login(formData);
    if (!success && error) {
      setLocalError(error);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setLocalError(null);
    try {
      await getGoogleAuthUrl();
    } catch {
      setLocalError("Failed to initiate Google login.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center bg-gradient-hero px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-up">
        <div className="flex justify-center items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-glow">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gradient">
            Acadexis
          </span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-foreground">
          Institution Admin
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Access your institution curriculum, courses, and member registries
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-up" style={{ animationDelay: "100ms" }}>
        <div className="bg-white/80 dark:bg-card/80 backdrop-blur-md px-8 py-10 shadow-card rounded-2xl border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {(localError || authError) && (
              <div className="flex items-center gap-3 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive-foreground">
                <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
                <p>{localError || authError}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-foreground"
              >
                Institutional Email
              </label>
              <div className="mt-2 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@university.edu"
                  className="block w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-foreground shadow-sm ring-1 ring-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold leading-6 text-foreground"
                >
                  Password
                </label>
              </div>
              <div className="mt-2 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-foreground shadow-sm ring-1 ring-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || isGoogleLoading}
                className="flex w-full justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold leading-6 text-white shadow-glow hover:bg-primary/95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in to Dashboard"
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <span className="absolute w-full h-[1px] bg-border" />
              <span className="relative bg-white dark:bg-card px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Or
              </span>
            </div>

            {/* Google Login Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white dark:bg-card px-4 py-3.5 text-sm font-semibold text-foreground shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none"
              >
                {isGoogleLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Redirecting...
                  </div>
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
