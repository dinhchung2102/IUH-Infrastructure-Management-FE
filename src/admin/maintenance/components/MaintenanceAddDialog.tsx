"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { createMaintenance } from "../api/maintenance.api";
import type { CreateMaintenanceDto } from "../types/maintenance.type";
import { getAssets } from "@/admin/asset-management/api/asset.api";
import { getStaff } from "@/admin/staff-management/api/staff.api";
import type { AssetResponse } from "@/admin/asset-management/api/asset.api";
import type { StaffResponse } from "@/admin/staff-management/types/staff.type";

interface MaintenanceAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MaintenanceAddDialog({
  open,
  onOpenChange,
  onSuccess,
}: MaintenanceAddDialogProps) {
  const [form, setForm] = useState<CreateMaintenanceDto>({
    asset: "",
    title: "",
    description: "",
    status: "PENDING",
    priority: "MEDIUM",
    scheduledDate: "",
    assignedTo: [],
    notes: "",
    images: [],
  });

  const [assets, setAssets] = useState<AssetResponse[]>([]);
  const [staffList, setStaffList] = useState<StaffResponse[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setForm({
        asset: "",
        title: "",
        description: "",
        status: "PENDING",
        priority: "MEDIUM",
        scheduledDate: "",
        assignedTo: [],
        notes: "",
        images: [],
      });
      setSelectedStaffIds([]);
      setImageFiles([]);
      setImagePreviews([]);
      fetchAssets();
      fetchStaff();
    } else {
      // Cleanup preview URLs
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    }
  }, [open]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const fetchAssets = async () => {
    try {
      setLoadingAssets(true);
      const response = await getAssets({ limit: 1000 });
      if (response.success && response.data) {
        setAssets(response.data.assets || []);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Không thể tải danh sách thiết bị");
    } finally {
      setLoadingAssets(false);
    }
  };

  const fetchStaff = async () => {
    try {
      setLoadingStaff(true);
      const response = await getStaff({ page: 1, limit: 1000 });
      if (response.success && response.data) {
        setStaffList(response.data.accounts || []);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} không phải là file ảnh`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} vượt quá 10MB`);
        return false;
      }
      return true;
    });

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleStaff = (staffId: string) => {
    setSelectedStaffIds((prev) => {
      if (prev.includes(staffId)) {
        return prev.filter((id) => id !== staffId);
      } else {
        return [...prev, staffId];
      }
    });
  };

  const validateForm = (): boolean => {
    if (!form.asset) {
      toast.error("Vui lòng chọn thiết bị");
      return false;
    }
    if (!form.title || form.title.trim().length < 5) {
      toast.error("Tiêu đề phải có ít nhất 5 ký tự");
      return false;
    }
    if (form.title.trim().length > 200) {
      toast.error("Tiêu đề không được quá 200 ký tự");
      return false;
    }
    if (!form.description || form.description.trim().length < 10) {
      toast.error("Mô tả phải có ít nhất 10 ký tự");
      return false;
    }
    if (form.description.trim().length > 1000) {
      toast.error("Mô tả không được quá 1000 ký tự");
      return false;
    }
    if (!form.scheduledDate) {
      toast.error("Vui lòng chọn ngày dự kiến bảo trì");
      return false;
    }
    const scheduledDate = new Date(form.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (scheduledDate < today) {
      toast.error("Ngày dự kiến bảo trì phải là hôm nay hoặc trong tương lai");
      return false;
    }
    if (form.notes && form.notes.length > 500) {
      toast.error("Ghi chú không được quá 500 ký tự");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const data: CreateMaintenanceDto = {
        ...form,
        assignedTo: selectedStaffIds,
        images: imageFiles,
      };

      const response = await createMaintenance(data);
      if (response.success) {
        toast.success("Tạo lịch bảo trì thành công!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Tạo lịch bảo trì không thành công");
      }
    } catch (error) {
      console.error("Error creating maintenance:", error);
      toast.error("Lỗi khi tạo lịch bảo trì");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm lịch bảo trì</DialogTitle>
          <DialogDescription>
            Điền đầy đủ thông tin để tạo lịch bảo trì mới.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Asset Selection */}
          <div className="space-y-2">
            <Label>
              Thiết bị <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.asset}
              onValueChange={(value) => setForm({ ...form, asset: value })}
              disabled={loadingAssets}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn thiết bị" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset._id} value={asset._id}>
                    {asset.name} ({asset.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="VD: Bảo trì định kỳ máy lạnh"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">Từ 5 đến 200 ký tự</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>
              Mô tả <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Mô tả chi tiết công việc bảo trì..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              Từ 10 đến 1000 ký tự
            </p>
          </div>

          {/* Scheduled Date & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Ngày dự kiến <span className="text-red-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                value={form.scheduledDate}
                onChange={(e) =>
                  setForm({ ...form, scheduledDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Độ ưu tiên</Label>
              <Select
                value={form.priority}
                onValueChange={(value) =>
                  setForm({ ...form, priority: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Thấp</SelectItem>
                  <SelectItem value="MEDIUM">Trung bình</SelectItem>
                  <SelectItem value="HIGH">Cao</SelectItem>
                  <SelectItem value="CRITICAL">Khẩn cấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assigned Staff */}
          <div className="space-y-2">
            <Label>Người phụ trách</Label>
            <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
              {loadingStaff ? (
                <p className="text-sm text-muted-foreground">Đang tải...</p>
              ) : staffList.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Không có nhân viên nào
                </p>
              ) : (
                <div className="space-y-2">
                  {staffList.map((staff) => (
                    <label
                      key={staff._id}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStaffIds.includes(staff._id)}
                        onChange={() => handleToggleStaff(staff._id)}
                        className="rounded"
                      />
                      <span className="text-sm">
                        {staff.fullName} ({staff.email})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Ghi chú</Label>
            <Textarea
              placeholder="Ghi chú bổ sung (tối đa 500 ký tự)..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
            />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Hình ảnh</Label>
            <div className="space-y-2">
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label
                htmlFor="images"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click để chọn ảnh</span>
                <span className="text-xs text-gray-400 mt-1">
                  JPEG, PNG, GIF, WebP tối đa 10MB
                </span>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tạo lịch bảo trì
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
