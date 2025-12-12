import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { cancelAuditLog } from "../api/audit.api";
import type { AuditLog } from "../types/audit.type";

interface CancelAuditDialogProps {
  audit: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelSuccess?: () => void;
}

export function CancelAuditDialog({
  audit,
  open,
  onOpenChange,
  onCancelSuccess,
}: CancelAuditDialogProps) {
  const [cancelReason, setCancelReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    if (!audit) return;

    // Validation
    if (!cancelReason.trim()) {
      setError("Vui lòng nhập lý do hủy bỏ");
      return;
    }

    if (cancelReason.trim().length < 5) {
      setError("Lý do hủy bỏ phải có ít nhất 5 ký tự");
      return;
    }

    if (cancelReason.trim().length > 500) {
      setError("Lý do hủy bỏ không được vượt quá 500 ký tự");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await cancelAuditLog(audit._id, {
        cancelReason: cancelReason.trim(),
      });
      toast.success("Hủy bỏ nhiệm vụ thành công!");
      setCancelReason("");
      onOpenChange(false);
      if (onCancelSuccess) {
        onCancelSuccess();
      }
    } catch (error: any) {
      console.error("Error cancelling audit:", error);
      const errorMessage =
        error.response?.data?.message || "Không thể hủy bỏ nhiệm vụ";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !loading) {
      setCancelReason("");
      setError("");
    }
    onOpenChange(newOpen);
  };

  if (!audit) return null;

  // Check if audit can be cancelled
  const canCancel = audit.status === "PENDING" || audit.status === "IN_PROGRESS";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Hủy bỏ nhiệm vụ
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn hủy bỏ nhiệm vụ này không? Vui lòng nhập lý do hủy bỏ.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Audit Info */}
          <div className="bg-muted/50 rounded-lg p-3 border">
            <p className="text-sm font-medium mb-1">Nhiệm vụ:</p>
            <p className="text-sm text-foreground">{audit.subject}</p>
          </div>

          {/* Cancel Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="cancelReason" className="text-sm font-medium">
              Lý do hủy bỏ <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="cancelReason"
              placeholder="Nhập lý do hủy bỏ nhiệm vụ (tối thiểu 5 ký tự, tối đa 500 ký tự)"
              value={cancelReason}
              onChange={(e) => {
                setCancelReason(e.target.value);
                setError("");
              }}
              className="min-h-[120px] resize-none"
              disabled={loading || !canCancel}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {cancelReason.length}/500 ký tự
              </p>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
          </div>

          {/* Warning if cannot cancel */}
          {!canCancel && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                Nhiệm vụ này không thể hủy bỏ vì đã ở trạng thái{" "}
                {audit.status === "COMPLETED" ? "hoàn thành" : "đã hủy"}.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={loading || !canCancel || !cancelReason.trim()}
          >
            {loading ? "Đang xử lý..." : "Xác nhận hủy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

