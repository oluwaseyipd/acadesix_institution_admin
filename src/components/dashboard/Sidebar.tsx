"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  GraduationCap,
  LayoutDashboard,
  School,
  Users,
  BookOpen,
  LogOut,
} from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Faculties & Depts", href: "/dashboard/faculties", icon: School },
    { name: "Lecturers & Students", href: "/dashboard/users", icon: Users },
    { name: "Courses & Curricula", href: "/dashboard/courses", icon: BookOpen },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar-background text-sidebar-foreground">
      {/* Brand logo */}
      <div className="flex h-20 items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-glow">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-gradient">
            Acadexis
          </span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Institution Portal
          </span>
        </div>
      </div>

      {/* University banner */}
      {user?.university && (
        <div className="px-6 py-4 border-b border-sidebar-border bg-sidebar-accent/30">
          <p className="text-[10px] font-bold text-sidebar-accent-foreground uppercase tracking-wider">
            Active Institution
          </p>
          <h3 className="mt-0.5 text-sm font-semibold truncate text-foreground">
            {user.university.name}
          </h3>
          {user.university.code && (
            <span className="inline-flex mt-1 items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              {user.university.code}
            </span>
          )}
        </div>
      )}

      {/* Navigation routes */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-white shadow-glow"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-colors ${
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User profile & Logout */}
      <div className="border-t border-sidebar-border p-4 bg-sidebar-accent/10">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-bold">
            {user?.first_name ? user.first_name[0].toUpperCase() : user?.email[0].toUpperCase()}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold text-foreground truncate">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
};
