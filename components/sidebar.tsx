"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ListFilter,
  Bookmark,
  TrendingUp,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

export function Sidebar() {
  const pathname = usePathname();
  const { lists, savedSearches } = useStore();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { href: "/companies", label: "Companies", icon: Building2, badge: null },
    { href: "/lists", label: "Lists", icon: ListFilter, badge: lists.length },
    {
      href: "/saved",
      label: "Saved Searches",
      icon: Bookmark,
      badge: savedSearches.length,
    },
  ];

  return (
    <aside className="h-screen w-60 border-r border-gray-100 bg-white p-4 flex flex-col">
      {/* Logo / Brand */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">VS</span>
          </div>
          <span className="font-semibold text-gray-900">VC Scout</span>
        </div>
        <p className="text-xs text-gray-400">Precision sourcing</p>
      </div>

      {/* Navigation */}
      <div>
        <label className="text-xs font-medium text-gray-400 tracking-wider mb-2 block">
          NAVIGATION
        </label>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon
                  size={16}
                  className={cn(
                    "shrink-0",
                    isActive ? "text-blue-700" : "text-gray-600"
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge !== null && item.badge > 0 && (
                  <span className="ml-auto rounded-full bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 font-medium">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Thesis Card */}
      <div className="mt-auto">
        <div className="bg-blue-50 rounded-lg p-3 flex gap-2 mb-3">
          <TrendingUp size={14} className="shrink-0 text-blue-600 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-blue-900">Thesis Score</p>
            <p className="text-xs text-blue-600 truncate">
              AI-first B2B tools
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
