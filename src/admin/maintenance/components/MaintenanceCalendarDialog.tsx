"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MaintenanceCalendar } from "./MaintenanceCalendar";
import { MaintenanceDayDetailDialog } from "./MaintenanceDayDetailDialog";

interface MaintenanceCalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: Array<{
    id: string;
    title: string;
    start: string;
    status: string;
    priority: string;
    asset: string;
  }>;
}

export function MaintenanceCalendarDialog({
  open,
  onOpenChange,
  events,
}: MaintenanceCalendarDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<
    Array<{
      id: string;
      title: string;
      start: string;
      status: string;
      priority: string;
      asset: string;
    }>
  >([]);
  const [dayDetailOpen, setDayDetailOpen] = useState(false);

  const handleDayClick = (
    date: Date,
    dayEvents: Array<{
      id: string;
      title: string;
      start: string;
      status: string;
      priority: string;
      asset: string;
    }>
  ) => {
    setSelectedDate(date);
    setSelectedDayEvents(dayEvents);
    setDayDetailOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Lịch bảo trì</DialogTitle>
            <DialogDescription>
              Xem lịch bảo trì theo tháng. Click vào ngày có lịch bảo trì để xem chi tiết.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <MaintenanceCalendar events={events} onDayClick={handleDayClick} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Day Detail Dialog */}
      <MaintenanceDayDetailDialog
        open={dayDetailOpen}
        onOpenChange={setDayDetailOpen}
        date={selectedDate}
        events={selectedDayEvents}
      />
    </>
  );
}

