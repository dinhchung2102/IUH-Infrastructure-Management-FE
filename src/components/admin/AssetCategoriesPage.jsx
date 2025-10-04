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
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit, Add } from "@mui/icons-material";
import { assetCategoryService } from "../../api/assetCategories";

const API_BASE = "https://api.iuh.nagentech.com";

export default function AssetCategoriesPage() {
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [form, setForm] = useState({
    name: "",
    status: "ACTIVE",
    description: "",
    image: "",
  });

  // Load danh mục
  const loadCategories = async () => {
    try {
      const res = await assetCategoryService.getAll();
      if (res.success && res.data?.categories) {
        setRows(
          res.data.categories.map((item, index) => ({
            rowId: item._id,
            id: index + 1,
            name: item.name,
            status: item.status,
            description: item.description,
            image: item.image
              ? `${API_BASE}/uploads/${item.image.split("/").pop()}`
              : "",
          }))
        );
      }
    } catch (error) {
      console.error("Lỗi load categories:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      const res = await assetCategoryService.delete(id);
      if (res.success) {
        await loadCategories();
      } else {
        alert("Xóa thất bại: " + res.message);
      }
    }
  };

  const handleCreate = () => {
    setEditRow(null);
    setForm({
      name: "",
      status: "ACTIVE",
      description: "",
      image: "",
    });
    setPreviewImage("");
    setOpen(true);
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setForm({
      name: row.name,
      status: row.status,
      description: row.description,
      image: row.image || "",
    });
    setPreviewImage(row.image);
    setOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, image: file }));
    }
  };

 const handleSave = async () => {
  try {
    console.log("Form gửi lên:", form);
    let res;
    if (editRow) {
      res = await assetCategoryService.update(editRow.rowId, form);
    } else {
      res = await assetCategoryService.create(form);
    }

    if (res.success) {
      await loadCategories();
      setOpen(false);
    } else {
      alert("Lưu thất bại: " + res.message);
    }
  } catch (error) {
    console.error("Lỗi lưu danh mục:", error);
  }
};



  const columns = [
    { field: "id", headerName: "STT", width: 70 },
    { field: "name", headerName: "Tên danh mục", flex: 1 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value === "ACTIVE" ? "Đang hoạt động" : "Ngừng hoạt động"}
          color={params.value === "ACTIVE" ? "success" : "default"}
          size="small"
        />
      ),
    },
    { field: "description", headerName: "Mô tả", flex: 2 },
    {
      field: "image",
      headerName: "Ảnh",
      width: 150,
      renderCell: (params) =>
        params.value ? (
          <img
            src={params.value}
            alt="category"
            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Không có
          </Typography>
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

  return (
    <Box sx={{ bgcolor: prefersDarkMode ? "#1e1e1e" : "#f5f5f5", minHeight: "100vh", p: 2 }}>
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
            Quản lý danh mục thiết bị
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(135deg, #0a2a43 0%, #0f4c81 100%)",
              "&:hover": { opacity: 0.9 },
            }}
          >
            Thêm danh mục
          </Button>
        </Toolbar>
      </AppBar>

      {/* DataGrid */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Box
          sx={{
            minWidth: 800,
            height: 500,
            bgcolor: prefersDarkMode ? "#2b2b2b" : "#ffffff",
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
              bgcolor: prefersDarkMode ? "#2b2b2b" : "#ffffff",
              color: prefersDarkMode ? "#e0e0e0" : "#1c1c1c",
              border: "none",
              "& .MuiDataGrid-cell": {
                borderBottom: prefersDarkMode
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.1)",
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: prefersDarkMode ? "#3c3c3c" : "#1976d2",
                color: prefersDarkMode ? "#fff" : "#000",
                fontWeight: "bold",
                fontSize: "0.95rem",
              },
            }}
          />
        </Box>
      </Box>

      {/* Dialog Form */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editRow ? "Cập nhật danh mục" : "Thêm danh mục mới"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên danh mục"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <MenuItem value="ACTIVE">Đang hoạt động</MenuItem>
              <MenuItem value="IN_ACTIVE">Ngừng hoạt động</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Box mt={2}>
            <Button variant="outlined" component="label">
              Chọn ảnh
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            {previewImage && (
              <Box mt={2}>
                <img
                  src={previewImage}
                  alt="preview"
                  style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#00bcd4", "&:hover": { bgcolor: "#0097a7" } }}
            onClick={handleSave}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
