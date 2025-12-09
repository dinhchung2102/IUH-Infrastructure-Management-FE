"use client";

import { Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { CampusStatsCards } from "../components/CampusStatsCards";
import { CampusAddDialog } from "../components/CampusAddDialog";
import { CampusFilters } from "../components/CampusFilters";
import { CampusTable } from "../components/CampusTable";
import { useCampusManagement } from "../hooks";
import { useNavigate } from "react-router-dom";

function CampusPage() {
  const navigate = useNavigate();
  const {
    filteredCampuses,
    loading,
    stats,
    filters,
    handleFiltersChange,
    handleClearFilters,
    openAddDialog,
    setOpenAddDialog,
    editCampus,
    setEditCampus,
    handleDelete,
    handleToggleStatus,
    handleAddSuccess,
    handleEditSuccess,
  } = useCampusManagement();

  /** ============================
   *  UI
   *  ============================ */
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Quản lý", href: "/admin/campus" },
            { label: "Quản lý cơ sở", isCurrent: true },
          ]}
        />
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            variant="outline"
            onClick={() => navigate("/admin/statistics/building-area")}
          >
            <BarChart3 className="h-4 w-4" />
            Xem thống kê
          </Button>
          <Button
            className="flex-1 md:flex-initial cursor-pointer hidden"
            variant="default"
            onClick={() => setOpenAddDialog(true)}
          >
            <Plus className="h-4 w-4" />
            Thêm cơ sở
          </Button>
        </div>
      </div>

      {/* Cards thống kê */}
      <CampusStatsCards stats={stats} loading={loading} />

      {/* Bộ lọc */}
      <CampusFilters
        search={filters.search}
        statusFilter={filters.statusFilter}
        managerFilter={filters.managerFilter}
        onSearchChange={(value) => handleFiltersChange({ search: value })}
        onStatusFilterChange={(value) =>
          handleFiltersChange({ statusFilter: value })
        }
        onManagerFilterChange={(value) =>
          handleFiltersChange({ managerFilter: value })
        }
        onClearFilters={handleClearFilters}
      />

      {/* Bảng dữ liệu */}
      <CampusTable
        campuses={filteredCampuses}
        loading={loading}
        onEdit={setEditCampus}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {/* Dialog thêm cơ sở */}
      <CampusAddDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        mode="add"
        onSuccess={handleAddSuccess}
      />

      {editCampus && (
        <CampusAddDialog
          open={!!editCampus}
          onOpenChange={(open) => !open && setEditCampus(null)}
          mode="edit"
          campus={editCampus}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

export default CampusPage;
