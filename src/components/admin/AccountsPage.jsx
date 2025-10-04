import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { authService } from "../../api/auth.js";
import {
  formatRoleToVietnamese,
  getRoleColor,
  getRoleOptions,
} from "../../utils/roleUtils.js";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    role: "",
  });

  // Fetch accounts data
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      if (searchTerm) params.search = searchTerm;
      if (roleFilter) params.role = roleFilter;

      const result = await authService.getAccounts(params);

      if (result?.success) {
        setAccounts(result.data.accounts || []);
        setTotalItems(result.data.pagination?.totalItems || 0);
      } else {
        setError(result?.message || "Không thể tải danh sách tài khoản");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải danh sách tài khoản");
      console.error("Fetch accounts error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, roleFilter]);

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Handle search
  const handleSearch = () => {
    setPage(0);
    fetchAccounts();
  };

  // Handle role filter change
  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
    setPage(0);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle edit account
  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setEditForm({
      fullName: account.fullName || "",
      phoneNumber: account.phoneNumber || "",
      address: account.address || "",
      role: account.role?._id || "",
    });
    setEditDialogOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!selectedAccount) return;

    setLoading(true);
    try {
      const result = await authService.updateAccount(
        selectedAccount._id,
        editForm
      );

      if (result?.success) {
        setEditDialogOpen(false);
        fetchAccounts(); // Refresh the list
      } else {
        setError(result?.message || "Cập nhật thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi cập nhật tài khoản");
      console.error("Update account error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: "white", fontWeight: 600 }}>
        Quản lý tài khoản
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tìm kiếm theo tên, email, username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
              sx={{
                minWidth: "400px",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Lọc theo vai trò</InputLabel>
              <Select
                value={roleFilter}
                onChange={handleRoleFilterChange}
                label="Lọc theo vai trò"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      width: "auto",
                      minWidth: 200,
                    },
                  },
                }}
                sx={{
                  minWidth: "200px",
                }}
              >
                {getRoleOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchAccounts}
              fullWidth
              sx={{ height: "56px" }}
            >
              Làm mới
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Accounts Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Tên đăng nhập</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : accounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography>Không có tài khoản nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account, index) => (
                  <TableRow key={account._id} hover>
                    <TableCell align="center">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      <Avatar
                        src={account.avatar}
                        alt={account.fullName || account.username}
                      >
                        {(account.fullName || account.username || "U")[0]}
                      </Avatar>
                    </TableCell>
                    <TableCell>{account.fullName || "N/A"}</TableCell>
                    <TableCell>{account.username}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={formatRoleToVietnamese(account.role?.roleName)}
                        color={getRoleColor(account.role?.roleName)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          account.isActive ? "Hoạt động" : "Không hoạt động"
                        }
                        color={account.isActive ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditAccount(account)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trong ${count !== -1 ? count : `nhiều hơn ${to}`}`
          }
        />
      </Paper>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa tài khoản</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ và tên"
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={editForm.phoneNumber}
                onChange={(e) =>
                  setEditForm({ ...editForm, phoneNumber: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
