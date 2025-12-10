import { useState, useEffect } from "react";
import {
  MyReportStatsCards,
  MyReportFilters,
  MyReportTable,
  MyReportDetailDialog,
} from "./components";
import { getMyReports } from "./api/report.api";
import type { MyReport, MyReportParams } from "./api/report.api";
import { toast } from "sonner";
import PaginationComponent from "@/components/PaginationComponent";
import { TableSkeleton } from "@/components/TableSkeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MyReportsPage() {
  const [reports, setReports] = useState<MyReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<MyReport | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Summary stats
  const [summary, setSummary] = useState({
    total: 0,
    byStatus: {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      RESOLVED: 0,
    },
    byType: {
      MAINTENANCE: 0,
      DAMAGED: 0,
      OTHER: 0,
    },
  });

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params: MyReportParams = {
        page: currentPage,
        limit: 10,
      };

      if (filters.search) params.search = filters.search;
      if (filters.status !== "all")
        params.status = filters.status as MyReportParams["status"];
      if (filters.type !== "all")
        params.type = filters.type as MyReportParams["type"];
      if (filters.dateFrom) params.fromDate = filters.dateFrom;
      if (filters.dateTo) params.toDate = filters.dateTo;

      const response = await getMyReports(params);

      if (response.success && response.data) {
        setReports(response.data.reports);
        setPagination(response.data.pagination);
        setSummary(response.data.summary);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Không thể tải danh sách báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      type: "all",
      dateFrom: "",
      dateTo: "",
    });
    setCurrentPage(1);
  };

  const handleViewDetail = (report: MyReport) => {
    setSelectedReport(report);
    setDetailDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-background to-muted/50 py-8 px-4">
      <div className="container space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Báo cáo của tôi</h1>
          <p className="text-gray-600">
            Theo dõi tình trạng xử lý các báo cáo bạn đã gửi
          </p>
        </div>

        {/* Stats Cards */}
        <MyReportStatsCards summary={summary} />

        {/* Filters */}
        <MyReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Table */}
        <div className="space-y-4">
          {loading ? (
            <div className="rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">STT</TableHead>
                    <TableHead>Thiết bị</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableSkeleton
                    rows={5}
                    columns={[
                      { type: "number", width: "w-[60px]", align: "center" },
                      { type: "text", width: "w-[200px]" },
                      { type: "badge", width: "w-[100px]" },
                      { type: "text", width: "w-[300px]" },
                      { type: "badge", width: "w-[120px]" },
                      { type: "text", width: "w-[150px]" },
                      { type: "text", width: "w-[120px]", align: "right" },
                    ]}
                  />
                </TableBody>
              </Table>
            </div>
          ) : (
            <>
              <MyReportTable reports={reports} onViewDetail={handleViewDetail} />
              {pagination && pagination.totalPages > 1 && (
                <PaginationComponent
                  pagination={pagination}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>

        {/* Detail Dialog */}
        <MyReportDetailDialog
          report={selectedReport}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
        />
      </div>
    </div>
  );
}

