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
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import SettingsIcon from "@mui/icons-material/Settings";
import Menu from "@mui/material/Menu";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link as RouterLink, useLocation } from "react-router-dom";
import LoginDialog from "../modules/auth/pages/LoginDialog";
import RegisterDialog from "../modules/auth/pages/RegisterDialog";
import { useAuth } from "../providers/AuthContext.jsx";
import usePermission from "../hooks/usePermission.js";
function AppBarRes() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { hasRole } = usePermission();
  const location = useLocation();
  console.log(user);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorAccount, setAnchorAccount] = React.useState(null);
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);
  const [openAccountModal, setOpenAccountModal] = React.useState(false);
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
                  paddingY: 1,
                  maxHeight: { xs: 60, md: 80 },
                }}
              />
            </RouterLink>
          </Box>

          {/* Menu desktop */}
          {/* Menu desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {/* Trang chủ luôn hiển thị */}
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

            {/* Chỉ admin mới thấy */}
            {hasRole("ADMIN") && (
              <Button
                component={RouterLink}
                to="/admin"
                sx={(theme) => ({
                  color: isActive("/admin")
                    ? theme.palette.common.white
                    : "inherit",
                  backgroundColor: isActive("/admin")
                    ? theme.palette.primary.dark
                    : "inherit",
                  "&:hover": {
                    backgroundColor: isActive("/admin")
                      ? theme.palette.primary.main
                      : theme.palette.action.hover,
                  },
                })}
              >
                Trang Admin
              </Button>
            )}

            {/* Chỉ staff mới thấy */}
            {hasRole("STAFF") && (
              <Button
                component={RouterLink}
                to="/staff"
                sx={(theme) => ({
                  color: isActive("/staff")
                    ? theme.palette.common.white
                    : "inherit",
                  backgroundColor: isActive("/staff")
                    ? theme.palette.primary.dark
                    : "inherit",
                  "&:hover": {
                    backgroundColor: isActive("/staff")
                      ? theme.palette.primary.main
                      : theme.palette.action.hover,
                  },
                })}
              >
                Trang Staff
              </Button>
            )}

            {/* Nếu có user → hiện icon user */}
            {user ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  onClick={(e) => setAnchorAccount(e.currentTarget)}
                >
                  <AccountCircle />
                </IconButton>

                <Popover
                  open={Boolean(anchorAccount)}
                  anchorEl={anchorAccount}
                  onClose={() => setAnchorAccount(null)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  PaperProps={{
                    sx: {
                      p: 2,
                      width: 260,
                      borderRadius: 2,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      src={user.avatar || undefined}
                      alt={user.username || "User"}
                      sx={{ width: 40, height: 40, mr: 2 }}
                    >
                      {!user.avatar && (user.username ? user.username[0] : "U")}
                    </Avatar>

                    <Box>
                      <Typography variant="subtitle1">
                        {user.fullName || user.username}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "success.main", fontSize: "0.75rem" }}
                      >
                        {user.role || "User"}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 1 }}
                    onClick={() => {
                      setAnchorAccount(null);
                      // TODO: điều hướng tới trang profile
                    }}
                  >
                    {t("common.profile")}
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={() => {
                      logout();
                      setAnchorAccount(null);
                    }}
                  >
                    {t("common.logout")}
                  </Button>
                </Popover>
              </>
            ) : (
              // Nếu chưa đăng nhập → hiện nút login
              <Button
                color="inherit"
                onClick={() => {
                  setOpenLogin(true);
                  handleCloseDrawer();
                }}
              >
                {t("common.login")}
              </Button>
            )}

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
                  ? theme.palette.success.main
                  : theme.palette.background.default,
              color: theme.palette.getContrastText(
                theme.palette.mode === "light"
                  ? theme.palette.success.main
                  : theme.palette.background.default
              ),
              minWidth: 250,
              display: "flex",
              flexDirection: "column",
            }),
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <Box
            component="img"
            src={logoIUH}
            alt="App Logo"
            sx={{ height: 60 }}
          />
        </Box>

        {/* Thông tin user nếu đã đăng nhập */}
        {user && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Avatar
              src={user.avatar || undefined} // nếu không có avatar → hiển thị mặc định
              alt={user.username || "Người dùng"}
              sx={{ width: 40, height: 40, mr: 2 }}
            >
              {!user.avatar && (user.username ? user.username[0] : "U")}
            </Avatar>

            <Box>
              <Typography variant="subtitle1" color="text.inherit">
                {user.fullName || "Người dùng"}
              </Typography>
              <Typography
                variant="body2"
                color="text.inherit"
                sx={{ fontSize: "0.6rem" }}
              >
                {user.role || "User"}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Menu items */}
        <List sx={{ flexGrow: 1 }}>
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
          {/* Trang Admin cho admin */}
          {hasRole("ADMIN") && (
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/admin"
                sx={{
                  color: "inherit",
                  bgcolor: isActive("/admin")
                    ? "action.selected"
                    : "transparent",
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Trang Admin" />
              </ListItemButton>
            </ListItem>
          )}

          {/* Trang Staff cho staff */}
          {hasRole("STAFF") && (
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/staff"
                sx={{
                  color: "inherit",
                  bgcolor: isActive("/staff")
                    ? "action.selected"
                    : "transparent",
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Trang Staff" />
              </ListItemButton>
            </ListItem>
          )}
        </List>

        {/* Nút Settings + Logout / Login */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <IconButton
              color="inherit"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <SettingsIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              transformOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <ThemeSwitcher />
                    </ListItemIcon>
                    <ListItemText primary={t("theme.changeTheme")} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <LanguageSwitcher />
                    </ListItemIcon>
                    <ListItemText primary={t("common.language")} />
                  </ListItemButton>
                </ListItem>
              </List>
            </Menu>
          </Box>

          {user ? (
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => {
                logout();
                handleCloseDrawer();
              }}
            >
              {t("common.logout")}
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => {
                setOpenLogin(true);
                handleCloseDrawer();
              }}
            >
              {t("common.login")}
            </Button>
          )}
        </Box>
      </Drawer>

      <LoginDialog
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onSwitchToRegister={() => {
          setOpenLogin(false);
          setOpenRegister(true);
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
    </>
  );
}

export default AppBarRes;
