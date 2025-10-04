import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit, Add, Visibility } from "@mui/icons-material";
import { buildingService } from "../../api/buildings";
import { campusService } from "../../api/campus";
import ZoneModal from "./ZonesPage";
export default function BuildingPage() {
  const theme = useTheme();
  const [zoneModal, setZoneModal] = useState({ open: false, buildingId: "", buildingName: "" });
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const BuildingStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    UNDERMAINTENANCE: "UNDERMAINTENANCE",
  };

  const statusLabels = {
    [BuildingStatus.ACTIVE]: "Đang hoạt động",
    [BuildingStatus.INACTIVE]: "Đã đóng cửa",
    [BuildingStatus.UNDERMAINTENANCE]: "Đang bảo trì",
  };

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [campusList, setCampusList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    floor: 1,
    status: "ACTIVE",
    campus: "",
  });

  // Modal các phòng
  const [roomDialog, setRoomDialog] = useState({ open: false, rooms: [], buildingName: "" });

  // Load tất cả tòa nhà
  const loadBuildings = async () => {
    try {
      const res = await buildingService.getAll();
      if (res.success && res.data?.buildings) {
        setRows(
          res.data.buildings.map((item, index) => ({
            rowId: item._id,
            id: index + 1,
            stt: index + 1,
            name: item.name,
            floor: item.floor,
            status: item.status,
            campus: item.campus?.name || "N/A",
          }))
        );
      }
    } catch (error) {
      console.error("Lấy danh sách tòa nhà lỗi:", error);
    }
  };

  // Load campus cho select
  const loadCampus = async () => {
    try {
      const res = await campusService.getAll();
      if (res.success && res.data?.campuses) {
        setCampusList(res.data.campuses);
      }
    } catch (error) {
      console.error("Lấy danh sách campus lỗi:", error);
    }
  };

  const handleViewZones = (buildingId, buildingName) => {
  setZoneModal({ open: true, buildingId, buildingName });
};
  useEffect(() => {
    loadBuildings();
    loadCampus();
  }, []);

  const handleEdit = (row) => {
    setEditRow(row);
    const selectedCampus = campusList.find((c) => c.name === row.campus)?._id || "";
    setForm({
      name: row.name,
      floor: row.floor,
      status: row.status,
      campus: selectedCampus,
    });
    setOpen(true);
  };

  const handleCreate = () => {
    setEditRow(null);
    setForm({
      name: "",
      floor: 1,
      status: "ACTIVE",
      campus: "",
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tòa nhà này?")) {
      const res = await buildingService.delete(id);
      if (res.success) {
        setRows(rows.filter((row) => row.rowId !== id));
      } else {
        alert("Xóa thất bại: " + res.message);
      }
    }
  };

  const handleSave = async () => {
    const payload = { ...form };
    try {
      if (editRow) {
        const res = await buildingService.update(editRow.rowId, payload);
        if (res.success) {
          await loadBuildings();
          setOpen(false);
        } else alert("Cập nhật thất bại: " + res.message);
      } else {
        const res = await buildingService.create(payload);
        if (res.success) {
          await loadBuildings();
          setOpen(false);
        } else alert("Tạo tòa nhà thất bại: " + res.message);
      }
    } catch (error) {
      console.error("Lỗi lưu tòa nhà:", error);
    }
  };

  // Mở modal xem phòng
  const handleViewRooms = (buildingName) => {
    // TODO: call API lấy danh sách phòng của tòa nếu có
    const sampleRooms = [
      { id: 1, name: "Phòng 101", floor: 1 },
      { id: 2, name: "Phòng 102", floor: 1 },
      { id: 3, name: "Phòng 201", floor: 2 },
    ];
    setRoomDialog({ open: true, rooms: sampleRooms, buildingName });
  };

  const columns = [
    { field: "stt", headerName: "STT", width: 70 },
    { field: "name", headerName: "Tên tòa nhà", flex: 1 },
    { field: "floor", headerName: "Số tầng", width: 120 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => (
        <Typography
          sx={{
            color:
              params.value === BuildingStatus.ACTIVE
                ? "green"
                : params.value === BuildingStatus.INACTIVE
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
    { field: "campus", headerName: "Cơ sở", flex: 1 },
    {
  field: "rooms",
  headerName: "Các phòng",
  width: 150,
  renderCell: (params) => (
    <Button variant="outlined" size="small" onClick={() => handleViewZones(params.row.rowId, params.row.name)}>
      Xem
    </Button>
  ),
},
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
    <Box sx={{ bgcolor: bgColor, minHeight: "100vh", p: 2 }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "transparent", boxShadow: "none", mb: 3, borderRadius: 2, p: 1 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold", color: "#000" }}>
            Quản lý tòa nhà
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
            Thêm
          </Button>
        </Toolbar>
      </AppBar>

      {/* DataGrid */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Box
          sx={{
            minWidth: 900,
            height: 450,
            bgcolor: cardColor,
            p: 2,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <DataGrid
            rows={rows}
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
      </Box>

      {/* Dialog Form */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editRow ? "Cập nhật tòa nhà" : "Thêm tòa nhà mới"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên tòa nhà"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            type="number"
            margin="dense"
            label="Số tầng"
            fullWidth
            value={form.floor}
            onChange={(e) => setForm({ ...form, floor: parseInt(e.target.value, 10) })}
          />
          <TextField
            select
            margin="dense"
            label="Cơ sở"
            fullWidth
            value={form.campus}
            onChange={(e) => setForm({ ...form, campus: e.target.value })}
            sx={{ mt: 2 }}
          >
            {campusList.map((campus) => (
              <MenuItem key={campus._id} value={campus._id}>
                {campus.name}
              </MenuItem>
            ))}
          </TextField>
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
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ bgcolor: "#00bcd4", "&:hover": { bgcolor: "#0097a7" } }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
           <ZoneModal
  open={zoneModal.open}
  onClose={() => setZoneModal({ ...zoneModal, open: false })}
  buildingId={zoneModal.buildingId}
  buildingName={zoneModal.buildingName}
/> 
     
    </Box>
  );
}
