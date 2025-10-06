import { Outlet } from "react-router-dom";
import SideBar from "../SideBar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className="flex-1 overflow-y-auto bg-muted/40">
        <Outlet />
      </main>
    </div>
  );
}
