"use client";

import { useState } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

export function MaintenanceAddDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (event: any) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    device: "",
    date: "",
    priority: "MEDIUM",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.device || !form.date)
      return toast.error("Vui lòng điền đầy đủ thông tin.");

    const newEvent = {
      id: Date.now().toString(),
      title: form.title,
      device: form.device,
      start: form.date,
      status: "PENDING",
      priority: form.priority,
    };
    onAdd(newEvent);
    onOpenChange(false);
    toast.success("Đã thêm lịch bảo trì!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Thêm lịch bảo trì</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết cho Nhiệm vụ.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label>Tên công việc</Label>
            <Input
              placeholder="VD: Bảo trì máy lạnh"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Thiết bị</Label>
            <Input
              placeholder="VD: Máy lạnh phòng họp A1"
              value={form.device}
              onChange={(e) => setForm({ ...form, device: e.target.value })}
            />
          </div>
          <div>
            <Label>Ngày dự kiến</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <Label>Ưu tiên</Label>
            <Select
              value={form.priority}
              onValueChange={(val) => setForm({ ...form, priority: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn mức độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">Cao</SelectItem>
                <SelectItem value="MEDIUM">Trung bình</SelectItem>
                <SelectItem value="LOW">Thấp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">Thêm</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
