import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { Link as RouterLink, useLocation } from "react-router-dom";
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

function AppBarRes() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const location = useLocation(); 
  const handleOpenDrawer = () => setOpen(true);
  const handleCloseDrawer = () => setOpen(false);

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
              component={RouterLink}
              to="/login"
              sx={(theme) => ({
                color: isActive("/login")
                  ? theme.palette.common.white
                  : "inherit",
                backgroundColor: isActive("/login")
                  ? theme.palette.primary.dark
                  : "inherit",
                "&:hover": {
                  backgroundColor: isActive("/login")
                    ? theme.palette.primary.main
                    : theme.palette.action.hover,
                },
              })}
            >
              {t("common.login")}
            </Button>

            <Button
              component={RouterLink}
              to="/register"
              sx={(theme) => ({
                color: isActive("/register")
                  ? theme.palette.common.white
                  : "inherit",
                backgroundColor: isActive("/register")
                  ? theme.palette.primary.dark
                  : "inherit",
                "&:hover": {
                  backgroundColor: isActive("/register")
                    ? theme.palette.primary.main
                    : theme.palette.action.hover,
                },
              })}
            >
              {t("common.register")}
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
        open={open}
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
            }),
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            pb: 0,
          }}
        >
          <Box
            component="img"
            src={logoIUH}
            alt="App Logo"
            sx={{
              height: 60,
              display: "block",
            }}
          />
          <Box
            sx={{
              p: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <ThemeSwitcher />
            <LanguageSwitcher />
          </Box>
        </Box>

        {/* Menu items */}
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
            <ListItemButton
              component={RouterLink}
              to="/login"
              sx={{
                color: "inherit",
                bgcolor: isActive("/login") ? "action.selected" : "transparent",
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <PermIdentityIcon />
              </ListItemIcon>
              <ListItemText primary={t("common.login")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/register"
              sx={{
                color: "inherit",
                bgcolor: isActive("/register")
                  ? "action.selected"
                  : "transparent",
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <EditNoteIcon />
              </ListItemIcon>
              <ListItemText primary={t("common.register")} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

export default AppBarRes;
