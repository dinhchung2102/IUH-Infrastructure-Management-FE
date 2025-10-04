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
  useMediaQuery,
  useTheme,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit, Add, Visibility } from "@mui/icons-material";
import { assetService } from "../../api/assets";

export default function AssetManagementPage() {
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [propertiesDialog, setPropertiesDialog] = useState({
    open: false,
    properties: {},
  });

  // form cho create/update
  const [form, setForm] = useState({
    name: "",
    code: "",
    status: "IN_USE",
    description: "",
    serialNumber: "",
    brand: "",
    assetType: "",
    assetCategory: "",
    image: "",
    warrantyEndDate: "",
    lastMaintenanceDate: "",
    zone: "",
    area: null,
    properties: {},
  });

  // load assets
  const loadAssets = async () => {
    try {
      const res = await assetService.getAll();
      if (res.success && res.data?.assets) {
        setRows(
          res.data.assets.map((item, index) => ({
            rowId: item._id,
            id: index + 1,
            name: item.name,
            code: item.code,
            status: item.status,
            description: item.description,
            serialNumber: item.serialNumber,
            brand: item.brand,
            assetType: item.assetType?.name,
            assetCategory: item.assetCategory?.name,
            warrantyEndDate: item.warrantyEndDate
              ? new Date(item.warrantyEndDate).toLocaleDateString()
              : "",
            lastMaintenanceDate: item.lastMaintenanceDate
              ? new Date(item.lastMaintenanceDate).toLocaleDateString()
              : "",
            zone: item.zone?.name,
            properties: item.properties,
          }))
        );
      }
    } catch (error) {
      console.error("Lỗi load assets:", error);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thiết bị này?")) {
      const res = await assetService.delete(id);
      if (res.success) {
        setRows(rows.filter((row) => row.rowId !== id));
      } else {
        alert("Xóa thất bại: " + res.message);
      }
    }
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setForm({
      name: row.name,
      code: row.code,
      status: row.status,
      description: row.description,
      serialNumber: row.serialNumber,
      brand: row.brand,
      assetType: row.assetType, // cần id khi gọi update
      assetCategory: row.assetCategory,
      image: row.image,
      warrantyEndDate: row.warrantyEndDate,
      lastMaintenanceDate: row.lastMaintenanceDate,
      zone: row.zone,
      area: row.area,
      properties: row.properties,
    });
    setOpen(true);
  };

  const handleCreate = () => {
    setEditRow(null);
    setForm({
      name: "",
      code: "",
      status: "IN_USE",
      description: "",
      serialNumber: "",
      brand: "",
      assetType: "",
      assetCategory: "",
      image: "",
      warrantyEndDate: "",
      lastMaintenanceDate: "",
      zone: "",
      area: null,
      properties: {},
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = { ...form };
      if (editRow) {
        const res = await assetService.update(editRow.rowId, payload);
        if (res.success) {
          await loadAssets();
          setOpen(false);
        } else {
          alert("Cập nhật thất bại: " + res.message);
        }
      } else {
        const res = await assetService.create(payload);
        if (res.success) {
          await loadAssets();
          setOpen(false);
        } else {
          alert("Tạo thiết bị thất bại: " + res.message);
        }
      }
    } catch (error) {
      console.error("Lỗi lưu thiết bị:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "STT", width: 70 },
    { field: "name", headerName: "Tên thiết bị", flex: 1 },
    { field: "code", headerName: "Mã thiết bị", width: 120 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    { field: "description", headerName: "Mô tả", flex: 2 },
    { field: "serialNumber", headerName: "Số serial", width: 160 },
    { field: "brand", headerName: "Thương hiệu", width: 120 },
    { field: "assetType", headerName: "Loại thiết bị", width: 150 },
    { field: "assetCategory", headerName: "Danh mục", width: 150 },
    { field: "zone", headerName: "Khu vực", width: 150 },
    { field: "warrantyEndDate", headerName: "Hạn bảo hành", width: 150 },
    { field: "lastMaintenanceDate", headerName: "Ngày bảo trì gần nhất", width: 180 },
    {
      field: "properties",
      headerName: "Thuộc tính",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<Visibility />}
          onClick={() =>
            setPropertiesDialog({ open: true, properties: params.row.properties })
          }
        >
          Xem
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
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
      <AppBar
        position="static"
        sx={{
          bgcolor: "transparent",
          boxShadow: "none",
          mb: 3,
          borderRadius: 2,
          p: 1,
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              color: "#000",
              textTransform: "uppercase",
            }}
          >
            Quản lý thiết bị
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{
              bgcolor: "linear-gradient(135deg, #0a2a43 0%, #0f4c81 100%)",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#0e0d0d80" },
            }}
          >
            Thêm thiết bị
          </Button>
        </Toolbar>
      </AppBar>

      {/* DataGrid */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Box
          sx={{
            minWidth: 1000,
            height: 500,
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
              "& .MuiDataGrid-cell": {
                borderBottom: prefersDarkMode
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.1)",
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: headerBg,
                color: headerText,
                fontWeight: "bold",
                fontSize: "0.95rem",
                borderBottom: prefersDarkMode
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.2)",
              },
              "& .MuiDataGrid-footerContainer": {
                bgcolor: "linear-gradient(135deg, #0a2a43 0%, #0f4c81 100%)",
                borderTop: "none",
                color: "#fff",
              },
            }}
          />
        </Box>
      </Box>

      {/* Dialog Form (Thêm/Sửa) */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editRow ? "Cập nhật thiết bị" : "Thêm thiết bị mới"}</DialogTitle>
        <DialogContent>
          {[
            { field: "name", label: "Tên thiết bị" },
            { field: "code", label: "Mã thiết bị" },
            { field: "status", label: "Trạng thái" },
            { field: "description", label: "Mô tả" },
            { field: "serialNumber", label: "Số serial" },
            { field: "brand", label: "Thương hiệu" },
            { field: "image", label: "Ảnh" },
            { field: "warrantyEndDate", label: "Hạn bảo hành" },
            { field: "lastMaintenanceDate", label: "Ngày bảo trì gần nhất" },
            { field: "zone", label: "Khu vực" },
          ].map(({ field, label }) => (
            <TextField
              key={field}
              margin="dense"
              label={label}
              fullWidth
              value={form[field] || ""}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#00bcd4", "&:hover": { bgcolor: "#0097a7" } }}
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Properties */}
      <Dialog
        open={propertiesDialog.open}
        onClose={() => setPropertiesDialog({ ...propertiesDialog, open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thông tin thuộc tính thiết bị</DialogTitle>
        <DialogContent>
          {Object.entries(propertiesDialog.properties || {}).map(([key, value]) => (
            <Typography key={key}>
              <b>{key}:</b> {value}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPropertiesDialog({ ...propertiesDialog, open: false })}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
