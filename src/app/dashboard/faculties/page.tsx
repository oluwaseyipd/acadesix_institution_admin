"use client";

import React, { useEffect, useState } from "react";
import { useInstitutionData } from "@/hooks/useInstitutionData";
import { School, Building2, BookOpen, Layers } from "lucide-react";

export default function FacultiesDeptsPage() {
  const { getScopedFaculties, getScopedDepartments } = useInstitutionData();
  
  const [faculties, setFaculties] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHierarchy() {
      try {
        const facs = await getScopedFaculties();
        const depts = await getScopedDepartments();
        setFaculties(facs);
        setDepartments(depts);
      } catch (err) {
        console.error("Error loading academic structure:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHierarchy();
  }, [getScopedFaculties, getScopedDepartments]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Faculties & Departments
        </h1>
        <p className="text-muted-foreground text-sm">
          Overview of the academic organizational structure of your institution.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-card border border-border p-6 rounded-2xl h-48 animate-pulse space-y-4">
              <div className="h-6 w-1/3 bg-muted rounded"></div>
              <div className="h-4 w-2/3 bg-muted rounded"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      ) : faculties.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border p-16 rounded-2xl text-center">
          <School className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-bold text-foreground">No Faculties Created</h3>
          <p className="text-muted-foreground text-sm max-w-sm mt-1">
            There are currently no faculties configured for your university. Please contact a platform superadmin to set up your primary faculties.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {faculties.map((faculty) => {
            const facultyDepts = departments.filter((d) => d.faculty === faculty.id);
            return (
              <div
                key={faculty.id}
                className="bg-white dark:bg-card border border-border shadow-card rounded-2xl overflow-hidden"
              >
                {/* Faculty Header */}
                <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <School className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{faculty.name}</h3>
                      <p className="text-xs text-muted-foreground">Faculty ID: {faculty.id}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-foreground">
                    {facultyDepts.length} {facultyDepts.length === 1 ? "Department" : "Departments"}
                  </span>
                </div>

                {/* Departments List */}
                <div className="p-6">
                  {facultyDepts.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No departments associated with this faculty.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {facultyDepts.map((dept) => (
                        <div
                          key={dept.id}
                          className="flex items-center justify-between border border-border p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Building2 className="h-5 w-5 text-muted-foreground shrink-0" />
                            <div>
                              <h4 className="font-semibold text-sm text-foreground">{dept.name}</h4>
                              {dept.code && (
                                <span className="inline-block mt-1 text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                  {dept.code}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {dept.course_count !== undefined && (
                              <div className="flex items-center gap-1.5">
                                <BookOpen className="h-4 w-4" />
                                <span>{dept.course_count} Courses</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
