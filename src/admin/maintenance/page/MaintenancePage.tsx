"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  CalendarDays,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MaintenanceCalendar } from "../components/MaintenanceCalendar";
import { MaintenanceAddDialog } from "../components/MaintenanceAddDialog";

export default function MaintenancePage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [events, setEvents] = useState<any[]>([
    {
      id: "1",
      title: "Bảo trì máy lạnh tầng 3",
      start: "2025-10-27",
      status: "PENDING",
      device: "Máy lạnh phòng họp A1",
      priority: "HIGH",
    },
    {
      id: "2",
      title: "Kiểm tra hệ thống điện",
      start: "2025-10-28",
      status: "COMPLETED",
      device: "Tủ điện tầng 3",
      priority: "MEDIUM",
    },
    {
      id: "3",
      title: "Bảo dưỡng thang máy",
      start: "2025-10-29",
      status: "CANCELED",
      device: "Thang máy khu B",
      priority: "LOW",
    },
  ]);

  const handleAddEvent = (newEvent: any) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm("Bạn có chắc muốn xóa lịch bảo trì này không?")) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    },
    [setEvents]
  );

  /** ============================
   *  Filter Logic
   *  ============================ */
  const filteredEvents = events.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.device.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    const matchPriority =
      priorityFilter === "all" || e.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  /** ============================
   *  UI
   *  ============================ */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">Lịch bảo trì thiết bị</h1>
        </div>
        <Button onClick={() => setOpenAdd(true)}>
          <Plus className="w-4 h-4 mr-2" /> Thêm lịch bảo trì
        </Button>
      </div>

      {/* 📅 Lịch */}
      <div className="rounded-lg border bg-white shadow-sm p-4">
        <MaintenanceCalendar events={events} />
      </div>

      {/* Bộ lọc & Tìm kiếm */}
      <div className="p-4 border bg-white rounded-lg space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="text-muted-foreground w-4 h-4" />

          {/* Ô tìm kiếm */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 flex-1 min-w-[260px]"
          >
            <Input
              placeholder="Tìm kiếm theo tên hoặc thiết bị..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit">Tìm kiếm</Button>
          </form>

          {/* Dropdown Trạng thái */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="PENDING">Đang chờ</SelectItem>
              <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
              <SelectItem value="CANCELED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>

          {/* Dropdown Ưu tiên */}
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tất cả mức ưu tiên" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả ưu tiên</SelectItem>
              <SelectItem value="HIGH">Cao</SelectItem>
              <SelectItem value="MEDIUM">Trung bình</SelectItem>
              <SelectItem value="LOW">Thấp</SelectItem>
            </SelectContent>
          </Select>

          {(search || statusFilter !== "all" || priorityFilter !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setPriorityFilter("all");
              }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* 📋 Bảng danh sách bảo trì */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-12">STT</TableHead>
              <TableHead>Tên công việc</TableHead>
              <TableHead>Thiết bị</TableHead>
              <TableHead>Ngày bảo trì</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ưu tiên</TableHead>
              <TableHead className="text-center w-24">Thao tác</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Không có Nhiệm vụ nào phù hợp.
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((e, i) => (
                <TableRow key={e.id}>
                  <TableCell className="text-center">{i + 1}</TableCell>
                  <TableCell className="font-medium">{e.title}</TableCell>
                  <TableCell>{e.device}</TableCell>
                  <TableCell>
                    {new Date(e.start).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {e.status === "COMPLETED" && (
                      <Badge variant="success">Hoàn thành</Badge>
                    )}
                    {e.status === "PENDING" && (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800 border border-yellow-300"
                      >
                        Đang chờ
                      </Badge>
                    )}
                    {e.status === "CANCELED" && (
                      <Badge variant="outline" className="text-gray-500">
                        Đã hủy
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {e.priority === "HIGH" && (
                      <Badge variant="destructive">Cao</Badge>
                    )}
                    {e.priority === "MEDIUM" && (
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800 border border-amber-300"
                      >
                        Trung bình
                      </Badge>
                    )}
                    {e.priority === "LOW" && (
                      <Badge variant="outline">Thấp</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(e.id)}
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog thêm mới */}
      <MaintenanceAddDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        onAdd={handleAddEvent}
      />
    </div>
  );
}
