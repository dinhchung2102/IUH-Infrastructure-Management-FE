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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createCampus, updateCampus } from "../api/campus.api";
import { getAccounts } from "@/admin/account-management/api/account.api";

interface CampusAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: "add" | "edit";
  campus?: any;
}

export function CampusAddDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "add",
  campus,
}: CampusAddDialogProps) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    status: "ACTIVE",
    manager: "",
  });
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<any[]>([]);

  // 🧑‍💼 Lấy danh sách người quản lý campus (CAMPUS_ADMIN)
  useEffect(() => {
    if (open) fetchManagers();
  }, [open]);

  const fetchManagers = async () => {
    try {
      const res = await getAccounts({
        role: "CAMPUS_ADMIN",
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setManagers(res?.data?.accounts || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách quản lý:", err);
      toast.error("Không thể tải danh sách người quản lý.");
    }
  };

  // 🧭 Nếu là chỉnh sửa → nạp dữ liệu vào form
  useEffect(() => {
    if (mode === "edit" && campus) {
      setForm({
        name: campus.name || "",
        address: campus.address || "",
        phone: campus.phone || "",
        email: campus.email || "",
        status: campus.status || "ACTIVE",
        manager: campus.manager?._id || "",
      });
    } else {
      // reset khi thêm mới
      setForm({
        name: "",
        address: "",
        phone: "",
        email: "",
        status: "ACTIVE",
        manager: "",
      });
    }
  }, [mode, campus, open]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.address.trim()) {
      toast.error("Tên và địa chỉ là bắt buộc.");
      return false;
    }
    if (!/^\d{9,11}$/.test(form.phone)) {
      toast.error("Số điện thoại không hợp lệ.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Email không hợp lệ.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        status: form.status,
        manager: form.manager || null,
      };

      let res;
      if (mode === "edit" && campus?._id) {
        res = await updateCampus(campus._id, payload);
      } else {
        res = await createCampus(payload);
      }

      if (res?.success) {
        toast.success(mode === "edit" ? "Cập nhật cơ sở thành công!" : "Thêm cơ sở thành công!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res?.message || "Thao tác không thành công.");
      }
    } catch (err: any) {
      console.error("Lỗi khi lưu cơ sở:", err);
      if (err?.response?.status === 409)
        toast.error("Tên hoặc email cơ sở đã tồn tại.");
      else toast.error("Có lỗi xảy ra khi lưu cơ sở.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Chỉnh sửa cơ sở" : "Thêm cơ sở mới"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Cập nhật thông tin của cơ sở trong hệ thống."
              : "Điền đầy đủ thông tin để tạo cơ sở mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Tên cơ sở</Label>
            <Input
              id="name"
              placeholder="VD: Cơ sở Phạm Văn Chiêu"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              placeholder="VD: 12 Phạm Văn Chiêu, P4, Gò Vấp, TP.HCM"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                placeholder="VD: 0123456789"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="VD: support@iuh.edu.vn"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
          </div>

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

          {/* Người quản lý */}
          <div className="space-y-2">
            <Label>Người quản lý</Label>
            <Select
              value={form.manager || "none"}
              onValueChange={(val) => handleChange("manager", val === "none" ? "" : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn người quản lý" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không có người quản lý</SelectItem>
                {managers
                  .filter((m) => !!m._id)
                  .map((m) => (
                    <SelectItem key={m._id} value={m._id}>
                      {m.fullName} — {m.email}
                    </SelectItem>
                  ))}
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
              {mode === "edit" ? "Cập nhật" : "Thêm cơ sở"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
