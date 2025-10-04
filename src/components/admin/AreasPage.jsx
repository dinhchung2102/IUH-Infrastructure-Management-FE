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
import { Delete, Edit, Add } from "@mui/icons-material";
import { areasService } from "../../api/areas";
import { campusService } from "../../api/campus"; // ✅ import campus

export default function AreasPage() {
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Status enum & mapping
  const AreaStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    UNDERMAINTENANCE: "UNDERMAINTENANCE",
  };

  const statusLabels = {
    [AreaStatus.ACTIVE]: "Đang hoạt động",
    [AreaStatus.INACTIVE]: "Đã đóng cửa",
    [AreaStatus.UNDERMAINTENANCE]: "Đang bảo trì",
  };

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [campusList, setCampusList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    status: "ACTIVE",
    description: "",
    campus: "",
    zoneType: "PUBLIC",
  });

  // Load all areas
  const loadAreas = async () => {
    try {
      const res = await areasService.getAll();
      if (res.success && res.data?.areas) {
        setRows(
          res.data.areas.map((item, index) => ({
            rowId: item._id,
            id: index + 1,
            stt: index + 1,
            name: item.name,
            status: item.status,
            description: item.description,
            campus: item.campus?.name || "N/A",
            zoneType: item.zoneType,
            createdYear: new Date(item.createdAt).getFullYear(), // ✅ năm tạo
          }))
        );
      }
    } catch (error) {
      console.error("Lấy danh sách khu vực lỗi:", error);
    }
  };

  // Load all campus for select
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

  useEffect(() => {
    loadAreas();
    loadCampus();
  }, []);

  const handleEdit = (row) => {
    setEditRow(row);
    const selectedCampus = campusList.find((c) => c.name === row.campus)?._id || "";
    setForm({
      name: row.name,
      status: row.status,
      description: row.description,
      campus: selectedCampus,
      zoneType: row.zoneType,
    });
    setOpen(true);
  };

  const handleCreate = () => {
    setEditRow(null);
    setForm({
      name: "",
      status: "ACTIVE",
      description: "",
      campus: "",
      zoneType: "PUBLIC",
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khu vực này?")) {
      const res = await areasService.delete(id);
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
        const res = await areasService.update(editRow.rowId, payload);
        if (res.success) {
          await loadAreas();
          setOpen(false);
        } else alert("Cập nhật thất bại: " + res.message);
      } else {
        const res = await areasService.create(payload);
        if (res.success) {
          await loadAreas();
          setOpen(false);
        } else alert("Tạo khu vực thất bại: " + res.message);
      }
    } catch (error) {
      console.error("Lỗi lưu khu vực:", error);
    }
  };

  const columns = [
    { field: "stt", headerName: "STT", width: 70 },
    { field: "name", headerName: "Tên khu vực", flex: 1 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => (
        <Typography
          sx={{
            color:
              params.value === AreaStatus.ACTIVE
                ? "green"
                : params.value === AreaStatus.INACTIVE
                ? "red"
                : "orange",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 14,
            mt: 2
          }}
        >
          {statusLabels[params.value] || params.value}
        </Typography>
      ),
    },
    { field: "description", headerName: "Mô tả", flex: 1.5 },
    { field: "campus", headerName: "Cơ sở", flex: 1 },
    { field: "zoneType", headerName: "Loại khu vực", width: 150,
  renderCell: (params) => (
    <Typography sx={{fontSize: 14, mt:2}}>
      {params.value === "PUBLIC" ? "Ngoài trời" : params.value === "SERVICE" ? "Dịch vụ" : params.value}
    </Typography>
  )
}
,
    { field: "createdYear", headerName: "Năm tạo", width: 100 }, // ✅ hiển thị năm tạo
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
            Quản lý khu vực
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
        <DialogTitle>{editRow ? "Cập nhật khu vực" : "Thêm khu vực mới"}</DialogTitle>
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

          {/* Status */}
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

          {/* ZoneType */}
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
  <MenuItem value="SERVICE">Dịch vụ</MenuItem> {/* sửa PRIVATE -> SERVICE */}
</TextField>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#00bcd4", "&:hover": { bgcolor: "#0097a7" } }}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
