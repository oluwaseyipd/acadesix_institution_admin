"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, Mail, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error: authError } = useAuth();
  const { user, hydrate } = useAppStore();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState<string | null>(null);

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
                disabled={loading}
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
          </form>
        </div>
      </div>
    </div>
  );
}
