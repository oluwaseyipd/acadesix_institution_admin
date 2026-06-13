import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { useAppStore } from "@/store/useAppStore";

export const useInstitutionData = () => {
  const { user } = useAppStore();
  const [loading, setLoading] = useState(false);

  const getScopedUsers = useCallback(async () => {
    if (!user?.university) return [];
    setLoading(true);
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.ADMIN.USERS, {
        params: { university: user.university.id, page_size: 100 },
      });
      return data.results || data;
    } catch (err) {
      console.error("Error fetching scoped users:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getScopedFaculties = useCallback(async () => {
    if (!user?.university) return [];
    setLoading(true);
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.ADMIN.FACULTIES, {
        params: { university: user.university.id, page_size: 100 },
      });
      return data.results || data;
    } catch (err) {
      console.error("Error fetching scoped faculties:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getScopedDepartments = useCallback(async (facultyId?: string) => {
    if (!user?.university) return [];
    setLoading(true);
    try {
      const params: any = { page_size: 100 };
      if (facultyId) {
        params.faculty = facultyId;
      }
      const { data } = await apiClient.get(API_ENDPOINTS.ADMIN.DEPARTMENTS, { params });
      return data.results || data;
    } catch (err) {
      console.error("Error fetching scoped departments:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getScopedCourses = useCallback(async () => {
    if (!user?.university) return [];
    setLoading(true);
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.ADMIN.COURSES, {
        params: { page_size: 100 },
      });
      return data.results || data;
    } catch (err) {
      console.error("Error fetching scoped courses:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    getScopedUsers,
    getScopedFaculties,
    getScopedDepartments,
    getScopedCourses,
  };
};
