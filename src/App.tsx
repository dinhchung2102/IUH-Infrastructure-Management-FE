import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";

// User pages
import HomePage from "./user/home/HomePage";
import AboutPage from "./user/about/AboutPage";
import FacilitiesPage from "./user/facilities/FacilitiesPage";
import ContactPage from "./user/contact/ContactPage";
import NewsPage from "./user/news/NewsPage";
import ReportPage from "./user/report/ReportPage";

// Admin pages
import DashboardPage from "./admin/pages/DashboardPage";

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* User Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="facilities" element={<FacilitiesPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="report" element={<ReportPage />} />
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="analytics" element={<div>Analytics Page</div>} />
          <Route path="facilities" element={<div>Facilities Management</div>} />
          <Route path="users" element={<div>Users Management</div>} />
          <Route path="reports" element={<div>Reports Management</div>} />
          <Route path="news" element={<div>News Management</div>} />
          <Route path="maintenance" element={<div>Maintenance Schedule</div>} />
          <Route path="feedback" element={<div>Feedback Management</div>} />
          <Route path="settings" element={<div>Settings</div>} />
          <Route path="profile" element={<div>Profile</div>} />
        </Route>

        {/* 404 - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
