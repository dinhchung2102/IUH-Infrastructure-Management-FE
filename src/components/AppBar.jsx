import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import { ListItemIcon } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeSwitcher from "../components/ThemeSwitcher";
import logoIUH from "../assets/logo/iuh_logo-positive-official.png";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import Menu from "@mui/material/Menu";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Link as RouterLink, useLocation } from "react-router-dom";
import LoginDialog from "../modules/auth/pages/LoginDialog";
import RegisterDialog from "../modules/auth/pages/RegisterDialog";
import ForgotPasswordDialog from "../modules/auth/components/ForgotPasswordDialog";
import { useAuth } from "../providers/AuthContext.jsx";
import usePermission from "../hooks/usePermission.js";

function AppBarRes() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { hasRole } = usePermission();
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorAccount, setAnchorAccount] = React.useState(null);
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);
  const [openForgot, setOpenForgot] = React.useState(false);

  // Scroll animation states
  const [isScrolledDown, setIsScrolledDown] = React.useState(false);
  const [showScrollToTop, setShowScrollToTop] = React.useState(false);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  const handleOpenDrawer = () => setOpenDrawer(true);
  const handleCloseDrawer = () => setOpenDrawer(false);
  const handleOpenSettings = (event) => setAnchorEl(event.currentTarget);
  const handleCloseSettings = () => setAnchorEl(null);
  const isActive = (path) => location.pathname === path;

  // Scroll handler for header animation
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100;

      // Show/hide scroll to top button - only show when scrolling up
      if (currentScrollY > scrollThreshold) {
        if (currentScrollY < lastScrollY) {
          // Scrolling up - show button
          setShowScrollToTop(true);
        } else {
          // Scrolling down - hide button
          setShowScrollToTop(false);
        }
      } else {
        // At top - hide button
        setShowScrollToTop(false);
      }

      // Header hide/show logic
      if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
        // Scrolling down - hide header
        setIsScrolledDown(true);
      } else {
        // Scrolling up - show header
        setIsScrolledDown(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const navItems = React.useMemo(
    () => [
      { label: t("common.home"), to: "/", roles: [] },
      { label: "Trang Admin", to: "/admin", roles: ["ADMIN"] },
      { label: "Trang Staff", to: "/staff", roles: ["STAFF"] },
      { label: "Giới thiệu", to: "/about", roles: [] },
      { label: "Cơ sở vật chất", to: "/facility", roles: [] },
      { label: "Tin tức", to: "/news", roles: [] },
      { label: "Báo cáo sự cố", to: "/report", roles: [] },
      { label: "Liên hệ", to: "/contact", roles: [] },
    ],
    [t]
  );

  const gradient =
    "linear-gradient(135deg, rgba(9,26,70,0.95) 0%, rgba(9, 71, 178, 0.95) 100%)";

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: gradient,
          backdropFilter: "blur(10px)",
          borderBottom: (theme) => `1px solid ${theme.palette.primary.dark}40`,
          transform: isScrolledDown ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ py: { xs: 1, md: 1.5 }, gap: 2 }}>
          {/* Logo bên trái */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <RouterLink
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Box
                component="img"
                src={logoIUH}
                alt="App Logo"
                sx={{
                  height: { xs: 44, md: 54 },
                  width: "auto",
                }}
              />
            </RouterLink>
          </Box>

          {/* Nav links chiếm khoảng trống còn lại và canh giữa */}
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {navItems.map((item) => {
              if (
                item.roles.length &&
                !item.roles.some((role) => hasRole(role))
              ) {
                return null;
              }
              return (
                <Button
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  size="medium"
                  sx={(theme) => ({
                    color: isActive(item.to)
                      ? theme.palette.primary.contrastText
                      : theme.palette.common.white,
                    backgroundColor: isActive(item.to)
                      ? `${theme.palette.common.white}1f`
                      : "transparent",
                    borderRadius: 999,
                    px: 3,
                    fontWeight: 600,
                    transition: "all 0.25s ease",
                    "&:hover": {
                      backgroundColor: isActive(item.to)
                        ? `${theme.palette.common.white}33`
                        : `${theme.palette.common.white}1a`,
                      color: theme.palette.common.white,
                    },
                  })}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* Item bên phải */}
          <LanguageSwitcher />

          {user ? (
            <IconButton
              size="large"
              color="inherit"
              onClick={(e) => setAnchorAccount(e.currentTarget)}
              sx={{ ml: 1 }}
            >
              <AccountCircle fontSize="large" />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              color="white"
              onClick={() => setOpenLogin(true)}
              sx={{
                px: 3,
                fontWeight: 600,
                backgroundColor: "white",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "grey.100",
                },
              }}
            >
              {t("common.login")}
            </Button>
          )}

          {/* Menu mobile */}
          <Box sx={{ display: { xs: "flex", lg: "none" } }}>
            <IconButton color="inherit" onClick={handleOpenDrawer}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={handleCloseDrawer}
        slotProps={{
          paper: {
            sx: {
              minWidth: 300,
              background: gradient,
              color: "common.white",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              py: 2,
            },
          },
        }}
      >
        <Box
          sx={{
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              component="img"
              src={logoIUH}
              alt="App Logo"
              sx={{ height: 40 }}
            />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: 0.4 }}
            >
              IUH Infrastructure
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseDrawer}
            sx={{ color: "common.white" }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {user && (
          <Box sx={{ px: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
            >
              <Avatar
                src={user.avatar || undefined}
                alt={user.username || "User"}
              >
                {!user.avatar && (user.username ? user.username[0] : "U")}
              </Avatar>
              <Box>
                <Typography variant="subtitle2">
                  {user.fullName || user.username}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {user.role || "User"}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <List sx={{ px: 2 }}>
          {navItems.map((item) => {
            if (
              item.roles.length &&
              !item.roles.some((role) => hasRole(role))
            ) {
              return null;
            }

            return (
              <ListItem key={item.to} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.to}
                  onClick={handleCloseDrawer}
                  sx={{
                    borderRadius: 2,
                    color: "inherit",
                    mb: 0.5,
                    backgroundColor: isActive(item.to)
                      ? "rgba(255,255,255,0.12)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.18)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box
          sx={{
            px: 3,
            mt: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<SettingsIcon />}
            onClick={handleOpenSettings}
            sx={{ borderRadius: 4 }}
          >
            {t("common.settings", "Cài đặt")}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseSettings}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 220,
                borderRadius: 3,
              },
            }}
          >
            <MenuItem disableRipple>
              <ThemeSwitcher />
              <Typography variant="body2" sx={{ ml: 2 }}>
                {t("theme.changeTheme")}
              </Typography>
            </MenuItem>
            <MenuItem disableRipple>
              <LanguageSwitcher />
              <Typography variant="body2" sx={{ ml: 2 }}>
                {t("common.language")}
              </Typography>
            </MenuItem>
          </Menu>

          {user ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                logout();
                handleCloseDrawer();
              }}
              sx={{ fontWeight: 600 }}
            >
              {t("common.logout")}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                setOpenLogin(true);
                handleCloseDrawer();
              }}
              sx={{
                fontWeight: 600,
                backgroundColor: "white",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "grey.100",
                },
              }}
            >
              {t("common.login")}
            </Button>
          )}
        </Box>
      </Drawer>

      <Popover
        open={Boolean(anchorAccount)}
        anchorEl={anchorAccount}
        onClose={() => setAnchorAccount(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: 3,
            minWidth: 240,
            boxShadow: 8,
          },
        }}
      >
        {user && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                src={user.avatar || undefined}
                alt={user.username || "User"}
              >
                {!user.avatar && (user.username ? user.username[0] : "U")}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user.fullName || user.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.role || "User"}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              fullWidth
              sx={{ borderRadius: 4 }}
              onClick={() => setAnchorAccount(null)}
            >
              {t("common.profile")}
            </Button>
            <Button
              variant="contained"
              color="inherit"
              fullWidth
              sx={{ borderRadius: 4 }}
              onClick={() => {
                logout();
                setAnchorAccount(null);
              }}
            >
              {t("common.logout")}
            </Button>
          </Box>
        )}
      </Popover>

      <LoginDialog
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onSwitchToRegister={() => {
          setOpenLogin(false);
          setOpenRegister(true);
        }}
        onSwitchToForgot={() => {
          setOpenForgot(true); // Chỉ mở dialog quên mật khẩu, không đóng login
        }}
      />

      <RegisterDialog
        open={openRegister}
        onClose={() => setOpenRegister(false)}
        onSwitchToLogin={() => {
          setOpenRegister(false);
          setOpenLogin(true);
        }}
      />

      <ForgotPasswordDialog
        open={openForgot}
        onClose={() => setOpenForgot(false)}
      />

      {/* Scroll to Top Button */}
      <IconButton
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1000,
          backgroundColor: "rgba(21, 101, 192, 0.8)",
          backdropFilter: "blur(10px)",
          color: "white",
          width: 56,
          height: 56,
          opacity: showScrollToTop ? 1 : 0,
          visibility: showScrollToTop ? "visible" : "hidden",
          transform: showScrollToTop ? "scale(1)" : "scale(0.8)",
          transition: "all 0.3s ease-in-out",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
          "&:hover": {
            backgroundColor: "rgba(21, 101, 192, 0.9)",
            backdropFilter: "blur(15px)",
            transform: "scale(1.1)",
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
          },
        }}
        aria-label="scroll to top"
      >
        <KeyboardArrowUpIcon color="white" />
      </IconButton>
    </>
  );
}

export default AppBarRes;
