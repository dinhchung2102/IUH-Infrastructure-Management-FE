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
import campusService from "../../api/campus";
import { areasService } from "../../api/areas";
import { zonesService } from "../../api/zones";
import buildingService from "../../api/buildings";
import { assetTypeService } from "../../api/assetTypes";

export default function AssetsPage() {
  const theme = useTheme();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [rows, setRows] = useState([]);
  const [locations, setLocations] = useState([]); // Bao gồm cả buildings + areas

  const [open, setOpen] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [assetTypes, setAssetTypes] = useState([]);
  const assetStatusMap = {
    NEW: { label: "Mới", color: "#2196f3" },
    IN_USE: { label: "Đang sử dụng", color: "#4caf50" },
    UNDER_MAINTENANCE: { label: "Đang bảo trì", color: "#ff9800" },
    DAMAGED: { label: "Hỏng", color: "#f44336" },
    LOST: { label: "Mất", color: "#9e9e9e" },
    TRANSFERRED: { label: "Đã điều chuyển", color: "#9c27b0" },
  };

  const [propertiesDialog, setPropertiesDialog] = useState({
    open: false,
    properties: {},
  });

  // Form state
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
  campus: "",
  area: "",
  zone: "",
  locationType: "", // thêm
  properties: {},
});


  const [campuses, setCampuses] = useState([]);
  const [areas, setAreas] = useState([]);
  const [zones, setZones] = useState([]);
  // Load areas theo campus
  const loadAreas = async (campusId) => {
    if (!campusId) {
      setAreas([]);
      return;
    }
    try {
      const res = await areasService.getAllByCampus(campusId);
      if (res.success && res.data?.areas) {
        setAreas(res.data.areas);
      } else {
        setAreas([]);
      }
    } catch (error) {
      console.error("loadAreas error:", error);
      setAreas([]);
    }
  };

  // Load assets
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
            image: item.image,
            warrantyEndDate: item.warrantyEndDate
              ? new Date(item.warrantyEndDate).toLocaleDateString()
              : "",
            lastMaintenanceDate: item.lastMaintenanceDate
              ? new Date(item.lastMaintenanceDate).toLocaleDateString()
              : "",
            zone: item.zone?.name,
            area: item.area?.name,
            campus: item.campus?.name,
            properties: item.properties,
          }))
        );
      }
    } catch (error) {
      console.error("Lỗi load assets:", error);
    }
  };

 
  // Load asset types
  const loadAssetTypes = async () => {
    try {
      const res = await assetTypeService.getAll();
      if (res.success && res.data?.assetTypes) {
        setAssetTypes(res.data.assetTypes);
      } else {
        setAssetTypes([]);
      }
    } catch (error) {
      console.error("loadAssetTypes error:", error);
      setAssetTypes([]);
    }
  };

  useEffect(() => {
    loadAssets();
    loadCampuses();
    loadAssetTypes(); // <-- gọi load asset types
  }, []);
  const handleCampusChange = async (campusId) => {
  setForm({ ...form, campus: campusId, area: "", zone: "" });
  setZones([]);

  try {
    const areasRes = await areasService.getAllByCampus(campusId);
    const areasData = areasRes.success && areasRes.data?.areas ? areasRes.data.areas : [];

    const buildingsRes = await buildingService.getAllByCampus(campusId);
    const buildingsData = buildingsRes.success && buildingsRes.data?.buildings ? buildingsRes.data.buildings : [];

    // Gộp 2 mảng
    const combined = [
      ...buildingsData.map((b) => ({ ...b, type: "building" })),
      ...areasData.map((a) => ({ ...a, type: "area" })),
    ];

    setLocations(combined);
  } catch (error) {
    console.error("loadLocations error:", error);
    setLocations([]);
  }
};


  // Load campuses
  const loadCampuses = async () => {
    try {
      const res = await campusService.getAll();
      if (res.success && res.data?.campuses) {
        setCampuses(res.data.campuses);
      } else {
        setCampuses([]);
      }
    } catch (error) {
      console.error("loadCampuses error:", error);
      setCampuses([]);
    }
  };

  // Load areas khi chọn campus
  useEffect(() => {
    if (form.campus) {
      loadAreas(form.campus);
      setForm({ ...form, area: "", zone: "" });
    } else {
      setAreas([]);
      setZones([]);
      setForm({ ...form, area: "", zone: "" });
    }
  }, [form.campus]);

  // Load zones khi chọn area
const handleLocationChange = (id, type) => {
  setForm((prev) => ({ ...prev, area: id, locationType: type, zone: "" }));
};



// Update useEffect load zones
useEffect(() => {
  const loadZones = async () => {
    if (!form.area || !form.locationType) {
      setZones([]);
      return;
    }

    try {
      let res;
      if (form.locationType === "building") {
        res = await zonesService.getAllZonesByBuilding(form.area);
      } else {
        // area không có zones
        setZones([]);
        return;
      }

      // Lấy từ res.data.zones
      if (res?.success && Array.isArray(res.data.zones)) {
        setZones(res.data.zones);
      } else {
        setZones([]);
      }
    } catch (error) {
      console.error("loadZones error:", error);
      setZones([]);
    }
  };

  loadZones();
}, [form.area, form.locationType]);






  // Delete
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

  // Create / Edit
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
      campus: "",
      area: "",
      zone: "",
      properties: {},
    });
    setOpen(true);
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
      assetType: row.assetType,
      assetCategory: row.assetCategory,
      image: row.image,
      warrantyEndDate: row.warrantyEndDate,
      lastMaintenanceDate: row.lastMaintenanceDate,
      campus: row.campus?._id || "",
      area: row.area?._id || "",
      zone: row.zone?._id || "",
      properties: row.properties,
    });
    setOpen(true);
  };

const handleSave = async () => {
  try {
    // Validate bắt buộc
    if (!form.assetType) {
      alert("Vui lòng chọn loại thiết bị (Asset Type).");
      return;
    }
    if (!form.assetCategory) {
      alert("Vui lòng chọn danh mục thiết bị (Asset Category).");
      return;
    }

    const payload = {
      ...form,
      area: form.area || null,
      zone: form.zone || null,
    };

    // Xóa các property không được backend chấp nhận
    delete payload.campus;
    delete payload.locationType;

    let res;
    if (editRow) {
      res = await assetService.update(editRow.rowId, payload);
      if (res.success) {
        await loadAssets();
        setOpen(false);
      } else {
        alert("Cập nhật thất bại: " + res.message);
      }
    } else {
      res = await assetService.create(payload);
      if (res.success) {
        await loadAssets();
        setOpen(false);
      } else {
        alert("Tạo thiết bị thất bại: " + res.message);
      }
    }
  } catch (error) {
    console.error("Lỗi lưu thiết bị:", error);
    alert("Đã xảy ra lỗi khi lưu thiết bị. Vui lòng thử lại.");
  }
};


  const columns = [
    { field: "id", headerName: "STT", width: 70 },
    { field: "name", headerName: "Tên thiết bị", flex: 1 },
    { field: "code", headerName: "Mã thiết bị", width: 120 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 180,
      renderCell: (params) => {
        const status = assetStatusMap[params.value] || {};
        return (
          <span
            style={{
              backgroundColor: status.color || "#ccc",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: "bold",
            }}
          >
            {status.label || params.value}
          </span>
        );
      },
    },
    { field: "description", headerName: "Mô tả", flex: 2 },
    { field: "serialNumber", headerName: "Số serial", width: 160 },
    { field: "brand", headerName: "Thương hiệu", width: 120 },
    { field: "assetType", headerName: "Loại thiết bị", width: 150 },
    { field: "assetCategory", headerName: "Danh mục", width: 150 },
    {
      field: "image",
      headerName: "Ảnh",
      width: 120,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="asset"
          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    { field: "zone", headerName: "Khu vực", width: 150 },
    { field: "area", headerName: "Area", width: 150 },
    { field: "campus", headerName: "Cơ sở", width: 150 },
    { field: "warrantyEndDate", headerName: "Hạn bảo hành", width: 150 },
    {
      field: "lastMaintenanceDate",
      headerName: "Ngày bảo trì gần nhất",
      width: 180,
    },
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
            setPropertiesDialog({
              open: true,
              properties: params.row.properties,
            })
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

      {/* Dialog Form */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editRow ? "Cập nhật thiết bị" : "Thêm thiết bị mới"}
        </DialogTitle>
        <DialogContent>
  <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
    {/* Tên thiết bị */}
    <TextField
      label="Tên thiết bị"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      fullWidth
    />

    {/* Mã thiết bị */}
    <TextField
      label="Mã thiết bị"
      value={form.code}
      onChange={(e) => setForm({ ...form, code: e.target.value })}
      fullWidth
    />

    {/* Thương hiệu */}
    <TextField
      label="Thương hiệu"
      value={form.brand}
      onChange={(e) => setForm({ ...form, brand: e.target.value })}
      fullWidth
    />

    {/* Số serial */}
    <TextField
      label="Số serial"
      value={form.serialNumber}
      onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
      fullWidth
    />

    {/* Mô tả */}
    <TextField
      label="Mô tả"
      value={form.description}
      onChange={(e) => setForm({ ...form, description: e.target.value })}
      fullWidth
      multiline
      rows={3}
      gridColumn="span 2"
    />
 <TextField
    select
    label="Loại thiết bị"
    value={form.assetType || ""}
    onChange={(e) => setForm({ ...form, assetType: e.target.value })}
    fullWidth
  >
    {assetTypes.map((type) => (
      <MenuItem key={type._id} value={type._id}>
        {type.name}
      </MenuItem>
    ))}
  </TextField>
    {/* Hạn bảo hành */}
    <TextField
      label="Hạn bảo hành"
      type="date"
      value={form.warrantyEndDate}
      onChange={(e) => setForm({ ...form, warrantyEndDate: e.target.value })}
      InputLabelProps={{ shrink: true }}
      fullWidth
    />

    {/* Ngày bảo trì gần nhất */}
    <TextField
      label="Ngày bảo trì gần nhất"
      type="date"
      value={form.lastMaintenanceDate}
      onChange={(e) =>
        setForm({ ...form, lastMaintenanceDate: e.target.value })
      }
      InputLabelProps={{ shrink: true }}
      fullWidth
    />

    {/* Upload ảnh */}
    <Box gridColumn="span 2">
      <Button variant="contained" component="label" fullWidth>
        {form.image ? `Đã chọn: ${form.image.name || form.image}` : "Tải ảnh lên"}
        <input
          type="file"
          hidden
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />
      </Button>
      {form.image && typeof form.image !== "string" && (
        <Typography variant="body2" mt={1}>
          Tên file: {form.image.name}
        </Typography>
      )}
    </Box>

    {/* Cơ sở */}
    <TextField
      select
      label="Cơ sở"
      value={form.campus || ""}
      onChange={(e) => handleCampusChange(e.target.value)}
      fullWidth
    >
      {campuses.map((campus) => (
        <MenuItem key={campus._id} value={campus._id}>
          {campus.name}
        </MenuItem>
      ))}
    </TextField>

    {/* Khu vực / Tòa nhà */}
    <TextField
      select
      label="Khu vực / Tòa nhà"
      value={form.area || ""}
      onChange={(e) => {
        const selected = locations.find((loc) => loc._id === e.target.value);
        if (selected) handleLocationChange(selected._id, selected.type);
      }}
      fullWidth
    >
      {locations.map((loc) => (
        <MenuItem key={loc._id} value={loc._id}>
          {loc.name} {loc.type === "building" ? "(Tòa nhà)" : "(Khu vực)"}
        </MenuItem>
      ))}
    </TextField>

    {/* Zone */}
    <TextField
      select
      label="Zone"
      value={form.zone || ""}
      onChange={(e) => setForm({ ...form, zone: e.target.value })}
      fullWidth
    >
      {zones.map((z) => (
        <MenuItem key={z._id} value={z._id}>
          {z.name}
        </MenuItem>
      ))}
    </TextField>

    {/* Trạng thái */}
    <TextField
      select
      label="Trạng thái"
      value={form.status}
      onChange={(e) => setForm({ ...form, status: e.target.value })}
      fullWidth
    >
      {Object.entries(assetStatusMap).map(([key, { label, color }]) => (
        <MenuItem key={key} value={key}>
          <Box display="flex" alignItems="center">
            <Box
              width={12}
              height={12}
              borderRadius="50%"
              bgcolor={color}
              mr={1}
            />
            {label}
          </Box>
        </MenuItem>
      ))}
    </TextField>
  </Box>
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
        onClose={() =>
          setPropertiesDialog({ ...propertiesDialog, open: false })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thông tin thuộc tính thiết bị</DialogTitle>
        <DialogContent>
          {Object.entries(propertiesDialog.properties || {}).map(
            ([key, value]) => (
              <Typography key={key}>
                <b>{key}:</b> {value}
              </Typography>
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setPropertiesDialog({ ...propertiesDialog, open: false })
            }
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
