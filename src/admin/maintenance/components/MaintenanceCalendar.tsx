"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { vi } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  status: string;
  priority: string;
  asset: string;
}

interface MaintenanceCalendarProps {
  events: CalendarEvent[];
  onDayClick?: (date: Date, events: CalendarEvent[]) => void;
}

export function MaintenanceCalendar({
  events,
  onDayClick,
}: MaintenanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get month start and end
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Get all days in calendar view
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};
    events.forEach((event) => {
      const eventDate = format(new Date(event.start), "yyyy-MM-dd");
      if (!grouped[eventDate]) {
        grouped[eventDate] = [];
      }
      grouped[eventDate].push(event);
    });
    return grouped;
  }, [events]);

  // Weekday names
  const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(2024, i, 1);
    return {
      value: i.toString(),
      label: format(monthDate, "MMMM", { locale: vi }),
    };
  });

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear - 5 + i;
    return {
      value: year.toString(),
      label: year.toString(),
    };
  });

  const currentMonth = currentDate.getMonth();
  const currentYearValue = currentDate.getFullYear();

  const handleMonthChange = (monthValue: string) => {
    const newDate = new Date(currentYearValue, parseInt(monthValue), 1);
    setCurrentDate(newDate);
  };

  const handleYearChange = (yearValue: string) => {
    const newDate = new Date(parseInt(yearValue), currentMonth, 1);
    setCurrentDate(newDate);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "PENDING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "OVERDUE":
        return "bg-red-100 text-red-700 border-red-200";
      case "CANCELLED":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Month and Year Selectors */}
          <div className="flex items-center gap-2">
            <Select
              value={currentMonth.toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-[140px] bg-white cursor-pointer font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem
                    key={month.value}
                    value={month.value}
                    className="cursor-pointer"
                  >
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={currentYearValue.toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-[100px] bg-white cursor-pointer font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem
                    key={year.value}
                    value={year.value}
                    className="cursor-pointer"
                  >
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={goToToday} className="text-sm">
          Hôm nay
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg bg-white overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {weekdays.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, dayIdx) => {
            const dayKey = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDate[dayKey] || [];
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toString()}
                onClick={() => {
                  if (dayEvents.length > 0 && onDayClick) {
                    onDayClick(day, dayEvents);
                  }
                }}
                className={cn(
                  "min-h-[80px] border-r border-b p-1.5 transition-colors",
                  !isCurrentMonth && "bg-muted/30",
                  isToday && "bg-primary/5",
                  dayIdx % 7 === 6 && "border-r-0",
                  dayEvents.length > 0 && "cursor-pointer hover:bg-muted/50"
                )}
              >
                {/* Day Number */}
                <div
                  className={cn(
                    "text-xs font-medium mb-0.5",
                    !isCurrentMonth && "text-muted-foreground",
                    isToday && "text-primary font-bold"
                  )}
                >
                  {format(day, "d")}
                </div>

                {/* Events */}
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "text-[10px] px-1 py-0.5 rounded border truncate cursor-pointer hover:opacity-80 transition-opacity leading-tight",
                        getStatusColor(event.status)
                      )}
                      title={`${event.title} - ${event.asset}`}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-muted-foreground px-1">
                      +{dayEvents.length - 2} khác
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 items-center justify-center">
        <div className="text-sm font-medium text-muted-foreground">
          Chú thích:
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-200" />
          <span className="text-sm">Hoàn thành</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-100 border border-amber-200" />
          <span className="text-sm">Chờ thực hiện</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200" />
          <span className="text-sm">Đang thực hiện</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-200" />
          <span className="text-sm">Quá hạn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
          <span className="text-sm">Đã hủy</span>
        </div>
      </div>
    </div>
  );
}
