import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { ListItemIcon } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeSwitcher from "../components/ThemeSwitcher";
import logoIUH from "../assets/logo/iuh_logo-positive-official.png";
import HomeIcon from "@mui/icons-material/Home";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SettingsIcon from "@mui/icons-material/Settings";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link as RouterLink, useLocation } from "react-router-dom";
import LoginDialog from "../modules/auth/pages/LoginDialog";

function AppBarRes() {
  const { t } = useTranslation();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openLogin, setOpenLogin] = React.useState(false);
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenDrawer = () => setOpenDrawer(true);
  const handleCloseDrawer = () => setOpenDrawer(false);

  const handleOpenSettings = (event) => setAnchorEl(event.currentTarget);
  const handleCloseSettings = () => setAnchorEl(null);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Logo */}
          <Box sx={{ flexGrow: 1 }}>
            <RouterLink to="/">
              <Box
                component="img"
                src={logoIUH}
                alt="App Logo"
                sx={{
                  height: "100%",
                  maxHeight: { xs: 60, md: 80 },
                  display: "block",
                }}
              />
            </RouterLink>
          </Box>

          {/* Menu desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            <Button
              component={RouterLink}
              to="/"
              sx={(theme) => ({
                color: isActive("/") ? theme.palette.common.white : "inherit",
                backgroundColor: isActive("/")
                  ? theme.palette.primary.dark
                  : "inherit",
                "&:hover": {
                  backgroundColor: isActive("/")
                    ? theme.palette.primary.main
                    : theme.palette.action.hover,
                },
              })}
            >
              {t("common.home")}
            </Button>

            <Button
              onClick={() => setOpenLogin(true)}
              sx={(theme) => ({
                color: "inherit",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              })}
            >
              {t("common.login")}
            </Button>

            <ThemeSwitcher />
            <LanguageSwitcher />
          </Box>

          {/* Menu mobile */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleOpenDrawer}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer cho mobile */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={handleCloseDrawer}
        slotProps={{
          paper: {
            sx: (theme) => ({
              bgcolor:
                theme.palette.mode === "light"
                  ? theme.palette.primary.main
                  : theme.palette.background.default,
              color: theme.palette.getContrastText(
                theme.palette.mode === "light"
                  ? theme.palette.primary.main
                  : theme.palette.background.default
              ),
              minWidth: 250,
              display: "flex",
              flexDirection: "column",
            }),
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <Box
            component="img"
            src={logoIUH}
            alt="App Logo"
            sx={{
              height: 60,
              display: "block",
            }}
          />
        </Box>

        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/"
              sx={{
                color: "inherit",
                bgcolor: isActive("/") ? "action.selected" : "transparent",
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={t("common.home")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            {/* 👇 mobile cũng mở modal */}
            <ListItemButton
              onClick={() => {
                setOpenLogin(true);
                handleCloseDrawer();
              }}
              sx={{
                color: "inherit",
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <PermIdentityIcon />
              </ListItemIcon>
              <ListItemText primary={t("common.login")} />
            </ListItemButton>
          </ListItem>
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-start" }}>
          <IconButton color="inherit" onClick={handleOpenSettings}>
            <SettingsIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            color="inherit"
            onClose={handleCloseSettings}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <ThemeSwitcher />
                  </ListItemIcon>
                  <ListItemText primary={t("theme.changeTheme")} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <LanguageSwitcher />
                  </ListItemIcon>
                  <ListItemText primary={t("common.language")} />
                </ListItemButton>
              </ListItem>
            </List>
          </Menu>
        </Box>
      </Drawer>

      {/* 👇 gắn LoginDialog */}
      <LoginDialog open={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  );
}

export default AppBarRes;
