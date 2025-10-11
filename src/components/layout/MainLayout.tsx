import { Outlet } from "react-router-dom";
import AppBar from "../AppBar";
import Footer from "../Footer";
import { ScrollProgress, PageTransition } from "../motion";
import { Toaster } from "../ui/sonner";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <AppBar />
      <main className="flex-1 px-6">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
