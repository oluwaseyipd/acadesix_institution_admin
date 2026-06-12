const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

if (typeof window !== "undefined") {
  console.log("[API Configuration] Base URL is:", API_BASE_URL);
}

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login/",
    LOGOUT: "/api/auth/logout/",
    REFRESH: "/api/auth/token/refresh/",
    ME: "/api/auth/me/",
    GOOGLE_URL: "/api/auth/google/university/",
    GOOGLE_CALLBACK: "/api/auth/google/callback/",
  },
  ADMIN: {
    USERS: "/api/admin/users/",
    UNIVERSITIES: "/api/admin/universities/",
    FACULTIES: "/api/admin/faculties/",
    DEPARTMENTS: "/api/admin/departments/",
    COURSES: "/api/admin/courses/",
    ENROLLMENTS: "/api/admin/enrollments/",
    MATERIALS: "/api/admin/materials/",
    RATINGS: "/api/admin/ratings/",
    STUDY_SESSIONS: "/api/admin/study-sessions/",
  },
};
