import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { GlobalSearch } from "@/components/global-search";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VC Scout — Precision Sourcing",
  description: "AI-powered venture capital sourcing and company intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ overflow: "hidden" }}>
        <div className="flex h-screen bg-gray-50">
          {/* Fixed Sidebar (240px) */}
          <div className="w-60 shrink-0">
            <Sidebar />
          </div>

          {/* Main content area */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            {/* Top bar */}
            <header className="h-14 border-b border-gray-100 bg-white flex items-center justify-between px-6 shrink-0">
              <GlobalSearch />
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  VC
                </div>
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
