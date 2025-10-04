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

export default function AssetCategoriesPage() {
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // form cho create/update
  const [form, setForm] = useState({
    name: "",
    status: "ACTIVE",
    description: "",
    image: "",
  });

  // load categories
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
            image: item.image,
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
      status: row.status,
      description: row.description,
      image: row.image,
    });
    setPreviewImage(row.image);
    setOpen(true);
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

  const handleSave = async () => {
    try {
      const payload = { ...form };
      if (editRow) {
        const res = await assetCategoryService.update(editRow.rowId, payload);
        if (res.success) {
          await loadCategories();
          setOpen(false);
        } else {
          alert("Cập nhật thất bại: " + res.message);
        }
      } else {
        const res = await assetCategoryService.create(payload);
        if (res.success) {
          await loadCategories();
          setOpen(false);
        } else {
          alert("Tạo danh mục thất bại: " + res.message);
        }
      }
    } catch (error) {
      console.error("Lỗi lưu danh mục:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewImage(ev.target.result);
        setForm({ ...form, image: ev.target.result }); // giả sử bạn sẽ gửi base64 hoặc upload lên server
      };
      reader.readAsDataURL(file);
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
      renderCell: (params) => (
        <img
          src={params.value}
          alt="category"
          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
        />
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

  // style
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
            Quản lý danh mục thiết bị
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

      {/* Dialog Form */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editRow ? "Cập nhật danh mục" : "Thêm danh mục mới"}</DialogTitle>
        <DialogContent>
          {/* Tên danh mục */}
          <TextField
            margin="dense"
            label="Tên danh mục"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* Trạng thái */}
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

          {/* Mô tả */}
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* Upload ảnh */}
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
