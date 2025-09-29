import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AppBarRes from "../components/AppBar";
import Footer from "../components/Footer";

export default function MainLayout() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* AppBar */}
      <AppBarRes />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
          pt: { xs: 7, md: 8 }, // Add padding top to account for fixed header
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
