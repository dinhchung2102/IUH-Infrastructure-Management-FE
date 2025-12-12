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
import { CriticalReportNotifications } from "./components/CriticalReportNotifications";
import { Toaster } from "./components/ui/sonner";
import { ScrollToTop } from "./components/ScrollToTop";

// User pages
import HomePage from "./user/home/HomePage";
import AboutPage from "./user/about/AboutPage";
import FacilitiesPage from "./user/facilities/FacilitiesPage";
import NewsPage from "./user/news/NewsPage";
import NewsDetailPage from "./user/news/NewsDetailPage";
import ReportPage from "./user/report/ReportPage";
import MyReportsPage from "./user/report/MyReportsPage";
import QuickReportPage from "./user/report/QuickReportPage";
import QRTestPage from "./user/report/QRTestPage";

// Admin pages
import DashboardPage from "./admin/pages/DashboardPage";
import AccountPage from "./admin/account-management/page/AccountPage";
import StaffPage from "./admin/staff-management/page/StaffPage";
import CampusPage from "./admin/campus/page/CampusPage";
import BuildingAreaPage from "./admin/building-area/page/building-areaPage";
import BuildingPage from "./admin/building-area/page/BuildingPage";
import AreaPage from "./admin/building-area/page/AreaPage";
import ReportManagementPage from "./admin/report-management/page/ReportManagementPage";
import ReportStatisticsPage from "./admin/report-management/page/ReportStatisticsPage";
import AccountStatisticsPage from "./admin/account-management/page/AccountStatisticsPage";
import StaffStatisticsPage from "./admin/staff-management/page/StaffStatisticsPage";
import AuditStatisticsPage from "./admin/audit-management/page/AuditStatisticsPage";
import BuildingAreaStatisticsPage from "./admin/building-area/page/BuildingAreaStatisticsPage";
import AuditManagementPage from "./admin/audit-management/page/AuditManagementPage";
import RoleManagementPage from "./admin/role-management/page/RoleManagementPage";
import NewsManagementPage from "./admin/news-management/page/NewsManagementPage";
import NewsCategoryManagementPage from "./admin/news-category-management/page/NewsCategoryManagementPage";
import ZonePage from "./admin/zone/page/ZonePage";
import AssetCategoriesPage from "./admin/asset-management/page/AssetCategoriesPage";
import Assetpage from "./admin/asset-management/page/AssetPage";
import MaintenancePage from "./admin/maintenance/page/MaintenancePage";
import AnalyticsPage from "./admin/statistics/AnalyticsPage";
import SettingsPage from "./admin/pages/SettingsPage";

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
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:slug" element={<NewsDetailPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="my-reports" element={<MyReportsPage />} />
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="facilities" element={<div>Facilities Management</div>} />
          <Route path="campus" element={<CampusPage />} />
          <Route path="building-area" element={<BuildingAreaPage />} />
          <Route path="buildings" element={<BuildingPage />} />
          <Route path="areas" element={<AreaPage />} />
          <Route path="zone" element={<ZonePage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="reports" element={<ReportManagementPage />} />
          <Route path="reports/statistics" element={<ReportStatisticsPage />} />
          <Route path="statistics/account" element={<AccountStatisticsPage />} />
          <Route path="statistics/staff" element={<StaffStatisticsPage />} />
          <Route path="statistics/audit" element={<AuditStatisticsPage />} />
          <Route path="statistics/building-area" element={<BuildingAreaStatisticsPage />} />
          <Route path="audits" element={<AuditManagementPage />} />
          <Route path="roles" element={<RoleManagementPage />} />
          <Route path="news" element={<NewsManagementPage />} />
          <Route
            path="news-categories"
            element={<NewsCategoryManagementPage />}
          />
          <Route path="asset-categories" element={<AssetCategoriesPage />} />
          <Route path="asset" element={<Assetpage />} />
          <Route path="news" element={<div>News Management</div>} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="settings" element={<SettingsPage />} />
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
      <ScrollToTop />
      <AppRoutes />
      <SessionExpiredDialog />
      <CriticalReportNotifications />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
