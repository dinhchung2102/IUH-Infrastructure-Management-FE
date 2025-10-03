import React, { useState } from "react";
import {
  Box, IconButton, Typography, AppBar, Toolbar, Drawer,
  List, ListItemButton, ListItemText, ListItemIcon, Divider
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Devices,
  Assignment,
  Report,
  EventNote,
  Business
} from "@mui/icons-material";

import DashboardPage from "../components/admin/DashboardPage";
import AccountsPage from "../components/admin/AccountsPage";
import DevicesPage from "../components/admin/DevicesPage";
import EmployeesPage from "../components/admin/EmployeesPage";
import ReportsPage from "../components/admin/ReportsPage";
import SchedulesPage from "../components/admin/SchedulesPage";
import FacilitiesPage from "../components/admin/FacilitiesPage";

const drawerWidth = 260;

export default function AdminLayout() {
  const [page, setPage] = useState("Dashboard");
  const [openDrawer, setOpenDrawer] = useState(false);

  const menuItems = [
    { label: "Bảng điều khiển", value: "Dashboard", icon: <Dashboard /> },
    { label: "Quản lý tài khoản", value: "Accounts", icon: <People /> },
    { label: "Quản lý cơ sở", value: "Facilities", icon: <Business /> },
    { label: "Quản lý thiết bị", value: "Devices", icon: <Devices /> },
    { label: "Quản lý nhân viên", value: "Employees", icon: <Assignment /> },
    { label: "Quản lý báo cáo", value: "Reports", icon: <Report /> },
    { label: "Quản lý lịch trực", value: "Schedules", icon: <EventNote /> },
  ];

  const renderPage = () => {
    switch (page) {
      case "Dashboard": return <DashboardPage />;
      case "Accounts": return <AccountsPage />;
      case "Facilities": return <FacilitiesPage />;
      case "Devices": return <DevicesPage />;
      case "Employees": return <EmployeesPage />;
      case "Reports": return <ReportsPage />;
      case "Schedules": return <SchedulesPage />;
      default: return <Typography color="white">Page not found</Typography>;
    }
  };

  // Menu component để dùng chung cho cả mobile + desktop
  const MenuContent = ({ onItemClick }) => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo + Title */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          IUH Infrastructure
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      {/* Menu list */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.value}
            selected={page === item.value}
            onClick={() => {
              setPage(item.value);
              if (onItemClick) onItemClick();
            }}
            sx={{
              my: 0.5,
              borderRadius: 1.5,
              mx: 1,
              "&.Mui-selected": {
                bgcolor: "#00bcd4",
                color: "#000",
                fontWeight: "bold",
              },
              "&.Mui-selected .MuiListItemIcon-root": {
                color: "#000",
              },
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: "center", fontSize: 12, opacity: 0.6 }}>
        © 2025 IUH
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#181818",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: "1px solid #333",
        }}
      >
        <Toolbar>
          <Box sx={{ display: { xs: "flex", lg: "none" }, mr: 2 }}>
            <IconButton color="inherit" onClick={() => setOpenDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            IUH Infrastructure
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: "linear-gradient(135deg, #0a2a43 0%, #0f4c81 100%)",
            color: "#fff",
            boxSizing: "border-box",
            borderRight: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <Toolbar />
        <MenuContent />
      </Drawer>

      {/* Drawer mobile */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{ display: { xs: "block", lg: "none" } }}
        PaperProps={{
          sx: {
            width: drawerWidth,
            background: "linear-gradient(135deg, #0a2a43 0%, #0f4c81 100%)",
            color: "white",
          },
        }}
      >
        <MenuContent onItemClick={() => setOpenDrawer(false)} />
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#181818",
          minHeight: "100vh",
          p: 3,
          mt: 8,
        }}
      >
        {renderPage()}
      </Box>
    </Box>
  );
}
