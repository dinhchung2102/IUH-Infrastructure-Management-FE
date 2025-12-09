import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateReportStatus } from "../api/report.api";
import type { Report } from "../types/report.type";

interface RejectReportDialogProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RejectReportDialog({
  report,
  open,
  onOpenChange,
  onSuccess,
}: RejectReportDialogProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    if (!report) return;

    try {
      setSubmitting(true);
      await updateReportStatus(report._id, "REJECTED", reason.trim());
      toast.success("Từ chối báo cáo thành công!");
      onSuccess();
      onOpenChange(false);
      // Reset form
      setReason("");
    } catch (error) {
      console.error("Error rejecting report:", error);
      toast.error("Không thể từ chối báo cáo");
    } finally {
      setSubmitting(false);
    }
  };

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Từ chối báo cáo
          </DialogTitle>
          <DialogDescription>
            Nhập lý do từ chối báo cáo này. Lý do này sẽ được gửi đến người báo cáo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Lý do từ chối <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Ví dụ: Báo cáo không đủ thông tin, thiết bị không thuộc phạm vi quản lý..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-white min-h-[120px]"
              rows={5}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {reason.length}/500 ký tự
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            onClick={handleReject}
            disabled={submitting || !reason.trim()}
            className="bg-red-600 hover:bg-red-700 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang từ chối...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Từ chối
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

