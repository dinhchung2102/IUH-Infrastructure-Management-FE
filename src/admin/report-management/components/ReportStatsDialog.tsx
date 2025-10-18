import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReportStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportStatsDialog({
  open,
  onOpenChange,
}: ReportStatsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thống kê báo cáo chi tiết</DialogTitle>
          <DialogDescription>
            Xem các thống kê và biểu đồ chi tiết về báo cáo sự cố
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Placeholder - TODO: Implement charts */}
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
            <p className="text-muted-foreground">
              Biểu đồ thống kê sẽ được hiển thị tại đây
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              (Tính năng đang được phát triển)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
