"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  School,
  Users,
  BookOpen,
  LogOut,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Faculties & Depts", href: "/dashboard/faculties", icon: School },
    { name: "Lecturers & Students", href: "/dashboard/users", icon: Users },
    { name: "Courses & Curricula", href: "/dashboard/courses", icon: BookOpen },
  ];

  const displayName = user ? `${user.first_name} ${user.last_name}`.trim() : "Admin";
  const displayInitials = useMemo(() => {
    if (user?.first_name) {
      const first = user.first_name[0] || "";
      const last = user.last_name ? user.last_name[0] : "";
      return (first + last).toUpperCase();
    }
    return user?.email ? user.email[0].toUpperCase() : "A";
  }, [user]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-[280px] flex flex-col justify-between bg-sidebar border-r border-border py-6 px-4 shrink-0 font-sans transition-transform duration-300 shadow-xl md:relative md:translate-x-0 md:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col flex-1">
        {/* Mobile header with close button */}
        <div className="flex items-center justify-between md:hidden pb-4 border-b border-border mb-4">
          <span className="font-extrabold text-gradient text-lg">Acadexis</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* University banner */}
        {user?.university && (
          <div className="px-4 py-3 rounded-lg border border-border bg-brand-primary/5 mb-6">
            <p className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">
              Active Institution
            </p>
            <h3 className="mt-0.5 text-sm font-semibold truncate text-foreground">
              {user.university.name}
            </h3>
            {user.university.code && (
              <span className="inline-flex mt-1 items-center rounded-md bg-brand-primary/10 px-2 py-0.5 text-[10px] font-bold text-brand-primary border border-brand-primary/20">
                {user.university.code}
              </span>
            )}
          </div>
        )}

        {/* Navigation routes */}
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isDashboardRoot = item.href === "/dashboard";
            const isActive =
              pathname === item.href ||
              (!isDashboardRoot && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onClose?.()}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-150 group ${
                  isActive
                    ? "text-brand-primary bg-brand-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon
                  size={17}
                  strokeWidth={1.8}
                  className={
                    isActive
                      ? "text-brand-primary font-bold"
                      : "text-muted-foreground group-hover:text-foreground"
                  }
                />
                {item.name}

                {/* Active indicator bar */}
                <span
                  className={`absolute right-0 w-1.5 h-full rounded-r-lg bg-brand-primary transition-opacity duration-150 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & Logout */}
      <div className="flex flex-col gap-3">
        {/* Profile Card */}
        <div className="py-3 px-4 bg-brand-primary/10 hover:bg-brand-primary/15 rounded-lg transition-all duration-150">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              <span>{displayInitials}</span>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium text-sidebar-foreground leading-tight truncate">
                {displayName}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5 truncate">
                {user?.email}
              </span>
            </div>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-3 text-xs text-muted-foreground hover:text-destructive cursor-pointer rounded-lg hover:bg-destructive/10 transition-colors w-full text-left"
        >
          <LogOut size={14} strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
