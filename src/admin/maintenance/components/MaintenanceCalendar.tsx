"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { cn } from "@/lib/utils";

export function MaintenanceCalendar({ events }: { events: any[] }) {
  const renderEventContent = (eventInfo: any) => {
    const status = eventInfo.event.extendedProps.status;

    // Màu nền dịu + bo góc
    const baseStyle =
      "flex flex-col rounded-md px-2 py-1 text-xs font-medium shadow-sm";

    const colorClass = cn(
      status === "COMPLETED" && "bg-emerald-50 text-emerald-700 border border-emerald-100",
      status === "PENDING" && "bg-amber-50 text-amber-700 border border-amber-100",
      status === "CANCELED" && "bg-gray-50 text-gray-600 border border-gray-200"
    );

    const statusText =
      status === "COMPLETED"
        ? "Hoàn thành"
        : status === "PENDING"
        ? "Đang chờ"
        : "Đã hủy";

    return (
      <div className={`${baseStyle} ${colorClass}`}>
        <div className="truncate">{eventInfo.event.title}</div>
        <div className="text-[10px] mt-0.5 opacity-80">{statusText}</div>
      </div>
    );
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      eventContent={renderEventContent}
      height="auto"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "", // ❌ Không có view tuần
      }}
      buttonText={{
        today: "Hôm nay",
      }}
      locale="vi"
      firstDay={1}
    />
  );
}
