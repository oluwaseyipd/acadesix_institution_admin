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
      
      // If we didn't specify a faculty, we filter departments that belong to the university's faculties
      if (!facultyId) {
        const faculties = await getScopedFaculties();
        const facultyIds = faculties.map((f: any) => f.id);
        const results = data.results || data;
        return results.filter((d: any) => facultyIds.includes(d.faculty));
      }
      
      return data.results || data;
    } catch (err) {
      console.error("Error fetching scoped departments:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, getScopedFaculties]);

  const getScopedCourses = useCallback(async () => {
    if (!user?.university) return [];
    setLoading(true);
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.ADMIN.COURSES, {
        params: { page_size: 100 },
      });
      
      const departments = await getScopedDepartments();
      const deptIds = departments.map((d: any) => d.id);
      
      const results = data.results || data;
      return results.filter((c: any) => deptIds.includes(c.department));
    } catch (err) {
      console.error("Error fetching scoped courses:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, getScopedDepartments]);

  return {
    loading,
    getScopedUsers,
    getScopedFaculties,
    getScopedDepartments,
    getScopedCourses,
  };
};
