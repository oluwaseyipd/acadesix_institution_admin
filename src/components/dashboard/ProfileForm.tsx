"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { toast, Toaster } from "sonner";

export default function ProfileForm() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Fetch fresh user details from API on mount
  useEffect(() => {
    async function loadLatestDetails() {
      setIsLoadingDetails(true);
      try {
        await refreshUser();
      } catch (err) {
        console.error("Failed to fetch latest user details:", err);
        toast.error("Failed to fetch fresh user details from API. Displaying cached data.");
      } finally {
        setIsLoadingDetails(false);
      }
    }
    loadLatestDetails();
  }, [refreshUser]);

  // Keep form state in sync with loaded user state
  useEffect(() => {
    if (user) {
      setFormState({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const displayName = user ? `${user.first_name} ${user.last_name}`.trim() : "Admin";
  const displayInitials = useMemo(() => {
    if (user?.first_name) {
      const first = user.first_name[0] || "";
      const last = user.last_name ? user.last_name[0] : "";
      return (first + last).toUpperCase();
    }
    return user?.email ? user.email[0].toUpperCase() : "A";
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.firstName || !formState.lastName || !formState.email) {
      toast.warning("First Name, Last Name, and Email are required.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        first_name: formState.firstName,
        last_name: formState.lastName,
        email: formState.email,
      };

      await apiClient.patch(API_ENDPOINTS.AUTH.ME, payload);
      await refreshUser();

      toast.success("Profile details updated successfully.");
      setEditing(false);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      const msg = err.response?.data?.detail || "Failed to update profile details.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingDetails) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col gap-6 font-sans">
        <div className="bg-card flex flex-col rounded-2xl shadow-card overflow-hidden border border-border">
          {/* Banner Skeleton */}
          <div className="w-full h-32 bg-muted animate-pulse" />

          {/* Profile Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between px-8 pb-6 pt-2 gap-4 border-b border-border">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative -mt-16 z-10">
                <div className="rounded-full w-24 h-24 bg-muted animate-pulse border-4 border-card" />
              </div>
              <div className="space-y-2 pb-1">
                <div className="h-6 w-40 bg-muted animate-pulse rounded" />
                <div className="h-4 w-28 bg-muted animate-pulse rounded" />
              </div>
            </div>
            <div className="pb-1">
              <div className="h-10 w-28 bg-muted animate-pulse rounded-xl" />
            </div>
          </div>

          {/* Form Fields Skeleton */}
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="h-5 w-40 bg-muted animate-pulse rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-12 w-full bg-muted animate-pulse rounded-xl" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-12 w-full bg-muted animate-pulse rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 font-sans">
      <Toaster position="top-right" richColors />

      {/* Profile Card Container */}
      <div className="bg-card flex flex-col rounded-2xl shadow-card overflow-hidden border border-border animate-fade-in">
        {/* Banner Gradient */}
        <div className="w-full h-32 bg-gradient-to-r from-brand-background to-brand-muted shrink-0" />

        {/* Profile Info Overlay Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between px-8 pb-6 pt-2 gap-4 border-b border-border">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            {/* Avatar block */}
            <div className="relative -mt-16 z-10">
              <div className="relative rounded-full w-24 h-24 bg-brand-primary flex items-center justify-center border-4 border-card shadow-md">
                <span className="text-2xl font-bold text-white tracking-wide">
                  {displayInitials}
                </span>
              </div>
            </div>

            {/* Profile name and role */}
            <div className="pb-1">
              <h2 className="text-xl font-bold text-foreground leading-tight">
                {displayName}
              </h2>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                {user?.role === "admin" ? "Platform Admin" : "Institution Staff"}
              </p>
            </div>
          </div>

          <div className="pb-1">
            <button
              type="button"
              onClick={() => {
                if (editing && user) {
                  // Reset form details on Cancel
                  setFormState({
                    firstName: user.first_name || "",
                    lastName: user.last_name || "",
                    email: user.email || "",
                  });
                }
                setEditing((prev) => !prev);
              }}
              className="bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 cursor-pointer font-bold py-2 px-6 rounded-xl transition-all duration-150 text-sm border border-brand-primary/10 focus:outline-none"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-8 space-y-6">
          <h3 className="text-base font-bold text-foreground uppercase tracking-wider border-l-2 border-brand-primary pl-2.5">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                First Name
              </label>
              <input
                type="text"
                value={formState.firstName}
                disabled={!editing || isSaving}
                onChange={(e) => setFormState((prev) => ({ ...prev, firstName: e.target.value }))}
                placeholder="Jane"
                className={`w-full px-4 py-3 border border-border rounded-xl text-sm transition-all focus:outline-none ${
                  editing
                    ? "bg-background text-foreground focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Last Name
              </label>
              <input
                type="text"
                value={formState.lastName}
                disabled={!editing || isSaving}
                onChange={(e) => setFormState((prev) => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
                className={`w-full px-4 py-3 border border-border rounded-xl text-sm transition-all focus:outline-none ${
                  editing
                    ? "bg-background text-foreground focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <input
                type="email"
                value={formState.email}
                disabled={!editing || isSaving}
                onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="jane.doe@university.edu"
                className={`w-full px-4 py-3 border border-border rounded-xl text-sm transition-all focus:outline-none ${
                  editing
                    ? "bg-background text-foreground focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              />
            </div>
          </div>

          <h3 className="text-base font-bold text-foreground uppercase tracking-wider border-l-2 border-brand-primary pl-2.5 pt-4">
            Institutional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Active Institution
              </label>
              <input
                type="text"
                value={user?.university?.name || "N/A"}
                disabled
                className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Institution Code
              </label>
              <input
                type="text"
                value={user?.university?.code || "N/A"}
                disabled
                className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                System Scope Role
              </label>
              <input
                type="text"
                value={user?.is_superuser ? "Platform Superuser" : "Institution Admin Staff"}
                disabled
                className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          {editing && (
            <div className="pt-6 flex justify-end gap-3 border-t border-border mt-4">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => {
                  if (user) {
                    setFormState({
                      firstName: user.first_name || "",
                      lastName: user.last_name || "",
                      email: user.email || "",
                    });
                  }
                  setEditing(false);
                }}
                className="px-6 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-all duration-150 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-semibold shadow-glow hover:bg-brand-primary/95 transition-all duration-150 focus:outline-none"
              >
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
