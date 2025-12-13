"use client";

import { useState, useEffect, useCallback } from "react";
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
import { updateMaintenance, getMaintenanceById } from "../api/maintenance.api";
import type {
  UpdateMaintenanceDto,
  Maintenance,
  MaintenanceStatus,
  MaintenancePriority,
} from "../types/maintenance.type";
import { getStaff } from "@/admin/staff-management/api/staff.api";
import type { StaffResponse } from "@/admin/staff-management/types/staff.type";
import { AssetCombobox } from "./AssetCombobox";

interface MaintenanceEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenanceId: string | null;
  onSuccess?: () => void;
}

export function MaintenanceEditDialog({
  open,
  onOpenChange,
  maintenanceId,
  onSuccess,
}: MaintenanceEditDialogProps) {
  const [form, setForm] = useState<UpdateMaintenanceDto>({
    asset: undefined,
    title: undefined,
    description: undefined,
    status: undefined,
    priority: undefined,
    scheduledDate: undefined,
    assignedTo: undefined,
    notes: undefined,
    completedDate: undefined,
    images: undefined,
  });

  const [staffList, setStaffList] = useState<StaffResponse[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMaintenance, setLoadingMaintenance] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);

  const fetchMaintenanceData = useCallback(async () => {
    if (!maintenanceId) return;

    try {
      setLoadingMaintenance(true);
      const response = await getMaintenanceById(maintenanceId);
      if (response.success && response.data) {
        const maintenance = response.data as Maintenance;

        // Convert scheduledDate to datetime-local format
        const scheduledDate = maintenance.scheduledDate
          ? new Date(maintenance.scheduledDate).toISOString().slice(0, 16)
          : "";

        // Convert completedDate to datetime-local format if exists
        const completedDate = maintenance.completedDate
          ? new Date(maintenance.completedDate).toISOString().slice(0, 16)
          : undefined;

        setForm({
          asset: maintenance.asset._id,
          title: maintenance.title,
          description: maintenance.description,
          status: maintenance.status,
          priority: maintenance.priority,
          scheduledDate: scheduledDate,
          notes: maintenance.notes || "",
          completedDate: completedDate,
        });

        setSelectedStaffIds(maintenance.assignedTo.map((staff) => staff._id));
        setExistingImages(maintenance.images || []);
      } else {
        toast.error("Không thể tải thông tin lịch bảo trì");
      }
    } catch (error) {
      console.error("Error fetching maintenance:", error);
      toast.error("Lỗi khi tải thông tin lịch bảo trì");
    } finally {
      setLoadingMaintenance(false);
    }
  }, [maintenanceId]);

  // Fetch maintenance data when dialog opens
  useEffect(() => {
    if (open && maintenanceId) {
      fetchMaintenanceData();
      fetchStaff();
    } else if (open && !maintenanceId) {
      toast.error("Không tìm thấy lịch bảo trì");
      onOpenChange(false);
    }
  }, [open, maintenanceId, fetchMaintenanceData, onOpenChange]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

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

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
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
    if (form.title !== undefined && form.title.trim().length < 5) {
      toast.error("Tiêu đề phải có ít nhất 5 ký tự");
      return false;
    }
    if (form.title !== undefined && form.title.trim().length > 200) {
      toast.error("Tiêu đề không được quá 200 ký tự");
      return false;
    }
    if (form.description !== undefined && form.description.trim().length < 10) {
      toast.error("Mô tả phải có ít nhất 10 ký tự");
      return false;
    }
    if (
      form.description !== undefined &&
      form.description.trim().length > 1000
    ) {
      toast.error("Mô tả không được quá 1000 ký tự");
      return false;
    }
    if (form.notes !== undefined && form.notes.length > 500) {
      toast.error("Ghi chú không được quá 500 ký tự");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!maintenanceId) return;

    try {
      setLoading(true);

      const data: UpdateMaintenanceDto = {
        ...form,
        assignedTo: selectedStaffIds.length > 0 ? selectedStaffIds : undefined,
        images: imageFiles.length > 0 ? imageFiles : undefined,
      };

      // Remove undefined fields
      Object.keys(data).forEach((key) => {
        if (data[key as keyof UpdateMaintenanceDto] === undefined) {
          delete data[key as keyof UpdateMaintenanceDto];
        }
      });

      const response = await updateMaintenance(maintenanceId, data);
      if (response.success) {
        toast.success("Cập nhật lịch bảo trì thành công!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(
          response.message || "Cập nhật lịch bảo trì không thành công"
        );
      }
    } catch (error) {
      console.error("Error updating maintenance:", error);
      toast.error("Lỗi khi cập nhật lịch bảo trì");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setForm({
      asset: undefined,
      title: undefined,
      description: undefined,
      status: undefined,
      priority: undefined,
      scheduledDate: undefined,
      assignedTo: undefined,
      notes: undefined,
      completedDate: undefined,
      images: undefined,
    });
    setSelectedStaffIds([]);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa lịch bảo trì</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin lịch bảo trì. Chỉ điền các trường muốn thay đổi.
          </DialogDescription>
        </DialogHeader>

        {loadingMaintenance ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Asset Selection */}
            <div className="space-y-2">
              <Label>Thiết bị</Label>
              <AssetCombobox
                value={form.asset || ""}
                onValueChange={(value) => setForm({ ...form, asset: value })}
                placeholder="Chọn thiết bị"
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>Tiêu đề</Label>
              <Input
                placeholder="VD: Bảo trì định kỳ máy lạnh"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Từ 5 đến 200 ký tự
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                placeholder="Mô tả chi tiết công việc bảo trì..."
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Từ 10 đến 1000 ký tự
              </p>
            </div>

            {/* Scheduled Date, Completed Date, Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày dự kiến</Label>
                <Input
                  type="datetime-local"
                  value={form.scheduledDate || ""}
                  onChange={(e) =>
                    setForm({ ...form, scheduledDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Ngày hoàn thành</Label>
                <Input
                  type="datetime-local"
                  value={form.completedDate || ""}
                  onChange={(e) =>
                    setForm({ ...form, completedDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={form.status || ""}
                  onValueChange={(value) =>
                    setForm({ ...form, status: value as MaintenanceStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Chờ thực hiện</SelectItem>
                    <SelectItem value="IN_PROGRESS">Đang thực hiện</SelectItem>
                    <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                    <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                    <SelectItem value="OVERDUE">Quá hạn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Độ ưu tiên</Label>
                <Select
                  value={form.priority || ""}
                  onValueChange={(value) =>
                    setForm({ ...form, priority: value as MaintenancePriority })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn độ ưu tiên" />
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
                value={form.notes || ""}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
              />
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <Label>Hình ảnh hiện có</Label>
                <div className="grid grid-cols-4 gap-2">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={`${
                          import.meta.env.VITE_URL_UPLOADS || ""
                        }${image}`}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-image.png";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div className="space-y-2">
              <Label>Thêm hình ảnh mới</Label>
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
                  <span className="text-sm text-gray-500">
                    Click để chọn ảnh
                  </span>
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
                onClick={handleClose}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading || loadingMaintenance}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
