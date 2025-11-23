import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCampusStatsDialog } from "../hooks";
import { CampusStatsDialogTabs } from "./CampusStatsDialogTabs";

interface CampusStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampusStatsDialog({
  open,
  onOpenChange,
}: CampusStatsDialogProps) {
  const {
    loading,
    activeStatus,
    setActiveStatus,
    statusData,
    activeStatusIndex,
    timeData,
  } = useCampusStatsDialog({ open });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Thống kê cơ sở</DialogTitle>
          <DialogDescription>
            Xem các biểu đồ và thông tin tổng quan về cơ sở
          </DialogDescription>
        </DialogHeader>

        <CampusStatsDialogTabs
          loading={loading}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          statusData={statusData}
          activeStatusIndex={activeStatusIndex}
          timeData={timeData}
        />
      </DialogContent>
    </Dialog>
  );
}
