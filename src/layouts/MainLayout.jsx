import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
} from "@mui/material";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeSwitcher from "../components/ThemeSwitcher";

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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t("navigation.title")}
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            {t("common.home")}
          </Button>
          <Button color="inherit" component={RouterLink} to="/login">
            {t("common.login")}
          </Button>
          <Button color="inherit" component={RouterLink} to="/register">
            {t("common.register")}
          </Button>
          <ThemeSwitcher />
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>

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
