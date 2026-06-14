"use client";

import React, { useEffect, useState } from "react";
import { useInstitutionData } from "@/hooks/useInstitutionData";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { Users, ShieldAlert, CheckCircle, XCircle, UserCheck } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function ScopedUsersPage() {
  const { getScopedUsers } = useInstitutionData();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"student" | "lecturer">("student");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getScopedUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users:", err);
      toast.error("Failed to load institution users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [getScopedUsers]);

  const toggleUserStatus = async (userId: string, isCurrentlyActive: boolean) => {
    const action = isCurrentlyActive ? "deactivate" : "activate";
    try {
      await apiClient.post(`${API_ENDPOINTS.ADMIN.USERS}${userId}/${action}/`);
      toast.success(`User successfully ${isCurrentlyActive ? "deactivated" : "activated"}.`);
      loadUsers();
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      toast.error(`Failed to ${action} user.`);
    }
  };

  const promoteToStaff = async (userId: string) => {
    try {
      await apiClient.post(`${API_ENDPOINTS.ADMIN.USERS}${userId}/promote_to_staff/`);
      toast.success("User promoted to administrative staff status.");
      loadUsers();
    } catch (err) {
      console.error("Error promoting user:", err);
      toast.error("Failed to promote user.");
    }
  };

  const filteredUsers = users.filter((u) => u.role === activeTab);

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />
      
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Lecturers & Students
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage profiles and account access permissions for your institutional members.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("student")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "student"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Students ({users.filter((u) => u.role === "student").length})
        </button>
        <button
          onClick={() => setActiveTab("lecturer")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "lecturer"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Lecturers ({users.filter((u) => u.role === "lecturer").length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-card border border-border h-16 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border p-16 rounded-2xl text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-bold text-foreground">No Users Found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mt-1">
            There are currently no {activeTab === "student" ? "students" : "lecturers"} registered in this university.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden bg-card border border-border shadow-card rounded-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                {filteredUsers.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                    <td className="px-6 py-4 font-semibold">
                      {item.first_name} {item.last_name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{item.email}</td>
                    <td className="px-6 py-4">
                      {item.is_active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950/20 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-400">
                          <XCircle className="h-3 w-3" />
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <button
                        onClick={() => toggleUserStatus(item.id, item.is_active)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          item.is_active
                            ? "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400"
                        }`}
                      >
                        {item.is_active ? "Suspend" : "Activate"}
                      </button>

                      {!item.is_staff && activeTab === "lecturer" && (
                        <button
                          onClick={() => promoteToStaff(item.id)}
                          className="flex items-center gap-1 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <UserCheck className="h-3 w-3" />
                          Elevate to Staff
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
