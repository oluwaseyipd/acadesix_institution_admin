"use client";

import React, { useEffect, useState } from "react";
import { useInstitutionData } from "@/hooks/useInstitutionData";
import { useAppStore } from "@/store/useAppStore";
import {
  Users,
  UserCheck,
  School,
  Building2,
  BookOpen,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const { user } = useAppStore();
  const { getScopedUsers, getScopedFaculties, getScopedDepartments, getScopedCourses } = useInstitutionData();

  const [metrics, setMetrics] = useState({
    students: 0,
    lecturers: 0,
    faculties: 0,
    departments: 0,
    courses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const users = await getScopedUsers();
        const faculties = await getScopedFaculties();
        const departments = await getScopedDepartments();
        const courses = await getScopedCourses();

        const students = users.filter((u: any) => u.role === "student").length;
        const lecturers = users.filter((u: any) => u.role === "lecturer").length;

        setMetrics({
          students,
          lecturers,
          faculties: faculties.length,
          departments: departments.length,
          courses: courses.length,
        });
      } catch (err) {
        console.error("Error loading dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [getScopedUsers, getScopedFaculties, getScopedDepartments, getScopedCourses]);

  const cards = [
    { name: "Total Students", value: metrics.students, icon: Users, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400" },
    { name: "Total Lecturers", value: metrics.lecturers, icon: UserCheck, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400" },
    { name: "Faculties", value: metrics.faculties, icon: School, color: "text-violet-600 bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400" },
    { name: "Departments", value: metrics.departments, icon: Building2, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400" },
    { name: "Courses Offered", value: metrics.courses, icon: BookOpen, color: "text-pink-600 bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-primary p-8 text-white shadow-glow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome, {user?.first_name || "Admin"}
          </h1>
          <p className="mt-2 text-primary-foreground/90 max-w-xl text-sm">
            Manage course configurations, coordinate enrollments, and check operational stats for{" "}
            <span className="font-semibold text-white">{user?.university?.name}</span>.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
          <TrendingUp className="h-5 w-5" />
          Active Operations
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className="bg-white dark:bg-card border border-border p-6 shadow-card rounded-2xl relative overflow-hidden transition-all hover:translate-y-[-2px] hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{card.name}</span>
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                {loading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded-md"></div>
                ) : (
                  <span className="text-3xl font-bold tracking-tight text-foreground">{card.value}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick shortcuts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white dark:bg-card border border-border p-6 shadow-card rounded-2xl space-y-4">
          <h2 className="text-lg font-bold text-foreground">Operational Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Complete high priority setups and audits for your campus.
          </p>
          <div className="divide-y divide-border text-sm">
            <Link
              href="/dashboard/users"
              className="flex items-center justify-between py-3 hover:text-primary transition-colors"
            >
              <span>Verify elevated lecturer permissions</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/courses"
              className="flex items-center justify-between py-3 hover:text-primary transition-colors"
            >
              <span>Upload course syllabi and attachments</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/faculties"
              className="flex items-center justify-between py-3 hover:text-primary transition-colors"
            >
              <span>Add new departments or change associations</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-card border border-border p-6 shadow-card rounded-2xl flex flex-col justify-center gap-4">
          <h2 className="text-lg font-bold text-foreground">Campus Portal Scope</h2>
          <div className="rounded-xl border border-border bg-zinc-50/50 dark:bg-zinc-900/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">University Name:</span>
              <span className="font-semibold text-foreground">{user?.university?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">University Code:</span>
              <span className="font-semibold text-foreground">{user?.university?.code || "N/A"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Scope Access:</span>
              <span className="font-semibold text-primary">Institution Administration Only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
