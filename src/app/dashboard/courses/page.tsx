"use client";

import React, { useEffect, useState } from "react";
import { useInstitutionData } from "@/hooks/useInstitutionData";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { BookOpen, Plus, FolderPlus, Upload, UserPlus } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function ScopedCoursesPage() {
  const { getScopedCourses, getScopedDepartments, getScopedUsers } = useInstitutionData();
  const [courses, setCourses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    department: "",
    lecturer: "",
    level: "100",
    lecturer_remark: "",
  });

  const loadCoursesAndFormOptions = async () => {
    setLoading(true);
    try {
      const courseList = await getScopedCourses();
      const deptList = await getScopedDepartments();
      const userList = await getScopedUsers();
      
      setCourses(courseList);
      setDepartments(deptList);
      setLecturers(userList.filter((u: any) => u.role === "lecturer"));
    } catch (err) {
      console.error("Error loading courses:", err);
      toast.error("Failed to load course registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoursesAndFormOptions();
  }, [getScopedCourses, getScopedDepartments, getScopedUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.code || !formData.department) {
      toast.warning("Title, Code, and Department are required.");
      return;
    }

    try {
      const payload = {
        ...formData,
        lecturer: formData.lecturer || null,
      };
      await apiClient.post(API_ENDPOINTS.ADMIN.COURSES, payload);
      toast.success("New course successfully added to the catalog.");
      setShowAddModal(false);
      setFormData({
        title: "",
        code: "",
        description: "",
        department: "",
        lecturer: "",
        level: "100",
        lecturer_remark: "",
      });
      loadCoursesAndFormOptions();
    } catch (err: any) {
      console.error("Error creating course:", err);
      const msg = err.response?.data?.code?.[0] || "Failed to create new course.";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Courses & Curricula
          </h1>
          <p className="text-muted-foreground text-sm">
            Catalog editor: Create/edit courses, manage syllabus materials, and enroll students.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-primary/95 transition-all"
        >
          <Plus className="h-5 w-5" />
          Add Course
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-card border border-border h-48 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border p-16 rounded-2xl text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-bold text-foreground">No Courses Configured</h3>
          <p className="text-muted-foreground text-sm max-w-sm mt-1">
            Get started by adding your institution's initial course catalog.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow hover:bg-primary/95 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-card border border-border p-6 shadow-card rounded-2xl flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-card-hover transition-all"
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {course.code}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {course.level} Level
                  </span>
                </div>
                <h3 className="mt-3 font-bold text-lg text-foreground leading-snug">{course.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>{course.enrollment_count || 0} enrolled</span>
                <span>{course.material_count || 0} materials</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-card border border-border max-w-lg w-full rounded-2xl shadow-card overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Add New Course</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                Close
              </button>
            </div>
            
            <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    required
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g. CS101"
                    className="block w-full rounded-xl border border-border py-2 px-3 bg-white text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="block w-full rounded-xl border border-border py-2 px-3 bg-white text-sm outline-none focus:border-primary"
                  >
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Introduction to Programming"
                  className="block w-full rounded-xl border border-border py-2 px-3 bg-white text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Department *
                </label>
                <select
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border border-border py-2 px-3 bg-white text-sm outline-none focus:border-primary"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Assigned Lecturer
                </label>
                <select
                  name="lecturer"
                  value={formData.lecturer}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border border-border py-2 px-3 bg-white text-sm outline-none focus:border-primary"
                >
                  <option value="">Unassigned</option>
                  {lecturers.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.first_name} {l.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide details about the syllabus..."
                  className="block w-full rounded-xl border border-border py-2 px-3 bg-white text-sm outline-none focus:border-primary"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-border rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold shadow-glow hover:bg-primary/95 transition-all"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
