import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAccountStatsDialog } from "../hooks";
import { AccountStatsDialogTabs } from "./AccountStatsDialogTabs";

interface AccountStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountStatsDialog({
  open,
  onOpenChange,
}: AccountStatsDialogProps) {
  const { stats, loading, timeType, setTimeType, activeRole, setActiveRole } =
    useAccountStatsDialog({ open });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Thống kê tài khoản</DialogTitle>
          <DialogDescription>
            Xem các biểu đồ và phân tích chi tiết về tài khoản trong hệ thống
          </DialogDescription>
        </DialogHeader>
        <AccountStatsDialogTabs
          stats={stats}
          loading={loading}
          timeType={timeType}
          setTimeType={setTimeType}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
        />
      </DialogContent>
    </Dialog>
  );
}
