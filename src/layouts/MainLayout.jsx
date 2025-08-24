import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Icon,
  IconButton,
} from "@mui/material";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AppBarRes from "../components/AppBar";
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
      <AppBarRes />

      <Container
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          bgcolor: "background.paper",
          mt: "auto",
          flexShrink: 0,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            {t("footer.copyright")}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
