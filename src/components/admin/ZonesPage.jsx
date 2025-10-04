// components/ZoneModal.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete, Add } from "@mui/icons-material";
import { zonesService } from "../../api/zones";

export default function ZoneModal({ open, onClose, buildingId, buildingName }) {
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const ZoneStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    UNDERMAINTENANCE: "UNDERMAINTENANCE",
  };
  const statusLabels = {
    [ZoneStatus.ACTIVE]: "Đang hoạt động",
    [ZoneStatus.INACTIVE]: "Đã đóng cửa",
    [ZoneStatus.UNDERMAINTENANCE]: "Đang bảo trì",
  };

  const [zones, setZones] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({
    name: "",
    status: "ACTIVE",
    description: "",
    zoneType: "PUBLIC",
    floorLocation: 1,
  });

  const loadZones = async () => {
    if (!buildingId) return;
    try {
      const res = await zonesService.getAllZonesByBuilding(buildingId);
      if (res.success && res.data?.zones) {
        setZones(
          res.data.zones.map((zone, index) => ({
            rowId: zone._id,
            id: index + 1,
            name: zone.name,
            status: zone.status,
            description: zone.description || "",
            zoneType: zone.zoneType,
            floorLocation: zone.floorLocation,
            createdYear: new Date(zone.createdAt).getFullYear(),
          }))
        );
      }
    } catch (error) {
      console.error("Lấy danh sách zones lỗi:", error);
    }
  };

  useEffect(() => {
    if (open) loadZones();
  }, [open, buildingId]);

  const handleEdit = (row) => {
    setEditRow(row);
    setForm({
      name: row.name,
      status: row.status,
      description: row.description,
      zoneType: row.zoneType,
      floorLocation: row.floorLocation,
    });
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditRow(null);
    setForm({ name: "", status: "ACTIVE", description: "", zoneType: "PUBLIC", floorLocation: 1 });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khu vực này?")) return;
    const res = await zonesService.delete(id);
    if (res.success) loadZones();
    else alert("Xóa thất bại: " + res.message);
  };

  const handleSave = async () => {
  const payload = { 
    ...form, 
    building: buildingId  // bắt buộc theo API
  };
  try {
    if (editRow) {
      const res = await zonesService.update(editRow.rowId, payload);
      if (res.success) {
        await loadZones();
        setFormOpen(false);
      } else alert("Cập nhật thất bại: " + res.message);
    } else {
      const res = await zonesService.create(payload);
      if (res.success) {
        await loadZones();
        setFormOpen(false);
      } else alert("Tạo zone thất bại: " + res.message);
    }
  } catch (error) {
    console.error("Lỗi lưu zone:", error);
  }
};


  const columns = [
  { field: "id", headerName: "STT", width: 70 },
  { field: "name", headerName: "Tên khu vực", flex: 1 },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 150,
    renderCell: (params) => (
      <Typography
        sx={{
          color:
            params.value === ZoneStatus.ACTIVE
              ? "green"
              : params.value === ZoneStatus.INACTIVE
              ? "red"
              : "orange",
          fontWeight: "bold",
          textAlign: "center",
          fontSize: 14,
          mt: 2,
        }}
      >
        {statusLabels[params.value] || params.value}
      </Typography>
    ),
  },
  { field: "description", headerName: "Mô tả", flex: 1.5 },
  {
    field: "zoneType",
    headerName: "Loại khu vực",
    width: 150,
    renderCell: (params) => (
      <Typography sx={{ fontSize: 14, mt: 2 }}>
        {params.value === "PUBLIC"
          ? "Ngoài trời"
          : params.value === "SERVICE"
          ? "Dịch vụ"
          : "Chức năng"}
      </Typography>
    ),
  },
  { field: "floorLocation", headerName: "Tầng", width: 100 },
  {
    field: "actions",
    headerName: "Hành động",
    width: 150,
    renderCell: (params) => (
      <>
        <IconButton color="primary" onClick={() => handleEdit(params.row)}>
          <Edit />
        </IconButton>
        <IconButton color="error" onClick={() => handleDelete(params.row.rowId)}>
          <Delete />
        </IconButton>
      </>
    ),
  },
];

  const bgColor = prefersDarkMode ? "#1e1e1e" : "#f5f5f5";
  const cardColor = prefersDarkMode ? "#2b2b2b" : "#ffffff";
  const textColor = prefersDarkMode ? "#e0e0e0" : "#1c1c1c";
  const headerBg = prefersDarkMode ? "#3c3c3c" : "#1976d2";
  const headerText = prefersDarkMode ? "#fff" : "#000000ff";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{buildingName}</DialogTitle>

      <AppBar position="static" sx={{ bgcolor: "transparent", boxShadow: "none", mb: 1 }}>
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
            Thêm
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent>
        <Box sx={{ height: 400, width: "100%", bgcolor: cardColor, borderRadius: 1 }}>
          <DataGrid
            rows={zones}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            sx={{
              bgcolor: cardColor,
              color: textColor,
              border: "none",
              "& .MuiDataGrid-columnHeaders": { bgcolor: headerBg, color: headerText, fontWeight: "bold" },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>

      {/* Form Thêm/Sửa zone */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editRow ? "Cập nhật zone" : "Thêm zone mới"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên khu vực"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            type="number"
            margin="dense"
            label="Tầng"
            fullWidth
            value={form.floorLocation}
            onChange={(e) => setForm({ ...form, floorLocation: parseInt(e.target.value, 10) })}
          />
          <TextField
            select
            margin="dense"
            label="Trạng thái"
            fullWidth
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            sx={{ mt: 2 }}
          >
            {Object.entries(statusLabels).map(([key, label]) => (
              <MenuItem key={key} value={key}>{label}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            margin="dense"
            label="Loại khu vực"
            fullWidth
            value={form.zoneType}
            onChange={(e) => setForm({ ...form, zoneType: e.target.value })}
            sx={{ mt: 2 }}
          >
            <MenuItem value="PUBLIC">Ngoài trời</MenuItem>
            <MenuItem value="SERVICE">Dịch vụ</MenuItem>
            <MenuItem value="FUNCTIONAL">Chức năng</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#00bcd4", "&:hover": { bgcolor: "#0097a7" } }}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
