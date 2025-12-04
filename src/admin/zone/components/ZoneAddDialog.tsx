"use client";

import { useState, useEffect, useMemo } from "react";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createZone, updateZone, type ZoneResponse } from "../api/zone.api";
import {
  getBuildings,
  type BuildingResponse,
} from "../../building-area/api/building.api";
import { getAreas, type AreaResponse } from "../../building-area/api/area.api";

interface ZoneAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: "add" | "edit";
  zone?: ZoneResponse;
}

export function ZoneAddDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "add",
  zone,
}: ZoneAddDialogProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
    location: "",
    zoneType: "FUNCTIONAL",
    floorLocation: "",
  });

  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<AreaResponse[]>([]);
  const [buildings, setBuildings] = useState<BuildingResponse[]>([]);
  const [selectedType, setSelectedType] = useState<"area" | "building" | null>(
    null
  );

  // Load areas when selectedType is "area"
  useEffect(() => {
    if (open && selectedType === "area") {
      fetchAreas();
    }
  }, [open, selectedType]);

  // Load buildings when selectedType is "building"
  useEffect(() => {
    if (open && selectedType === "building") {
      fetchBuildings();
    }
  }, [open, selectedType]);

  // Load data when editing
  useEffect(() => {
    if (open && mode === "edit" && zone) {
      const hasBuilding =
        zone.building &&
        (typeof zone.building === "object" ||
          typeof zone.building === "string");
      if (hasBuilding) {
        fetchBuildings();
      } else {
        const hasArea =
          zone.area &&
          (typeof zone.area === "object" || typeof zone.area === "string");
        if (hasArea) {
          fetchAreas();
        }
      }
    }
  }, [open, mode, zone]);

  const fetchAreas = async () => {
    try {
      const res = await getAreas({});
      setAreas(res?.data?.areas || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách khu vực:", err);
      toast.error("Không thể tải danh sách khu vực.");
      setAreas([]);
    }
  };

  const fetchBuildings = async () => {
    try {
      const res = await getBuildings({});
      setBuildings(res?.data?.buildings || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách tòa nhà:", err);
      toast.error("Không thể tải danh sách tòa nhà.");
      setBuildings([]);
    }
  };

  // ✏️ Khi chỉnh sửa
  useEffect(() => {
    if (mode === "edit" && zone) {
      const hasBuilding =
        zone.building &&
        (typeof zone.building === "object" ||
          typeof zone.building === "string");
      const hasArea =
        zone.area &&
        (typeof zone.area === "object" || typeof zone.area === "string");
      const type = hasBuilding ? "building" : hasArea ? "area" : null;
      setSelectedType(type);

      const locationId =
        (typeof zone.building === "object" && zone.building?._id) ||
        (typeof zone.building === "string" && zone.building) ||
        (typeof zone.area === "object" && zone.area?._id) ||
        (typeof zone.area === "string" && zone.area) ||
        "";

      setForm({
        name: zone.name || "",
        description: zone.description || "",
        status: zone.status || "ACTIVE",
        location: locationId,
        zoneType: zone.zoneType || "FUNCTIONAL",
        floorLocation:
          type === "building" && zone.floorLocation
            ? zone.floorLocation.toString()
            : "",
      });
    } else {
      setForm({
        name: "",
        description: "",
        status: "ACTIVE",
        location: "",
        zoneType: "FUNCTIONAL",
        floorLocation: "",
      });
      setSelectedType(null);
    }
  }, [mode, zone, open]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectLocation = (id: string) => {
    setForm((prev) => ({
      ...prev,
      location: id,
      // 🧹 Reset tầng nếu chọn Area
      floorLocation: selectedType === "area" ? "" : prev.floorLocation,
    }));
  };

  const handleTypeChange = (type: "area" | "building") => {
    setSelectedType(type);
    setForm((prev) => ({
      ...prev,
      location: "", // Reset location when changing type
      floorLocation: type === "area" ? "" : prev.floorLocation,
    }));
  };

  // Convert areas to combobox options
  const areaOptions = useMemo(
    () =>
      areas.map((area) => ({
        value: area._id,
        label: area.name,
      })),
    [areas]
  );

  // Convert buildings to combobox options
  const buildingOptions = useMemo(
    () =>
      buildings.map((building) => ({
        value: building._id,
        label: building.name,
      })),
    [buildings]
  );

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Tên zone là bắt buộc.");
      return false;
    }
    if (!form.location.trim()) {
      toast.error("Vui lòng chọn khu vực hoặc tòa nhà.");
      return false;
    }
    if (
      selectedType === "building" &&
      form.floorLocation &&
      isNaN(Number(form.floorLocation))
    ) {
      toast.error("Tầng phải là một số hợp lệ.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload: {
        name: string;
        description: string;
        status: "ACTIVE" | "INACTIVE";
        zoneType: "FUNCTIONAL" | "TECHNICAL" | "SERVICE" | "PUBLIC";
        area?: string;
        building?: string;
        floorLocation?: number;
      } = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status as "ACTIVE" | "INACTIVE",
        zoneType: form.zoneType as
          | "FUNCTIONAL"
          | "TECHNICAL"
          | "SERVICE"
          | "PUBLIC",
      };

      if (selectedType === "area") {
        payload.area = form.location;
      }
      if (selectedType === "building") {
        payload.building = form.location;
        if (form.floorLocation) {
          payload.floorLocation = Number(form.floorLocation);
        }
      }

      console.log("📤 Payload gửi lên:", payload);

      const res =
        mode === "edit" && zone?._id
          ? await updateZone(zone._id, payload)
          : await createZone(payload);

      if (res?.success) {
        toast.success(
          mode === "edit"
            ? "Cập nhật zone thành công!"
            : "Thêm zone thành công!"
        );
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res?.message || "Thao tác không thành công.");
      }
    } catch (err: unknown) {
      console.error("❌ Lỗi khi lưu zone:", err);
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi lưu zone.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Chỉnh sửa Zone" : "Thêm Zone mới"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Cập nhật thông tin khu vực trong hệ thống."
              : "Điền đầy đủ thông tin để tạo zone mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Tên zone */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên Zone</Label>
            <Input
              id="name"
              placeholder="VD: Nhà vệ sinh H1 hoặc Phòng kỹ thuật"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              placeholder="VD: Khu vực dịch vụ hoặc chức năng"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Type Selection (Area or Building) */}
          <div className="space-y-2">
            <Label>Loại</Label>
            <Select
              value={selectedType || ""}
              onValueChange={(val) =>
                handleTypeChange(val as "area" | "building")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại (Khu vực hoặc Tòa nhà)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Khu vực ngoài trời</SelectItem>
                <SelectItem value="building">Tòa nhà</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Area / Building Selection */}
          {selectedType && (
            <div className="space-y-2">
              <Label>
                {selectedType === "area" ? "Khu vực ngoài trời" : "Tòa nhà"}
              </Label>
              <Combobox
                options={
                  selectedType === "area" ? areaOptions : buildingOptions
                }
                value={form.location}
                onValueChange={handleSelectLocation}
                placeholder={
                  selectedType === "area"
                    ? "Chọn khu vực ngoài trời..."
                    : "Chọn tòa nhà..."
                }
              />
            </div>
          )}

          {/* Zone Type */}
          <div className="space-y-2">
            <Label>Loại Zone</Label>
            <Select
              value={form.zoneType}
              onValueChange={(val) => handleChange("zoneType", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FUNCTIONAL">
                  Chức năng (FUNCTIONAL)
                </SelectItem>
                <SelectItem value="TECHNICAL">Kỹ thuật (TECHNICAL)</SelectItem>
                <SelectItem value="SERVICE">Dịch vụ (SERVICE)</SelectItem>
                <SelectItem value="PUBLIC">Công cộng (PUBLIC)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Floor (chỉ hiển thị nếu là building) */}
          {selectedType === "building" && (
            <div className="space-y-2">
              <Label htmlFor="floorLocation">Tầng</Label>
              <Input
                id="floorLocation"
                placeholder="VD: 1"
                value={form.floorLocation}
                onChange={(e) => handleChange("floorLocation", e.target.value)}
              />
            </div>
          )}

          {/* Status */}
          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select
              value={form.status}
              onValueChange={(val) => handleChange("status", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Cập nhật" : "Thêm Zone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
