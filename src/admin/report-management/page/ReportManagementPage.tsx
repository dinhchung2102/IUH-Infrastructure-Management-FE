import { useState } from "react";
import {
  ReportStatsCards,
  ReportFilters,
  ReportTable,
  ReportDetailDialog,
  ReportStatsDialog,
} from "../components";
import type {
  Report,
  ReportStatus,
  ReportFilters as Filters,
} from "../types/report.type";
import { toast } from "sonner";
import PaginationComponent from "@/components/PaginationComponent";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { ChartBar } from "lucide-react";

// Mock Data
const mockReports: Report[] = [
  {
    _id: "1",
    reportCode: "RPT-2024-001",
    type: { _id: "1", value: "DAMAGE", label: "Hư hỏng" },
    description:
      "Điều hòa trong phòng A101 không hoạt động, có mùi khét. Sinh viên không thể học trong phòng vì nhiệt độ quá cao.",
    status: "PENDING",
    priority: "HIGH",
    reporter: {
      _id: "1",
      fullName: "Nguyễn Văn An",
      email: "nguyenvanan@iuh.edu.vn",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=An",
    },
    asset: {
      _id: "1",
      name: "Điều hòa Daikin 2.5HP",
      code: "DH-A101-001",
      image:
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400",
    },
    location: {
      campus: "Cơ sở 1 - Võ Văn Ngân",
      building: "Tòa nhà A",
      floor: 1,
      zone: "Phòng học A101",
    },
    images: [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80",
    ],
    createdAt: "2024-10-16T08:30:00Z",
    updatedAt: "2024-10-16T08:30:00Z",
  },
  {
    _id: "2",
    reportCode: "RPT-2024-002",
    type: { _id: "2", value: "CLEANING", label: "Vệ sinh" },
    description:
      "Nhà vệ sinh tầng 2 tòa B cần được vệ sinh và bổ sung giấy vệ sinh.",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    reporter: {
      _id: "2",
      fullName: "Trần Thị Bình",
      email: "tranbingh@iuh.edu.vn",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Binh",
    },
    asset: {
      _id: "2",
      name: "Nhà vệ sinh nữ",
      code: "WC-B02-F",
    },
    location: {
      campus: "Cơ sở 1 - Võ Văn Ngân",
      building: "Tòa nhà B",
      floor: 2,
      zone: "Khu vực vệ sinh",
    },
    images: [],
    createdAt: "2024-10-15T14:20:00Z",
    updatedAt: "2024-10-16T09:00:00Z",
    assignedTo: {
      _id: "10",
      fullName: "Lê Văn Sơn",
      email: "levason@iuh.edu.vn",
    },
  },
  {
    _id: "3",
    reportCode: "RPT-2024-003",
    type: { _id: "3", value: "MAINTENANCE", label: "Bảo trì" },
    description:
      "Máy chiếu trong phòng C305 bị mờ hình, không lấy nét được. Cần kiểm tra và thay bóng đèn.",
    status: "RESOLVED",
    priority: "MEDIUM",
    reporter: {
      _id: "3",
      fullName: "Lê Minh Cường",
      email: "leminhcuong@iuh.edu.vn",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cuong",
    },
    asset: {
      _id: "3",
      name: "Máy chiếu Epson EB-X41",
      code: "PJ-C305-001",
      image: "https://images.unsplash.com/photo-1545235617-7a424c1a60cc?w=400",
    },
    location: {
      campus: "Cơ sở 2 - Nguyễn Văn Bảo",
      building: "Tòa nhà C",
      floor: 3,
      zone: "Phòng học C305",
    },
    images: ["https://images.unsplash.com/photo-1545235617-7a424c1a60cc?w=600"],
    createdAt: "2024-10-14T10:15:00Z",
    updatedAt: "2024-10-15T16:30:00Z",
    resolvedAt: "2024-10-15T16:30:00Z",
  },
  {
    _id: "4",
    reportCode: "RPT-2024-004",
    type: { _id: "1", value: "DAMAGE", label: "Hư hỏng" },
    description: "Bàn ghế trong phòng D201 bị gãy chân, không sử dụng được.",
    status: "PENDING",
    priority: "LOW",
    reporter: {
      _id: "4",
      fullName: "Phạm Thị Diệu",
      email: "phamdieu@iuh.edu.vn",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dieu",
    },
    asset: {
      _id: "4",
      name: "Bàn ghế sinh viên",
      code: "BG-D201-015",
    },
    location: {
      campus: "Cơ sở 1 - Võ Văn Ngân",
      building: "Tòa nhà D",
      floor: 2,
      zone: "Phòng học D201",
    },
    images: [],
    createdAt: "2024-10-16T07:00:00Z",
    updatedAt: "2024-10-16T07:00:00Z",
  },
  {
    _id: "5",
    reportCode: "RPT-2024-005",
    type: { _id: "1", value: "DAMAGE", label: "Hư hỏng" },
    description:
      "Hệ thống âm thanh trong hội trường bị hú. Microphone không hoạt động ổn định.",
    status: "PENDING",
    priority: "URGENT",
    reporter: {
      _id: "5",
      fullName: "Hoàng Văn Em",
      email: "hoangem@iuh.edu.vn",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Em",
    },
    asset: {
      _id: "5",
      name: "Hệ thống âm thanh",
      code: "AUD-HT-001",
      image:
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400",
    },
    location: {
      campus: "Cơ sở 1 - Võ Văn Ngân",
      building: "Tòa nhà chính",
      floor: 1,
      zone: "Hội trường lớn",
    },
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=90",
    ],
    createdAt: "2024-10-16T06:45:00Z",
    updatedAt: "2024-10-16T06:45:00Z",
  },
  {
    _id: "6",
    reportCode: "RPT-2024-006",
    type: { _id: "4", value: "OTHER", label: "Khác" },
    description:
      "Đèn chiếu sáng ngoài hành lang tầng 3 bị hỏng, tối không thấy đường đi.",
    status: "REJECTED",
    priority: "MEDIUM",
    reporter: {
      _id: "6",
      fullName: "Vũ Thị Phượng",
      email: "vuphuong@iuh.edu.vn",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phuong",
    },
    asset: {
      _id: "6",
      name: "Đèn LED hành lang",
      code: "LED-E03-012",
    },
    location: {
      campus: "Cơ sở 2 - Nguyễn Văn Bảo",
      building: "Tòa nhà E",
      floor: 3,
      zone: "Hành lang",
    },
    images: [],
    createdAt: "2024-10-13T15:30:00Z",
    updatedAt: "2024-10-14T10:00:00Z",
  },
];

const mockStats = {
  total: 156,
  pending: 42,
  inProgress: 28,
  resolved: 78,
  todayReports: 12,
};

export default function ReportManagementPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filters
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    priority: "all",
    type: "all",
    dateFrom: "",
    dateTo: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      priority: "all",
      type: "all",
      dateFrom: "",
      dateTo: "",
    });
    setCurrentPage(1);
  };

  // Filter reports
  const filteredReports = reports.filter((report) => {
    if (
      filters.search &&
      !report.reportCode.toLowerCase().includes(filters.search.toLowerCase()) &&
      !report.reporter.fullName
        .toLowerCase()
        .includes(filters.search.toLowerCase()) &&
      !report.asset.name.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.status !== "all" && report.status !== filters.status) {
      return false;
    }
    if (filters.priority !== "all" && report.priority !== filters.priority) {
      return false;
    }
    if (filters.type !== "all" && report.type.value !== filters.type) {
      return false;
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginationData = {
    currentPage,
    totalPages,
    totalItems: filteredReports.length,
    itemsPerPage,
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = (reportId: string, status: ReportStatus) => {
    setReports((prev) =>
      prev.map((report) =>
        report._id === reportId
          ? {
              ...report,
              status,
              updatedAt: new Date().toISOString(),
              resolvedAt:
                status === "RESOLVED" ? new Date().toISOString() : undefined,
            }
          : report
      )
    );
    toast.success("Cập nhật trạng thái thành công!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Quản lý", href: "/admin/reports" },
            { label: "Quản lý báo cáo", isCurrent: true },
          ]}
        />
        <Button
          className="w-full cursor-pointer md:w-auto"
          onClick={() => setIsStatsDialogOpen(true)}
        >
          <ChartBar className="h-4 w-4" />
          Xem thống kê
        </Button>
      </div>

      {/* Stats Cards */}
      <ReportStatsCards stats={mockStats} />

      {/* Filters */}
      <ReportFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <div className="space-y-4">
        <ReportTable
          reports={paginatedReports}
          onViewDetails={handleViewDetails}
          onUpdateStatus={handleUpdateStatus}
        />

        {totalPages > 1 && (
          <PaginationComponent
            pagination={paginationData}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Detail Dialog */}
      <ReportDetailDialog
        report={selectedReport}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />

      {/* Stats Dialog */}
      <ReportStatsDialog
        open={isStatsDialogOpen}
        onOpenChange={setIsStatsDialogOpen}
      />
    </div>
  );
}
