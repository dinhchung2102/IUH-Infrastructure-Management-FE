import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white/97">
      {/* Sidebar - Desktop (Fixed) */}
      <AdminSidebar className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:z-30 lg:h-screen" />

      {/* Sidebar - Mobile */}
      <AdminSidebar mobile open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:ml-[260px]">
        {/* TopBar */}
        <AdminTopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30 p-2">
          <div className="mx-auto w-full max-w-[1600px] px-2 sm:px-4 md:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
