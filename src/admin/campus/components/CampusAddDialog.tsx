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
import { Loader2 } from "lucide-react";
import { useCampusAddForm } from "../hooks";
import type { Campus } from "./CampusTable";

interface CampusAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: "add" | "edit";
  campus?: Campus;
}

export function CampusAddDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "add",
  campus,
}: CampusAddDialogProps) {
  const { form, errors, loading, managers, handleChange, handleSubmit } =
    useCampusAddForm({
      open,
      mode,
      campus,
      onSuccess,
      onClose: () => onOpenChange(false),
    });

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
            <Label htmlFor="name">
              Tên cơ sở <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="VD: Cơ sở Phạm Văn Chiêu"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={
                errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              Địa chỉ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              placeholder="VD: 12 Phạm Văn Chiêu, P4, Gò Vấp, TP.HCM"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className={
                errors.address
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="phone">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="VD: 0123456789"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={
                  errors.phone
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="VD: support@iuh.edu.vn"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Người quản lý */}
          <div className="space-y-2">
            <Label>
              Người quản lý <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.manager || undefined}
              onValueChange={(val) => handleChange("manager", val)}
            >
              <SelectTrigger
                className={
                  errors.manager ? "border-red-500 focus:ring-red-500" : ""
                }
              >
                <SelectValue placeholder="Chọn người quản lý" />
              </SelectTrigger>
              <SelectContent>
                {managers.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    Không có người quản lý nào
                  </div>
                ) : (
                  managers
                    .filter((m) => !!m._id)
                    .map((m) => (
                      <SelectItem key={m._id} value={m._id}>
                        {m.fullName} — {m.email}
                      </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>
            {errors.manager && (
              <p className="text-sm text-red-500">{errors.manager}</p>
            )}
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
