import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationComponent from "@/components/PaginationComponent";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  NewsStatsCards,
  NewsFilters,
  NewsTable,
  CreateEditNewsDialog,
  NewsDetailDialog,
} from "../components";
import { getNews, deleteNews, getNewsStats } from "../api/news.api";
import type {
  News,
  NewsFilters as NewsFiltersType,
  NewsStats,
} from "../types/news.type";

export default function NewsManagementPage() {
  const [news, setNews] = useState<News[]>([]);
  const [stats, setStats] = useState<NewsStats>({
    total: 0,
    published: 0,
    draft: 0,
    newThisMonth: 0,
  });
  const [filters, setFilters] = useState<NewsFiltersType>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [createEditDialogOpen, setCreateEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Selected items
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [newsToDelete, setNewsToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await getNews({
        ...filters,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (response.success && response.data) {
        setNews(response.data.news);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Không thể tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getNewsStats();
      if (response.success && response.data) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleFilterChange = (newFilters: NewsFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleViewDetails = (news: News) => {
    setSelectedNews(news);
    setDetailDialogOpen(true);
  };

  const handleEdit = (news: News) => {
    setEditingNews(news);
    setCreateEditDialogOpen(true);
  };

  const handleCreateNew = () => {
    setEditingNews(null);
    setCreateEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setNewsToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!newsToDelete) return;

    try {
      await deleteNews(newsToDelete);
      toast.success("Xóa tin tức thành công!");
      fetchNews();
      fetchStats();
    } catch (error: any) {
      console.error("Error deleting news:", error);
      toast.error(error.response?.data?.message || "Không thể xóa tin tức");
    } finally {
      setDeleteConfirmOpen(false);
      setNewsToDelete(null);
    }
  };

  const handleSuccess = () => {
    fetchNews();
    fetchStats();
  };

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/admin" },
    { label: "Quản lý tin tức", href: "/admin/news" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb items={breadcrumbItems} />
        <Button
          className="w-full cursor-pointer md:w-auto"
          onClick={handleCreateNew}
        >
          <Plus className="h-4 w-4" />
          Tạo tin tức mới
        </Button>
      </div>

      {/* Stats Cards */}
      <NewsStatsCards stats={stats} />

      {/* Filters */}
      <NewsFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Table */}
      {loading ? (
        <div className="rounded-md border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">STT</TableHead>
                  <TableHead className="w-[80px] md:w-[100px]">Ảnh</TableHead>
                  <TableHead className="min-w-[200px]">Tiêu đề</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[120px]">
                    Danh mục
                  </TableHead>
                  <TableHead className="hidden xl:table-cell min-w-[180px]">
                    Tác giả
                  </TableHead>
                  <TableHead className="min-w-[110px]">Trạng thái</TableHead>
                  <TableHead className="hidden md:table-cell w-[90px] text-center">
                    Lượt xem
                  </TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[130px]">
                    Ngày tạo
                  </TableHead>
                  <TableHead className="w-[80px] text-right">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableSkeleton
                  columns={[
                    { type: "number", width: "w-12" },
                    { type: "avatar", width: "size-12 md:size-16" },
                    { type: "text", width: "w-[200px]" },
                    {
                      type: "badge",
                      width: "w-[100px]",
                      className: "hidden lg:table-cell",
                    },
                    {
                      type: "text",
                      width: "w-[180px]",
                      className: "hidden xl:table-cell",
                    },
                    { type: "badge", width: "w-[100px]" },
                    {
                      type: "number",
                      width: "w-16",
                      className: "hidden md:table-cell",
                    },
                    {
                      type: "text",
                      width: "w-[120px]",
                      className: "hidden lg:table-cell",
                    },
                    { type: "text", width: "w-16" },
                  ]}
                  rows={5}
                />
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <>
          <NewsTable
            news={news}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationComponent
              pagination={{
                currentPage,
                totalPages,
                totalItems,
                itemsPerPage,
              }}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <CreateEditNewsDialog
        news={editingNews}
        open={createEditDialogOpen}
        onOpenChange={setCreateEditDialogOpen}
        onSuccess={handleSuccess}
      />

      {/* Detail Dialog */}
      <NewsDetailDialog
        news={selectedNews}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tin tức</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tin tức này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
