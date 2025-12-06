import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createAsset, updateAsset } from "../api/asset.api";
import { getAssetTypes, type AssetTypeResponse } from "../api/assetType.api";
import {
  getAssetCategories,
  type AssetCategoryResponse,
} from "../api/assetCategories.api";
import type { AssetListItem } from "./useAssetData";
import { getCampuses, type Campus } from "@/user/report/api/campus.api";
import {
  getBuildingsByCampusId,
  getZoneAreasByBuildingId,
  type Building,
  type ZoneArea,
} from "@/user/report/api/building.api";
import {
  getOutdoorAreasByCampusId,
  type Area,
} from "@/user/report/api/area.api";

interface AssetAddFormValues {
  name: string;
  code: string;
  status: string;
  description: string;
  assetType: string;
  assetCategory: string;
  zone: string;
  area: string;
  image: string;
}

interface UseAssetAddFormOptions {
  open: boolean;
  mode: "add" | "edit";
  asset?: AssetListItem | null;
  onSuccess?: () => void;
  onClose: () => void;
}

const areaTypes = [
  { value: "outdoor", label: "Khu vực ngoài trời" },
  { value: "building", label: "Tòa nhà" },
];

/**
 * Custom hook quản lý state + submit logic cho AssetAddDialog
 */
export function useAssetAddForm({
  open,
  mode,
  asset,
  onSuccess,
  onClose,
}: UseAssetAddFormOptions) {
  const [form, setForm] = useState<AssetAddFormValues>({
    name: "",
    code: "",
    status: "IN_USE",
    description: "",
    assetType: "",
    assetCategory: "",
    zone: "",
    area: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState<AssetTypeResponse[]>([]);
  const [categories, setCategories] = useState<AssetCategoryResponse[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [originalImageUrl, setOriginalImageUrl] = useState("");

  // Cascading selection states
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [areaType, setAreaType] = useState<"outdoor" | "building" | "">("");
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [outdoorAreas, setOutdoorAreas] = useState<Area[]>([]);
  const [indoorZones, setIndoorZones] = useState<ZoneArea[]>([]);
  const [allBuildingZones, setAllBuildingZones] = useState<ZoneArea[]>([]);
  const [availableFloors, setAvailableFloors] = useState(0);

  // Load dropdowns khi mở dialog
  useEffect(() => {
    if (open) {
      void fetchDropdowns();
      void fetchCampuses();
    }
  }, [open]);

  const fetchDropdowns = async () => {
    try {
      const [typeRes, catRes] = await Promise.all([
        getAssetTypes(),
        getAssetCategories(),
      ]);

      if (!typeRes.success) {
        toast.error(typeRes.message || "Không thể tải loại thiết bị.");
      }
      if (!catRes.success) {
        toast.error(catRes.message || "Không thể tải danh mục thiết bị.");
      }

      setTypes(typeRes.data?.types || []);
      setCategories(catRes.data?.categories || []);
    } catch (err: unknown) {
      console.error("Lỗi khi tải dữ liệu chọn:", err);
      toast.error("Không thể tải danh sách chọn.");
    }
  };

  const fetchCampuses = async () => {
    try {
      const res = await getCampuses();
      setCampuses(res.data?.campuses || []);
    } catch (error) {
      console.error("Error fetching campuses:", error);
      setCampuses([]);
    }
  };

  // Reset when campus changes
  useEffect(() => {
    if (selectedCampus) {
      setAreaType("");
      setOutdoorAreas([]);
      setBuildings([]);
      setSelectedBuilding("");
      setSelectedFloor("");
      setIndoorZones([]);
      setForm((prev) => ({ ...prev, zone: "", area: "" }));
    }
  }, [selectedCampus]);

  // Fetch all zones when building is selected
  useEffect(() => {
    if (selectedBuilding && areaType === "building") {
      getZoneAreasByBuildingId(selectedBuilding)
        .then((res) => {
          if (res.data?.zones) {
            setAllBuildingZones(res.data.zones);
          }
        })
        .catch((error) => {
          console.error("Error fetching building zones:", error);
          setAllBuildingZones([]);
        });
      // Get available floors from selected building
      const building = buildings.find((b) => b._id === selectedBuilding);
      if (building) {
        setAvailableFloors(building.floor);
      }
    } else {
      setAllBuildingZones([]);
      setIndoorZones([]);
    }
  }, [selectedBuilding, areaType, buildings]);

  // Reset floor and zone when building changes
  useEffect(() => {
    if (selectedBuilding) {
      setSelectedFloor("");
      setForm((prev) => ({ ...prev, zone: "" }));
    } else {
      setIndoorZones([]);
      setAllBuildingZones([]);
    }
  }, [selectedBuilding]);

  // Fetch outdoor areas or buildings when area type changes
  useEffect(() => {
    if (selectedCampus && areaType === "outdoor") {
      getOutdoorAreasByCampusId(selectedCampus)
        .then((res) => {
          if (res.data?.areas) {
            setOutdoorAreas(res.data.areas);
          }
        })
        .catch((error) => {
          console.error("Error fetching outdoor areas:", error);
          setOutdoorAreas([]);
        });
    } else if (selectedCampus && areaType === "building") {
      getBuildingsByCampusId(selectedCampus)
        .then((res) => {
          if (res.data?.buildings) {
            setBuildings(res.data.buildings);
          }
        })
        .catch((error) => {
          console.error("Error fetching buildings:", error);
          setBuildings([]);
        });
    }
  }, [selectedCampus, areaType]);

  // Filter zones by floor when floor is selected
  useEffect(() => {
    if (
      selectedBuilding &&
      areaType === "building" &&
      allBuildingZones.length > 0
    ) {
      if (selectedFloor && selectedFloor !== "all") {
        // Filter zones by selected floor
        const floorNumber = parseInt(selectedFloor);
        const filteredZones = allBuildingZones.filter(
          (zone) => zone.floorLocation === floorNumber
        );
        setIndoorZones(filteredZones);
      } else {
        // Show all zones if no floor selected or "all" selected
        setIndoorZones(allBuildingZones);
      }
    }
  }, [selectedBuilding, selectedFloor, areaType, allBuildingZones]);

  // Nạp form khi edit
  useEffect(() => {
    if (mode === "edit" && asset && open) {
      const assetTypeId =
        typeof asset.assetType === "string"
          ? asset.assetType
          : asset.assetType?._id || "";

      const assetCategoryId =
        typeof asset.assetCategory === "string"
          ? asset.assetCategory
          : asset.assetCategory?._id || "";

      setForm({
        name: asset.name || "",
        code: asset.code || "",
        status: asset.status || "IN_USE",
        description: asset.description || "",
        assetType: assetTypeId,
        assetCategory: assetCategoryId,
        zone: asset.zone?._id || "",
        area: asset.area?._id || "",
        image: asset.image || "",
      });
      // Set preview for existing image
      if (asset.image) {
        const imageUrl = asset.image.startsWith("http")
          ? asset.image
          : `${import.meta.env.VITE_URL_UPLOADS || ""}${asset.image}`;
        setImagePreview(imageUrl);
        setOriginalImageUrl(asset.image); // Store original path for edit mode
      } else {
        setImagePreview("");
        setOriginalImageUrl("");
      }
      setImageFile(null);

      // Set location if available
      if (asset.zone) {
        // Try to determine campus and area type from zone
        // This might need additional API calls to get full zone info
        setAreaType("building");
      } else if (asset.area) {
        setAreaType("outdoor");
      }
    } else if (open) {
      setForm({
        name: "",
        code: "",
        status: "IN_USE",
        description: "",
        assetType: "",
        assetCategory: "",
        zone: "",
        area: "",
        image: "",
      });
      setImageFile(null);
      setImagePreview("");
      setOriginalImageUrl("");
      setSelectedCampus("");
      setAreaType("");
      setSelectedBuilding("");
      setSelectedFloor("");
    }
  }, [mode, asset, open]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (field: keyof AssetAddFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh");
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 10MB");
        return;
      }
      setImageFile(file);
      // Create preview URL
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
      // Clear image URL if file is selected
      setForm((prev) => ({ ...prev, image: "" }));
    } else {
      setImageFile(null);
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview("");
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Tên thiết bị là bắt buộc.");
      return false;
    }
    if (!form.assetType) {
      toast.error("Vui lòng chọn loại thiết bị.");
      return false;
    }
    if (!form.assetCategory) {
      toast.error("Vui lòng chọn danh mục thiết bị.");
      return false;
    }
    if (!form.zone && !form.area) {
      toast.error("Vui lòng chọn vị trí (khu vực hoặc area).");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("code", form.code.trim());
      formData.append("description", form.description.trim());
      formData.append("status", form.status);
      formData.append("assetType", form.assetType);
      formData.append("assetCategory", form.assetCategory);

      if (form.zone) {
        formData.append("zone", form.zone);
      }
      if (form.area) {
        formData.append("area", form.area);
      }

      // If new file is selected, upload it
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (mode === "edit" && originalImageUrl) {
        // Keep existing image URL for edit mode if no new file selected
        formData.append("image", originalImageUrl);
      } else if (form.image.trim()) {
        // Fallback: use form image URL if provided
        formData.append("image", form.image.trim());
      }

      const res =
        mode === "edit" && asset?._id
          ? await updateAsset(asset._id, formData)
          : await createAsset(formData);

      if (res.success) {
        toast.success(
          res.message ||
            (mode === "edit"
              ? "Cập nhật thiết bị thành công!"
              : "Thêm thiết bị thành công!")
        );
        onClose();
        onSuccess?.();
      } else {
        toast.error(res.message || "Thao tác không thành công.");
      }
    } catch (err: unknown) {
      console.error("❌ Lỗi khi lưu thiết bị:", err);
      const error = err as { response?: { data?: { message?: string } } };
      const msg =
        error.response?.data?.message || "Có lỗi xảy ra khi lưu thiết bị.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    types,
    categories,
    imageFile,
    imagePreview,
    handleChange,
    handleImageChange,
    handleSubmit,
    // Cascading selection
    campuses,
    selectedCampus,
    setSelectedCampus,
    areaType,
    setAreaType,
    areaTypes,
    buildings,
    selectedBuilding,
    setSelectedBuilding,
    selectedFloor,
    setSelectedFloor,
    availableFloors,
    outdoorAreas,
    indoorZones,
    setZone: (zoneId: string) => handleChange("zone", zoneId),
    setArea: (areaId: string) => handleChange("area", areaId),
  };
}
