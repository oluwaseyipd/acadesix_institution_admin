"use client";

import { useState, useMemo } from "react";
import { Search, HelpCircle, X, Menu } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const displayName = user ? `${user.first_name} ${user.last_name}`.trim() : "Admin";
  const displayInitials = useMemo(() => {
    if (user?.first_name) {
      const first = user.first_name[0] || "";
      const last = user.last_name ? user.last_name[0] : "";
      return (first + last).toUpperCase();
    }
    return user?.email ? user.email[0].toUpperCase() : "A";
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-background border-b border-border gap-4">
      <div className="flex gap-24 items-center flex-1">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <Link
            href="/dashboard"
            className="text-md font-bold text-foreground tracking-tight shrink-0 hover:text-brand-primary transition-colors flex items-center gap-2"
          >
            <span className="text-gradient font-extrabold text-lg">Acadexis</span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded-full hidden sm:inline-block">
              Institution Portal
            </span>
          </Link>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className={`hidden md:flex items-center gap-2 flex-1 max-w-100 bg-muted rounded-full px-4 py-2 transition-all duration-200 ${
            isFocused ? "ring-2 ring-brand-primary/50 bg-card shadow-sm" : ""
          }`}
        >
          <Search size={14} strokeWidth={2} className="text-muted-foreground shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search details..."
            className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none flex-1 min-w-0"
            aria-label="Search"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X size={13} strokeWidth={2} />
            </button>
          )}
        </form>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Help */}
        <Link
          href="/dashboard"
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          aria-label="Help"
        >
          <HelpCircle size={18} strokeWidth={1.8} />
        </Link>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm animate-fade-in"
          title={displayName}
        >
          <span>{displayInitials}</span>
        </div>
      </div>
    </header>
  );
}
