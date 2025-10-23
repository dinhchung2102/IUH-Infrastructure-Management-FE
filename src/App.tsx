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
import { SessionExpiredDialog } from "./components/SessionExpiredDialog";
import { Toaster } from "./components/ui/sonner";

// User pages
import HomePage from "./user/home/HomePage";
import AboutPage from "./user/about/AboutPage";
import FacilitiesPage from "./user/facilities/FacilitiesPage";
import ContactPage from "./user/contact/ContactPage";
import NewsPage from "./user/news/NewsPage";
import NewsDetailPage from "./user/news/NewsDetailPage";
import ReportPage from "./user/report/ReportPage";
import QuickReportPage from "./user/report/QuickReportPage";
import QRTestPage from "./user/report/QRTestPage";

// Admin pages
import DashboardPage from "./admin/pages/DashboardPage";
import AccountPage from "./admin/account-management/page/AccountPage";
import StaffPage from "./admin/staff-management/page/StaffPage";
import CampusPage from "./admin/campus/page/CampusPage";
import BuildingAreaPage from "./admin/building-area/page/building-areaPage";
import ReportManagementPage from "./admin/report-management/page/ReportManagementPage";
import AuditManagementPage from "./admin/audit-management/page/AuditManagementPage";
import RoleManagementPage from "./admin/role-management/page/RoleManagementPage";
import NewsManagementPage from "./admin/news-management/page/NewsManagementPage";
import NewsCategoryManagementPage from "./admin/news-category-management/page/NewsCategoryManagementPage";
function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Quick Report - Standalone (No Layout) */}
        <Route path="/quick-report/:assetId" element={<QuickReportPage />} />

        {/* QR Test Page - Standalone (No Layout) */}
        <Route path="/qr-test" element={<QRTestPage />} />
        <Route path="/qr-test/:assetId" element={<QRTestPage />} />

        {/* User Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="facilities" element={<FacilitiesPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:slug" element={<NewsDetailPage />} />
          <Route path="report" element={<ReportPage />} />
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="analytics" element={<div>Analytics Page</div>} />
          <Route path="facilities" element={<div>Facilities Management</div>} />
          <Route path="campus" element={<CampusPage />} />
          <Route path="building-area" element={<BuildingAreaPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="reports" element={<ReportManagementPage />} />
          <Route path="audits" element={<AuditManagementPage />} />
          <Route path="roles" element={<RoleManagementPage />} />
          <Route path="news" element={<NewsManagementPage />} />
          <Route
            path="news-categories"
            element={<NewsCategoryManagementPage />}
          />
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
      <SessionExpiredDialog />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
