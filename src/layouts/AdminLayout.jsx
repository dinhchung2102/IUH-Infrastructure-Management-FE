import React, { useState } from "react";
import {
  Box, Typography, Drawer,
  List, ListItemButton, ListItemText, ListItemIcon, Divider, Collapse, Toolbar
} from "@mui/material";
import {
  Dashboard,
  People,
  Devices,
  Assignment,
  Report,
  EventNote,
  Business,
  LocationCity,
  Apartment,
  ExpandLess,
  ExpandMore,
  AccountTree,
  Category // icon cho danh mục
} from "@mui/icons-material";

import DashboardPage from "../components/admin/DashboardPage";
import AccountsPage from "../components/admin/AccountsPage";
import EmployeesPage from "../components/admin/EmployeesPage";
import ReportsPage from "../components/admin/ReportsPage";
import SchedulesPage from "../components/admin/SchedulesPage";
import FacilitiesPage from "../components/admin/FacilitiesPage";
import BuildingsPage from "../components/admin/BuildingsPage";
import OutdoorAreasPage from "../components/admin/AreasPage";

// 👉 thêm 2 trang mới
import AssetsPage from "../components/admin/AssetsPage";
import AssetCategoriesPage from "../components/admin/AssetCategoriesPage";

const drawerWidth = 260;

export default function AdminLayout() {
  const [page, setPage] = useState("Dashboard");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openAreaMenu, setOpenAreaMenu] = useState(false);
  const [openDeviceMenu, setOpenDeviceMenu] = useState(false);

  const menuItems = [
    { label: "Bảng điều khiển", value: "Dashboard", icon: <Dashboard /> },
    { label: "Quản lý tài khoản", value: "Accounts", icon: <People /> },
    { label: "Quản lý cơ sở", value: "Facilities", icon: <Business /> },
    { label: "Quản lý nhân viên", value: "Employees", icon: <Assignment /> },
    { label: "Quản lý báo cáo", value: "Reports", icon: <Report /> },
    { label: "Quản lý lịch trực", value: "Schedules", icon: <EventNote /> },
  ];

  const renderPage = () => {
    switch (page) {
      case "Dashboard": return <DashboardPage />;
      case "Accounts": return <AccountsPage />;
      case "Facilities": return <FacilitiesPage />;
      case "Employees": return <EmployeesPage />;
      case "Reports": return <ReportsPage />;
      case "Schedules": return <SchedulesPage />;
      case "Buildings": return <BuildingsPage />;
      case "OutdoorAreas": return <OutdoorAreasPage />;
      case "Assets": return <AssetsPage />;
      case "AssetCategories": return <AssetCategoriesPage />;
      default: return <Typography color="black">Page not found</Typography>;
    }
  };

  const MenuContent = ({ onItemClick }) => (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          IUH Infrastructure
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <List>
        {/* Menu items không có submenu */}
        {menuItems.map((item) => (
          <ListItemButton
            key={item.value}
            selected={page === item.value}
            onClick={() => { setPage(item.value); if (onItemClick) onItemClick(); }}
            sx={{
              my: 0.5,
              borderRadius: 1.5,
              mx: 1,
              "&.Mui-selected": { bgcolor: "#00bcd4", color: "#000", fontWeight: "bold" },
              "&.Mui-selected .MuiListItemIcon-root": { color: "#000" },
              transition: "all 0.2s",
              "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

        {/* Quản lý thiết bị */}
        <ListItemButton
          onClick={() => setOpenDeviceMenu(!openDeviceMenu)}
          sx={{
            my: 0.5,
            borderRadius: 1.5,
            mx: 1,
            transition: "all 0.2s",
            "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <Devices />
          </ListItemIcon>
          <ListItemText primary="Quản lý thiết bị" />
          {openDeviceMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openDeviceMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 6, my: 0.5, borderRadius: 1.5 }}
              selected={page === "AssetCategories"}
              onClick={() => { setPage("AssetCategories"); if (onItemClick) onItemClick(); }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}><Category /></ListItemIcon>
              <ListItemText primary="Quản lý danh mục thiết bị" />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 6, my: 0.5, borderRadius: 1.5 }}
              selected={page === "Assets"}
              onClick={() => { setPage("Assets"); if (onItemClick) onItemClick(); }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}><Devices /></ListItemIcon>
              <ListItemText primary="Quản lý thiết bị" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Quản lý khu vực */}
        <ListItemButton
          onClick={() => setOpenAreaMenu(!openAreaMenu)}
          sx={{
            my: 0.5,
            borderRadius: 1.5,
            mx: 1,
            transition: "all 0.2s",
            "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <LocationCity />
          </ListItemIcon>
          <ListItemText primary="Quản lý khu vực" />
          {openAreaMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openAreaMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 6, my: 0.5, borderRadius: 1.5 }}
              selected={page === "Buildings"}
              onClick={() => { setPage("Buildings"); if (onItemClick) onItemClick(); }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}><Apartment /></ListItemIcon>
              <ListItemText primary="Quản lý tòa nhà" />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 6, my: 0.5, borderRadius: 1.5 }}
              selected={page === "OutdoorAreas"}
              onClick={() => { setPage("OutdoorAreas"); if (onItemClick) onItemClick(); }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}><AccountTree /></ListItemIcon>
              <ListItemText primary="Quản lý khu vực ngoài trời" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>

      <Box sx={{ p: 2, textAlign: "center", fontSize: 12, opacity: 0.6 }}>
        © 2025 IUH
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Drawer desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            height: "100vh",
            background: "linear-gradient(135deg, #0a2a43 0%, #0f4c81 100%)",
            color: "#fff",
            boxSizing: "border-box",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            overflowY: "auto",
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
            height: "100vh",
            background: "linear-gradient(135deg, #0a2a43 0%, #0f4c81 100%)",
            color: "white",
            overflowY: "auto",
          },
        }}
      >
        <MenuContent onItemClick={() => setOpenDrawer(false)} />
      </Drawer>

      {/* Nội dung chính */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f5f5f5",
          minHeight: "100vh",
          p: 3,
          mt: 2,
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        {renderPage()}
      </Box>
    </Box>
  );
}
