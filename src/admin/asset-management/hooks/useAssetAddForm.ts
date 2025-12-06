import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createAsset, updateAsset, type AssetResponse } from "../api/asset.api";
import { getAssetTypes, type AssetTypeResponse } from "../api/assetType.api";
import {
  getAssetCategories,
  type AssetCategoryResponse,
} from "../api/assetCategories.api";
import {
  getAreas,
  type AreaResponse,
} from "@/admin/building-area/api/area.api";
import { getZones, type ZoneResponse } from "@/admin/zone/api/zone.api";
import type { AssetListItem } from "./useAssetData";

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
  const [zones, setZones] = useState<ZoneResponse[]>([]);
  const [areas, setAreas] = useState<AreaResponse[]>([]);

  // Load dropdowns khi mở dialog
  useEffect(() => {
    if (open) {
      void fetchDropdowns();
    }
  }, [open]);

  const fetchDropdowns = async () => {
    try {
      const [typeRes, catRes, zoneRes, areaRes] = await Promise.all([
        getAssetTypes(),
        getAssetCategories(),
        getZones(),
        getAreas(),
      ]);

      if (!typeRes.success) {
        toast.error(typeRes.message || "Không thể tải loại thiết bị.");
      }
      if (!catRes.success) {
        toast.error(catRes.message || "Không thể tải danh mục thiết bị.");
      }
      if (!zoneRes.success) {
        toast.error(zoneRes.message || "Không thể tải danh sách khu vực.");
      }
      if (!areaRes.success) {
        toast.error(areaRes.message || "Không thể tải danh sách area.");
      }

      setTypes(typeRes.data?.types || []);
      setCategories(catRes.data?.categories || []);
      setZones(zoneRes.data?.zones || []);
      setAreas(areaRes.data?.areas || []);
    } catch (err: unknown) {
      console.error("Lỗi khi tải dữ liệu chọn:", err);
      toast.error("Không thể tải danh sách chọn.");
    }
  };

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
    }
  }, [mode, asset, open]);

  const handleChange = (field: keyof AssetAddFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      type AssetPayload = Partial<AssetResponse> & {
        assetCategory?: string;
        image?: string;
      };

      const payload: AssetPayload = {
        name: form.name.trim(),
        code: form.code.trim(),
        description: form.description.trim(),
        status: form.status as AssetResponse["status"],
        assetType: form.assetType,
        assetCategory: form.assetCategory,
        image: form.image,
      };

      if (form.zone)
        payload.zone = form.zone as unknown as AssetResponse["zone"];
      if (form.area)
        payload.area = form.area as unknown as AssetResponse["area"];

      const res =
        mode === "edit" && asset?._id
          ? await updateAsset(asset._id, payload)
          : await createAsset(payload);

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
    zones,
    areas,
    handleChange,
    handleSubmit,
  };
}
