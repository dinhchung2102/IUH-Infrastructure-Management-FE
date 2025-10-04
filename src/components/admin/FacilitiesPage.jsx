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
import { campusService } from "../../api/campus";

export default function FacilitiesPage() {
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const sampleManagers = [
    {
      id: "68df816374092ffc263a964b",
      fullName: "Nguyễn Văn A",
      email: "phamvanchieu@iuh.edu.vn",
      phoneNumber: "0976166842",
    },
    {
      id: "68bbecb62fc9130399c71a21",
      fullName: "Huỳnh Thị Lưu Ly",
      email: "luuly1163@gmail.com",
      phoneNumber: "0976166841",
    },
  ];
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    status: "ACTIVE",
    manager: { id: "", "họ tên": "", email: "" },
  });

  const [managerDialog, setManagerDialog] = useState({
    open: false,
    manager: { "họ tên": "", email: "" },
  });

  const loadCampus = async () => {
    try {
      const res = await campusService.getAll();
      if (res.success && res.data?.campuses) {
        setRows(
          res.data.campuses.map((item, index) => ({
            rowId: item._id, // dùng update/delete
            id: index + 1, // DataGrid hiển thị STT
            stt: index + 1,
            "tên cơ sở": item.name,
            "địa chỉ": item.address,
            "số điện thoại": item.phone,
            email: item.email,
            "trạng thái": item.status,
            quản_lý: {
              fullName: item.manager?.fullName || "",
              email: item.manager?.email || "",
              id: item.manager?._id || "", // quan trọng
            },
          }))
        );
      }
    } catch (error) {
      console.error("Lấy danh sách campus lỗi:", error);
    }
  };

  useEffect(() => {
    loadCampus();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa cơ sở này?")) {
      const res = await campusService.delete(id);
      if (res.success) {
        setRows(rows.filter((row) => row.rowId !== id));
      } else {
        alert("Xóa cơ sở thất bại: " + res.message);
      }
    }
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setForm({
      name: row["tên cơ sở"],
      address: row["địa chỉ"],
      phone: row["số điện thoại"],
      email: row.email,
      status: row["trạng thái"],
      manager: row.quản_lý?.id || "", // chỉ _id
    });
    setOpen(true);
  };

  const handleCreate = () => {
    setEditRow(null);
    setForm({
      name: "",
      address: "",
      phone: "",
      email: "",
      status: "ACTIVE",
      manager: "", // chỉ _id
    });
    setOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      address: form.address,
      phone: form.phone,
      email: form.email,
      status: form.status,
      manager: form.manager,
    };
    console.log(payload);
    try {
      if (editRow) {
        const res = await campusService.update(editRow.rowId, payload);

        if (res.success) {
          await loadCampus();
          setOpen(false);
        } else {
          alert("Cập nhật thất bại: " + res.message);
        }
      } else {
        const res = await campusService.create(payload);
        if (res.success) {
          await loadCampus();
          setOpen(false);
        } else {
          alert("Tạo cơ sở thất bại: " + res.message);
        }
      }
    } catch (error) {
      console.error("Lỗi lưu cơ sở:", error);
    }
  };

  const columns = [
    { field: "stt", headerName: "STT", width: 70 },
    { field: "tên cơ sở", headerName: "Tên cơ sở", flex: 1 },
    { field: "địa chỉ", headerName: "Địa chỉ", flex: 1.5 },
    { field: "số điện thoại", headerName: "SĐT", width: 150 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "trạng thái",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => (
        <Typography
          sx={{
            color: params.value === "ACTIVE" ? "green" : "red",
            fontWeight: "bold",
            fontSize: 14,
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            paddingTop: 2,
          }}
        >
          {params.value === "ACTIVE" ? "Đang hoạt động" : "Đã đóng cửa"}
        </Typography>
      ),
    },
    {
      field: "quản_lý",
      headerName: "Quản lý",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            setManagerDialog({ open: true, manager: params.row.quản_lý })
          }
        >
          Xem thông tin
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
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.rowId)}
          >
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
            Quản lý cơ sở
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
            Thêm
          </Button>
        </Toolbar>
      </AppBar>

      {/* DataGrid */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Box
          sx={{
            minWidth: 800,
            height: 420,
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

      {/* Dialog Form Campus */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editRow ? "Cập nhật cơ sở" : "Thêm cơ sở mới"}
        </DialogTitle>
        <DialogContent>
          {["name", "address", "phone", "email", "status"].map((field) => (
            <TextField
              key={field}
              margin="dense"
              label={field === "name" ? "Tên cơ sở" : field}
              fullWidth
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          ))}

          <Typography sx={{ mt: 2, fontWeight: "bold" }}>Quản lý</Typography>

          <TextField
            select
            margin="dense"
            label="Chọn quản lý"
            fullWidth
            value={form.manager} // _id
            onChange={(e) => setForm({ ...form, manager: e.target.value })} // lưu _id
          >
            {sampleManagers.map((manager) => (
              <MenuItem key={manager.id} value={manager.id}>
                {manager.fullName}
              </MenuItem>
            ))}
          </TextField>
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

      {/* Dialog Manager */}
      <Dialog
        open={managerDialog.open}
        onClose={() => setManagerDialog({ ...managerDialog, open: false })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Thông tin quản lý</DialogTitle>
        <DialogContent>
          <Typography>Họ tên: {managerDialog.manager?.["họ tên"]}</Typography>
          <Typography>Email: {managerDialog.manager?.email}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setManagerDialog({ ...managerDialog, open: false })}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
