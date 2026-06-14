import { create } from "zustand";

export interface AuthUser {
  id: string;
  email: string;
  role: "student" | "lecturer" | "admin";
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  university?: {
    id: string;
    name: string;
    code: string | null;
  } | null;
  profile?: {
    first_name?: string;
    last_name?: string;
    identification_number?: string;
    level?: string;
    department?: string | number | null;
    department_name?: string | null;
    faculty?: string | null;
    university?: string | null;
    avatar?: string | null;
    avatar_url?: string | null;
  } | null;
}

interface AppState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  hydrate: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => {
    set({ user });
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("admin_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("admin_user");
      }
    }
  },
  hydrate: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_user");
      if (stored) {
        try {
          set({ user: JSON.parse(stored) });
        } catch {
          localStorage.removeItem("admin_user");
        }
      }
    }
  },
}));
