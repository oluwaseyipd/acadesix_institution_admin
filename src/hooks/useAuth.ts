import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiClient, setAuthToken, clearAuthToken } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { useAppStore, AuthUser } from "@/store/useAppStore";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const router = useRouter();
  const { user, setUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

      // Verify that the user has admin role or is an elevated lecturer AND is associated with a university
      const role = data?.user?.role;
      const isStaff = data?.user?.is_staff || data?.user?.is_superuser;
      const university = data?.user?.university;

      const hasAccess = role === "admin" || (role === "lecturer" && isStaff);

      if (!hasAccess) {
        throw new Error("You do not have institution admin permissions.");
      }

      if (!university) {
        throw new Error("This admin account is not assigned to any institution.");
      }

      // Store tokens
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
      }
      setAuthToken(data.access);

      // Store user in store and localStorage
      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        first_name: data.user.first_name || "",
        last_name: data.user.last_name || "",
        is_staff: data.user.is_staff || false,
        is_superuser: data.user.is_superuser || false,
        university: {
          id: university.id,
          name: university.name,
          code: university.code || null,
        },
      };

      setUser(authUser);

      // Redirect to dashboard
      router.push("/dashboard");

      return { success: true };
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.message ||
        "Login failed. Please check your credentials.";
      setError(errorMsg);
      clearAuthToken();
      setUser(null);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [router, setUser]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const refresh = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refresh });
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      clearAuthToken();
      setUser(null);
      setLoading(false);
      router.push("/auth/login");
    }
  }, [router, setUser]);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      
      const role = data.role;
      const isStaff = data.is_staff || data.is_superuser;
      const university = data.university;

      const hasAccess = role === "admin" || (role === "lecturer" && isStaff);

      if (hasAccess && university) {
        const authUser: AuthUser = {
          id: data.id,
          email: data.email,
          role: data.role,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          is_staff: data.is_staff || false,
          is_superuser: data.is_superuser || false,
          university: {
            id: university.id,
            name: university.name,
            code: university.code || null,
          },
        };
        setUser(authUser);
      } else {
        // Not authorized for this app, force logout
        clearAuthToken();
        setUser(null);
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  }, [setUser, router]);

  return { user, loading, error, login, logout, refreshUser };
};
