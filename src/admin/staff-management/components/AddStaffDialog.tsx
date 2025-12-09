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
import { Loader2, Copy, RefreshCw, X, Plus } from "lucide-react";
import { createStaff } from "../api/staff-actions.api";
import type { CreateStaffDto } from "../types/staff.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRoles } from "@/hooks/use-roles";
import { converRoleToDisplay } from "@/utils/convertDisplay.util";
import type { RoleName } from "@/types/role.enum";

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddStaffDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddStaffDialogProps) {
  const { roles } = useRoles();
  const [form, setForm] = useState<CreateStaffDto>({
    email: "",
    password: "",
    fullName: "",
    role: "STAFF",
    phoneNumber: "",
    address: "",
    gender: undefined,
    avatar: "",
  });
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // Filter out GUEST role
  const availableRoles = roles.filter(
    (role) => role.isActive && role.roleName !== "GUEST"
  );

  // Generate random password
  const generatePassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  // Reset form khi mở dialog
  useEffect(() => {
    if (open) {
      const newPassword = generatePassword();
      setForm({
        email: "",
        password: newPassword,
        fullName: "",
        role: "STAFF",
        phoneNumber: "",
        address: "",
        gender: undefined,
        avatar: "",
      });

      setAvatarFile(null);
      setAvatarPreview("");
    }
  }, [open]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleChange = (field: keyof CreateStaffDto, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setAvatarPreview("");
  };

  // Copy password to clipboard
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(form.password);
    toast.success("Đã sao chép mật khẩu");
  };

  // Regenerate password
  const handleRegeneratePassword = () => {
    const newPassword = generatePassword();
    handleChange("password", newPassword);
    toast.success("Đã tạo mật khẩu mới");
  };

  const validateForm = (): boolean => {
    // Email validation
    if (!form.email.trim()) {
      toast.error("Email không được để trống");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Email không hợp lệ");
      return false;
    }

    // Password validation
    if (!form.password.trim()) {
      toast.error("Mật khẩu không được để trống");
      return false;
    }
    if (form.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    // Full name validation
    if (!form.fullName.trim()) {
      toast.error("Họ tên không được để trống");
      return false;
    }
    if (form.fullName.trim().length < 2) {
      toast.error("Họ tên phải có ít nhất 2 ký tự");
      return false;
    }
    if (form.fullName.trim().length > 100) {
      toast.error("Họ tên không được quá 100 ký tự");
      return false;
    }

    // Role validation
    if (!form.role) {
      toast.error("Vai trò không được để trống");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("email", form.email.trim());
      formData.append("password", form.password);
      formData.append("fullName", form.fullName.trim());
      formData.append("role", form.role);

      // Add optional fields only if they have values
      if (form.phoneNumber?.trim()) {
        formData.append("phoneNumber", form.phoneNumber.trim());
      }
      if (form.address?.trim()) {
        formData.append("address", form.address.trim());
      }
      if (form.gender) {
        formData.append("gender", form.gender);
      }

      // Add avatar file if selected
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await createStaff(formData);

      if (res?.success) {
        toast.success("Thêm nhân sự thành công!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res?.message || "Thêm nhân sự không thành công.");
      }
    } catch (err) {
      console.error("Lỗi khi thêm nhân sự:", err);
      const error = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (error?.response?.status === 409) {
        toast.error("Email đã tồn tại trong hệ thống.");
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi thêm nhân sự.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm nhân sự mới</DialogTitle>
          <DialogDescription>
            Điền đầy đủ thông tin để tạo tài khoản nhân sự mới trong hệ thống.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Avatar Upload - At the top */}
          <div className="flex flex-col items-center space-y-3 pb-4 border-b">
            <div className="relative">
              <label htmlFor="avatar" className="cursor-pointer">
                <Avatar className="size-24 border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Avatar preview" />
                  ) : (
                    <AvatarFallback className="text-sm flex flex-col items-center justify-center gap-1 bg-muted">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-medium">
                        Thêm ảnh
                      </span>
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

          {/* Email & Full Name on same row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="VD: nhanvien@iuh.edu.vn"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">
                Họ và tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="VD: Nguyễn Văn A"
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password - Auto generated with copy button */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Mật khẩu <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="password"
                type="text"
                value={form.password}
                readOnly
                className="font-mono bg-muted"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopyPassword}
                title="Sao chép mật khẩu"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleRegeneratePassword}
                title="Tạo mật khẩu mới"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Mật khẩu được tạo tự động. Click biểu tượng để sao chép hoặc tạo
              mới.
            </p>
          </div>

          {/* Role & Gender on same row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Vai trò <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.role}
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

            <div className="space-y-3">
              <Label>Giới tính</Label>
              <RadioGroup
                value={form.gender || ""}
                onValueChange={(val) => handleChange("gender", val)}
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
          </div>

          {/* Phone Number & Address */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                placeholder="VD: 0123456789"
                value={form.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                placeholder="VD: Quận 12, TP.HCM"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
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
              Thêm nhân sự
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
