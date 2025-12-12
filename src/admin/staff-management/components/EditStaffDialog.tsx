import { useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { updateStaff } from "../api/staff-actions.api";
import type { UpdateStaffDto, StaffResponse } from "../types/staff.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRoles } from "@/hooks/use-roles";
import { converRoleToDisplay } from "@/utils/convertDisplay.util";
import type { RoleName } from "@/types/role.enum";

interface EditStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffResponse | null;
  onSuccess?: () => void;
}

export function EditStaffDialog({
  open,
  onOpenChange,
  staff,
  onSuccess,
}: EditStaffDialogProps) {
  const { roles } = useRoles();
  const [form, setForm] = useState<UpdateStaffDto>({
    fullName: "",
    role: undefined,
    phoneNumber: "",
    address: "",
    gender: undefined,
    avatar: "",
    dateOfBirth: "",
  });
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // Filter out GUEST role
  const availableRoles = roles.filter(
    (role) => role.isActive && role.roleName !== "GUEST"
  );

  // Get avatar URL helper
  const getAvatarUrl = (avatar?: string) => {
    if (!avatar) return undefined;
    return avatar.startsWith("http")
      ? avatar
      : `${import.meta.env.VITE_URL_UPLOADS}${avatar}`;
  };

  // Load staff data when dialog opens
  useEffect(() => {
    if (open && staff) {
      setForm({
        fullName: staff.fullName || "",
        role: staff.role?.roleName,
        phoneNumber: staff.phoneNumber || "",
        address: staff.address || "",
        gender: staff.gender,
        avatar: staff.avatar || "",
        dateOfBirth: staff.dateOfBirth
          ? staff.dateOfBirth.split("T")[0] // Convert to YYYY-MM-DD format for input[type="date"]
          : "",
      });

      // Set avatar preview
      if (staff.avatar) {
        setAvatarPreview(getAvatarUrl(staff.avatar) || "");
      } else {
        setAvatarPreview("");
      }
      setAvatarFile(null);
    }
  }, [open, staff]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (avatarPreview && !staff?.avatar) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview, staff]);

  const handleChange = (
    field: keyof UpdateStaffDto,
    value: string | undefined
  ) => {
    setForm((prev) => ({ ...prev, [field]: value || undefined }));
  };

  // Handle avatar file change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  // Remove avatar
  const handleRemoveAvatar = () => {
    if (avatarPreview && !staff?.avatar) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setAvatarPreview("");
    handleChange("avatar", "");
  };

  const validateForm = (): boolean => {
    // Full name validation
    if (form.fullName && form.fullName.trim().length < 2) {
      toast.error("Họ tên phải có ít nhất 2 ký tự");
      return false;
    }
    if (form.fullName && form.fullName.trim().length > 100) {
      toast.error("Họ tên không được quá 100 ký tự");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff || !validateForm()) return;

    try {
      setLoading(true);

      // Create FormData for file upload
      const formData = new FormData();

      // Always send fullName and role (required fields)
      if (form.fullName?.trim()) {
        formData.append("fullName", form.fullName.trim());
      }
      if (form.role) {
        // Find roleId from roleName
        const selectedRole = availableRoles.find(
          (r) => r.roleName === form.role
        );
        if (selectedRole) {
          formData.append("role", selectedRole._id);
        } else {
          toast.error("Không tìm thấy vai trò được chọn");
          setLoading(false);
          return;
        }
      }

      // Add optional fields
      if (form.phoneNumber !== undefined) {
        formData.append("phoneNumber", form.phoneNumber?.trim() || "");
      }
      if (form.address !== undefined) {
        formData.append("address", form.address?.trim() || "");
      }
      if (form.gender !== undefined) {
        formData.append("gender", form.gender || "");
      }
      if (form.dateOfBirth !== undefined) {
        formData.append("dateOfBirth", form.dateOfBirth || "");
      }

      // Add avatar file if selected
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await updateStaff(staff._id, formData);

      if (res?.success) {
        toast.success("Cập nhật thông tin nhân viên thành công!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res?.message || "Cập nhật thông tin không thành công.");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật nhân viên:", err);
      const error = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin nhân viên.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin nhân viên</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin của nhân viên trong hệ thống.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-3 pb-4 border-b">
            <div className="relative">
              <label htmlFor="avatar" className="cursor-pointer">
                <Avatar className="size-24 border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Avatar preview" />
                  ) : (
                    <AvatarFallback className="text-sm bg-muted">
                      {staff.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "??"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md z-10"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              PNG, JPG tối đa 5MB
            </p>
          </div>

          {/* Full Name & Role */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Họ và tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="VD: Nguyễn Văn A"
                value={form.fullName || ""}
                onChange={(e) => handleChange("fullName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>
                Vai trò <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.role || ""}
                onValueChange={(val) => handleChange("role", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem
                      key={role._id}
                      value={role.roleName}
                      className="cursor-pointer"
                    >
                      {converRoleToDisplay(role.roleName as RoleName)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Gender & Date of Birth */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label>Giới tính</Label>
              <RadioGroup
                value={form.gender || ""}
                onValueChange={(val) =>
                  handleChange("gender", val || undefined)
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MALE" id="male" />
                  <Label htmlFor="male" className="cursor-pointer font-normal">
                    Nam
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FEMALE" id="female" />
                  <Label
                    htmlFor="female"
                    className="cursor-pointer font-normal"
                  >
                    Nữ
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Ngày sinh</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={form.dateOfBirth || ""}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              />
            </div>
          </div>

          {/* Phone Number & Address */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                placeholder="VD: 0123456789"
                value={form.phoneNumber || ""}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                placeholder="VD: Quận 12, TP.HCM"
                value={form.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={staff.email}
              disabled
              className="bg-muted cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email không thể thay đổi
            </p>
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
              Cập nhật
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
