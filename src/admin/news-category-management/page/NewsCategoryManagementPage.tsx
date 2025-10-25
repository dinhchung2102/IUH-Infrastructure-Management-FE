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
import PaginationComponent from "@/components/PaginationComponent";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  NewsCategoryStatsCards,
  NewsCategoryFilters,
  NewsCategoryTable,
  CreateEditNewsCategoryDialog,
  NewsCategoryDetailDialog,
} from "../components";
import {
  getNewsCategories,
  deleteNewsCategory,
} from "../api/news-category.api";
import type {
  NewsCategory,
  NewsCategoryFilters as NewsCategoryFiltersType,
  NewsCategoryStats,
} from "../types/news-category.type";

export default function NewsCategoryManagementPage() {
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [stats, setStats] = useState<NewsCategoryStats>({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [filters, setFilters] = useState<NewsCategoryFiltersType>({
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
  const [editingCategory, setEditingCategory] = useState<NewsCategory | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(
    null
  );
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getNewsCategories({
        ...filters,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (response.success && response.data) {
        setCategories(response.data.categories);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);

        // Calculate stats from categories
        const activeCount = response.data.categories.filter(
          (c) => c.isActive
        ).length;
        setStats({
          total: response.data.pagination.totalItems,
          active: activeCount,
          inactive: response.data.pagination.totalItems - activeCount,
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: NewsCategoryFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleViewDetails = (category: NewsCategory) => {
    setSelectedCategory(category);
    setDetailDialogOpen(true);
  };

  const handleEdit = (category: NewsCategory) => {
    setEditingCategory(category);
    setCreateEditDialogOpen(true);
  };

  const handleCreateNew = () => {
    setEditingCategory(null);
    setCreateEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteNewsCategory(categoryToDelete);
      toast.success("Xóa danh mục thành công!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Không thể xóa danh mục");
    } finally {
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleSuccess = () => {
    fetchCategories();
  };

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/admin" },
    { label: "Danh mục tin tức", href: "/admin/news-categories" },
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
          Tạo danh mục mới
        </Button>
      </div>

      {/* Stats Cards */}
      <NewsCategoryStatsCards stats={stats} />

      {/* Filters */}
      <NewsCategoryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Table */}
      {loading ? (
        <TableSkeleton
          columns={[
            { type: "number", width: "w-12" },
            { type: "avatar", width: "size-16" },
            { type: "text", width: "w-[180px]" },
            { type: "text", width: "w-[200px]" },
            { type: "badge", width: "w-[100px]" },
            { type: "text", width: "w-[120px]" },
            { type: "text", width: "w-16" },
          ]}
          rows={5}
        />
      ) : (
        <>
          <NewsCategoryTable
            categories={categories}
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
      <CreateEditNewsCategoryDialog
        category={editingCategory}
        open={createEditDialogOpen}
        onOpenChange={setCreateEditDialogOpen}
        onSuccess={handleSuccess}
      />

      {/* Detail Dialog */}
      <NewsCategoryDetailDialog
        category={selectedCategory}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể
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
