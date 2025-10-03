import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeContextProvider } from "./providers/ThemeContext";
import ThemeProvider from "./providers/ThemeProvider";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./components/Home";
import LoginPage from "./modules/auth/pages/LoginDialog";
import RegisterPage from "./modules/auth/pages/RegisterDialog";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorPage from "./pages/ErrorPage";
import AdminPage from "./pages/AdminPage";
import StaffPage from "./pages/StaffPage";
import { AuthProvider } from "./providers/AuthContext";
import PermissionGuard from "./modules/auth/permission/PermissionGuard";
function App() {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* Routes with MainLayout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="error" element={<ErrorPage />} />
                <Route
                  path="staff"
                  element={
                    <PermissionGuard roles={["STAFF"]}>
                      <StaffPage />
                    </PermissionGuard>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin route without MainLayout */}
              <Route
                path="/admin"
                element={
                  <PermissionGuard roles={["ADMIN"]}>
                    <AdminPage />
                  </PermissionGuard>
                }
              />
            </Routes>
          </Router>
        </ThemeProvider>
      </ThemeContextProvider>
    </AuthProvider>
  );
}

export default App;
