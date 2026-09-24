"use client";

import { useState, ReactNode } from "react";
import CustomerSidebar from "./Sidebar";
import CustomerTopbar from "./Topbar";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#eef3fb]">
      {/* Sidebar */}
      <CustomerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Topbar */}
      <CustomerTopbar
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* Main Content */}
      <main className="min-h-screen pt-20 lg:ml-[260px]">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}