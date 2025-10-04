import React, { useState } from "react";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Collapse,
  Toolbar,
  IconButton,
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
  Category, // icon cho danh mục
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

const drawerWidth = 250;
const collapsedDrawerWidth = 70;

export default function AdminLayout() {
  const [page, setPage] = useState("Dashboard");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openAreaMenu, setOpenAreaMenu] = useState(false);
  const [openDeviceMenu, setOpenDeviceMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { label: "Bảng điều khiển", value: "Dashboard", icon: <Dashboard /> },
    { label: "Quản lý tài khoản", value: "Accounts", icon: <People /> },
    { label: "Quản lý cơ sở", value: "Facilities", icon: <Business /> },
    { label: "Quản lý nhân viên", value: "Employees", icon: <Assignment /> },
  ];

  const renderPage = () => {
    switch (page) {
      case "Dashboard":
        return <DashboardPage />;
      case "Accounts":
        return <AccountsPage />;
      case "Facilities":
        return <FacilitiesPage />;
      case "Employees":
        return <EmployeesPage />;
      case "Reports":
        return <ReportsPage />;
      case "Schedules":
        return <SchedulesPage />;
      case "Buildings":
        return <BuildingsPage />;
      case "OutdoorAreas":
        return <OutdoorAreasPage />;
      case "Assets":
        return <AssetsPage />;
      case "AssetCategories":
        return <AssetCategoriesPage />;
      default:
        return <Typography color="black">Page not found</Typography>;
    }
  };

  const MenuContent = ({ onItemClick }) => (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          position: "relative",
        }}
      >
        {!sidebarCollapsed && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              opacity: sidebarCollapsed ? 0 : 1,
              transition: "opacity 0.3s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            IUH Infrastructure
          </Typography>
        )}
        <IconButton
          onClick={() => {
            setSidebarCollapsed(!sidebarCollapsed);
            // Đóng tất cả dropdown khi collapse
            if (!sidebarCollapsed) {
              setOpenDeviceMenu(false);
              setOpenAreaMenu(false);
            }
          }}
          color="white"
          sx={{
            position: "absolute",
            right: 8,
            color: "white",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            transition: "all 0.3s ease",
          }}
        >
          {sidebarCollapsed ? (
            <ExpandMore sx={{ transform: "rotate(-90deg)" }} />
          ) : (
            <ExpandLess sx={{ transform: "rotate(-90deg)" }} />
          )}
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <List>
        {/* Menu items không có submenu */}
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
              justifyContent: sidebarCollapsed ? "center" : "flex-start",
              "&.Mui-selected": {
                bgcolor: "#00bcd4",
                color: "#000",
                fontWeight: "bold",
              },
              "&.Mui-selected .MuiListItemIcon-root": { color: "#000" },
              transition: "all 0.3s ease",
              "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            <ListItemIcon
              sx={{
                color: "inherit",
                minWidth: sidebarCollapsed ? "auto" : 40,
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!sidebarCollapsed && (
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.9rem",
                  opacity: sidebarCollapsed ? 0 : 1,
                  transition: "opacity 0.3s ease",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              />
            )}
          </ListItemButton>
        ))}

        {/* Quản lý thiết bị */}
        <ListItemButton
          onClick={() => {
            if (sidebarCollapsed) return; // Không mở dropdown khi collapsed
            setOpenDeviceMenu(!openDeviceMenu);
            setOpenAreaMenu(false); // Đóng dropdown khu vực
          }}
          sx={{
            my: 0.5,
            borderRadius: 1.5,
            mx: 1,
            justifyContent: sidebarCollapsed ? "center" : "flex-start",
            transition: "all 0.3s ease",
            "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
          }}
        >
          <ListItemIcon
            sx={{
              color: "inherit",
              minWidth: sidebarCollapsed ? "auto" : 40,
              justifyContent: "center",
            }}
          >
            <Devices />
          </ListItemIcon>
          {!sidebarCollapsed && (
            <>
              <ListItemText
                primary="Quản lý thiết bị"
                primaryTypographyProps={{
                  fontSize: "0.9rem",
                  opacity: sidebarCollapsed ? 0 : 1,
                  transition: "opacity 0.3s ease",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              />
              {openDeviceMenu ? <ExpandLess /> : <ExpandMore />}
            </>
          )}
        </ListItemButton>

        <Collapse
          in={openDeviceMenu && !sidebarCollapsed}
          timeout="auto"
          unmountOnExit
          sx={{ transition: "all 0.3s ease" }}
        >
          <List component="div" disablePadding>
            <ListItemButton
              sx={{
                pl: 6,
                my: 0.5,
                borderRadius: 1.5,
                transition: "all 0.3s ease",
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
              selected={page === "AssetCategories"}
              onClick={() => {
                setPage("AssetCategories");
                if (onItemClick) onItemClick();
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                <Category />
              </ListItemIcon>
              <ListItemText
                primary="Danh mục thiết bị"
                primaryTypographyProps={{
                  fontSize: "0.85rem",
                  transition: "all 0.3s ease",
                }}
              />
            </ListItemButton>

            <ListItemButton
              sx={{
                pl: 6,
                my: 0.5,
                borderRadius: 1.5,
                transition: "all 0.3s ease",
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
              selected={page === "Assets"}
              onClick={() => {
                setPage("Assets");
                if (onItemClick) onItemClick();
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                <Devices />
              </ListItemIcon>
              <ListItemText
                primary="Quản lý thiết bị"
                primaryTypographyProps={{
                  fontSize: "0.85rem",
                  transition: "all 0.3s ease",
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Quản lý khu vực */}
        <ListItemButton
          onClick={() => {
            if (sidebarCollapsed) return; // Không mở dropdown khi collapsed
            setOpenAreaMenu(!openAreaMenu);
            setOpenDeviceMenu(false); // Đóng dropdown thiết bị
          }}
          sx={{
            my: 0.5,
            borderRadius: 1.5,
            mx: 1,
            justifyContent: sidebarCollapsed ? "center" : "flex-start",
            transition: "all 0.3s ease",
            "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
          }}
        >
          <ListItemIcon
            sx={{
              color: "inherit",
              minWidth: sidebarCollapsed ? "auto" : 40,
              justifyContent: "center",
            }}
          >
            <LocationCity />
          </ListItemIcon>
          {!sidebarCollapsed && (
            <>
              <ListItemText
                primary="Quản lý khu vực"
                primaryTypographyProps={{
                  fontSize: "0.9rem",
                  opacity: sidebarCollapsed ? 0 : 1,
                  transition: "opacity 0.3s ease",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              />
              {openAreaMenu ? <ExpandLess /> : <ExpandMore />}
            </>
          )}
        </ListItemButton>

        <Collapse
          in={openAreaMenu && !sidebarCollapsed}
          timeout="auto"
          unmountOnExit
          sx={{ transition: "all 0.3s ease" }}
        >
          <List component="div" disablePadding>
            <ListItemButton
              sx={{
                pl: 6,
                my: 0.5,
                borderRadius: 1.5,
                transition: "all 0.3s ease",
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
              selected={page === "Buildings"}
              onClick={() => {
                setPage("Buildings");
                if (onItemClick) onItemClick();
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                <Apartment />
              </ListItemIcon>
              <ListItemText
                primary="Quản lý tòa nhà"
                primaryTypographyProps={{
                  fontSize: "0.85rem",
                  transition: "all 0.3s ease",
                }}
              />
            </ListItemButton>

            <ListItemButton
              sx={{
                pl: 6,
                my: 0.5,
                borderRadius: 1.5,
                transition: "all 0.3s ease",
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
              selected={page === "OutdoorAreas"}
              onClick={() => {
                setPage("OutdoorAreas");
                if (onItemClick) onItemClick();
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                <AccountTree />
              </ListItemIcon>
              <ListItemText
                primary="Khu vực ngoài trời"
                primaryTypographyProps={{
                  fontSize: "0.85rem",
                  transition: "all 0.3s ease",
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>
      </List>

      <Box sx={{ mt: "auto", p: 1 }}>
        <ListItemButton
          onClick={() => window.open("/", "_blank")}
          sx={{
            my: 0.5,
            borderRadius: 1.5,
            mx: 1,
            justifyContent: sidebarCollapsed ? "center" : "flex-start",
            transition: "all 0.3s ease",
            "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
          }}
          title="Trang chủ"
        >
          <ListItemIcon
            sx={{
              color: "inherit",
              minWidth: sidebarCollapsed ? "auto" : 40,
              justifyContent: "center",
            }}
          ></ListItemIcon>
          {!sidebarCollapsed && (
            <ListItemText
              primary="Xem website"
              primaryTypographyProps={{
                fontSize: "0.85rem",
                opacity: sidebarCollapsed ? 0 : 1,
                transition: "opacity 0.3s ease",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            />
          )}
        </ListItemButton>
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
          width: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth,
          flexShrink: 0,
          transition: "width 0.3s ease",
          "& .MuiDrawer-paper": {
            width: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth,
            height: "100vh",
            background: "linear-gradient(135deg, #0a2a43 0%, #0f4c81 100%)",
            color: "#fff",
            boxSizing: "border-box",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            overflowY: "auto",
            transition: "width 0.3s ease",
          },
        }}
      >
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
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        {renderPage()}
      </Box>
    </Box>
  );
}
