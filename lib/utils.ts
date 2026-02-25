import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Sector, Stage, Company } from "@/lib/types";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(isoString: string): string {
  const now = new Date();
  const date = new Date(isoString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;

  return `${Math.floor(seconds / 31536000)}y ago`;
}

export function formatDateAbsolute(isoString: string): string {
  const date = new Date(isoString);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

export function scoreColor(score: number): string {
  if (score < 50) return "text-red-500";
  if (score < 70) return "text-amber-500";
  if (score < 85) return "text-blue-500";
  return "text-green-500";
}

export function scoreBgColor(score: number): string {
  if (score < 50) return "bg-red-50 text-red-700 border-red-200";
  if (score < 70) return "bg-amber-50 text-amber-700 border-amber-200";
  if (score < 85) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-green-50 text-green-700 border-green-200";
}

export function stageColor(stage: Stage): string {
  switch (stage) {
    case "Pre-seed":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Seed":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "Series A":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "Series B":
      return "bg-violet-50 text-violet-700 border-violet-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export function sectorIcon(sector: Sector): string {
  switch (sector) {
    case "AI Infra":
      return "🤖";
    case "DevTools":
      return "🛠️";
    case "FinTech":
      return "💳";
    case "HealthTech":
      return "🏥";
    case "B2B SaaS":
      return "📊";
    case "Climate":
      return "🌱";
    case "Security":
      return "🔒";
    default:
      return "📌";
  }
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

export function generateId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 7);
  return `${prefix}_${timestamp}_${random}`;
}

export function exportToCSV(companies: Company[], filename: string): void {
  if (typeof window === "undefined") return;

  const headers = ["id", "name", "url", "sector", "stage", "hq", "thesisScore"];
  const rows = companies.map((company) => [
    company.id,
    company.name,
    company.url,
    company.sector,
    company.stage,
    company.hq,
    company.thesisScore.toString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
