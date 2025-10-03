import React, { useState } from "react";
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
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit, Add, CheckCircle, Cancel } from "@mui/icons-material";

export default function EmployeesPage() {
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [rows, setRows] = useState([
    { id: 1, name: "Edward Perry", age: 25, joinDate: "16/7/2025", department: "Finance", fulltime: true },
    { id: 2, name: "Josephine Drake", age: 36, joinDate: "16/7/2025", department: "Market", fulltime: false },
    { id: 3, name: "Cody Phillips", age: 19, joinDate: "16/7/2025", department: "Development", fulltime: true },
  ]);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({ name: "", age: "", joinDate: "", department: "", fulltime: false });

  const handleDelete = (id) => setRows(rows.filter((row) => row.id !== id));
  const handleEdit = (row) => {
    setEditRow(row);
    setForm(row);
    setOpen(true);
  };
  const handleCreate = () => {
    setEditRow(null);
    setForm({ name: "", age: "", joinDate: "", department: "", fulltime: false });
    setOpen(true);
  };
  const handleSave = () => {
    if (editRow) {
      setRows(rows.map((row) => (row.id === editRow.id ? { ...form, id: editRow.id } : row)));
    } else {
      setRows([...rows, { ...form, id: rows.length + 1 }]);
    }
    setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Full Name", flex: 1 },
    { field: "age", headerName: "Age", width: 100 },
    { field: "joinDate", headerName: "Join Date", width: 150 },
    { field: "department", headerName: "Department", flex: 1 },
    // {
    //   field: "fulltime",
    //   headerName: "Full-time Status",
    //   width: 140,
    //   renderCell: (params) => (
    //     <Box
    //       sx={{
    //         width: "100%",
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //       }}
    //     >
    //       {params.value ? (
    //         <CheckCircle sx={{ color: "#4caf50", fontSize: 24 }} />
    //       ) : (
    //         <Cancel sx={{ color: "#f44336", fontSize: 24 }} />
    //       )}
    //     </Box>
    //   ),
    // },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
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
  const headerText = "#000";

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
            Quản lý nhân viên
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

      {/* Responsive table */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Box
          sx={{
            minWidth: 600,
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
                borderBottom: prefersDarkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: headerBg,
                color: headerText,
                fontWeight: "bold",
                fontSize: "0.95rem",
                borderBottom: prefersDarkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.2)",
              },
              "& .MuiDataGrid-footerContainer": {
                bgcolor: "linear-gradient(135deg, #0a2a43 0%, #0f4c81 100%)",
                borderTop: "none",
                color: "#fff",
              },
              "& .MuiDataGrid-row:hover": {
                bgcolor: prefersDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              },
              "& .MuiPaginationItem-root": {
                bgcolor: "transparent",
                color: "#fff",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "linear-gradient(135deg, #0f4c81 0%, #0a2a43 100%)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  transform: "translateY(-2px)",
                },
                "&.Mui-selected": {
                  bgcolor: "linear-gradient(135deg, #0f4c81 0%, #0a2a43 100%)",
                  color: "#fff",
                },
              },
              "& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                color: "#000000ff",
              },
            }}
          />
        </Box>
      </Box>

      {/* Dialog Form */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editRow ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Age"
            type="number"
            fullWidth
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Join Date"
            fullWidth
            value={form.joinDate}
            onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Department"
            fullWidth
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.fulltime}
                onChange={(e) => setForm({ ...form, fulltime: e.target.checked })}
              />
            }
            label="Full-time"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ bgcolor: "#00bcd4", "&:hover": { bgcolor: "#0097a7" } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
