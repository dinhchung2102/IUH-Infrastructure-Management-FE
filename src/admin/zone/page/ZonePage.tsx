"use client";

import { useState } from "react";
import { Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ZoneStatsCards } from "../components/ZoneStatsCard";
import { ZoneStatsDialog } from "../components/ZoneStatsDialog";
import { ZoneAddDialog } from "../components/ZoneAddDialog";
import { ZoneTable } from "../components/ZoneTable";
import { ZoneFilters } from "../components/ZoneFilters";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import PaginationComponent from "@/components/PaginationComponent";
import { useZoneManagement } from "../hooks";
import type { ZoneResponse } from "../api/zone.api";

function ZonePage() {
  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editZone, setEditZone] = useState<ZoneResponse | null>(null);

  // Use custom hooks to manage all logic
  const {
    zones,
    loading,
    stats,
    campuses,
    filters,
    pagination,
    paginationRequest,
    handleFiltersChange,
    handlePageChange,
    clearFilters,
    handleDelete,
    refetch,
  } = useZoneManagement();

  /* ============================
   *  UI
   ============================ */
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Quản lý", href: "/admin/zone" },
            { label: "Quản lý phòng", isCurrent: true },
          ]}
        />
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            variant="outline"
            onClick={() => setOpenStatsDialog(true)}
          >
            <BarChart3 className=" h-4 w-4" />
            Xem thống kê
          </Button>
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            variant="default"
            onClick={() => setOpenAddDialog(true)}
          >
            <Plus className=" h-4 w-4" />
            Thêm khu vực
          </Button>
        </div>
      </div>

      {/* Cards thống kê */}
      <ZoneStatsCards stats={stats} loading={loading} />

      {/* Bộ lọc */}
      <ZoneFilters
        search={filters.search}
        statusFilter={filters.status}
        campusFilter={filters.campus}
        zoneTypeFilter={filters.zoneType}
        campuses={campuses}
        onSearchSubmit={(value) => handleFiltersChange({ search: value })}
        onStatusFilterChange={(value) => handleFiltersChange({ status: value })}
        onCampusFilterChange={(value) => handleFiltersChange({ campus: value })}
        onZoneTypeFilterChange={(value) =>
          handleFiltersChange({ zoneType: value })
        }
        onClearFilters={clearFilters}
      />

      {/* Bảng dữ liệu */}
      <ZoneTable
        zones={zones}
        loading={loading}
        onEdit={(zone) => setEditZone(zone)}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <PaginationComponent
        pagination={pagination}
        currentPage={paginationRequest.page}
        onPageChange={handlePageChange}
      />

      {/* Dialog thống kê */}
      <ZoneStatsDialog
        open={openStatsDialog}
        onOpenChange={setOpenStatsDialog}
      />

      {/* Dialog thêm/sửa khu vực */}
      <ZoneAddDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        mode="add"
        onSuccess={refetch}
      />

      {editZone && (
        <ZoneAddDialog
          open={!!editZone}
          onOpenChange={(open) => !open && setEditZone(null)}
          mode="edit"
          zone={editZone}
          onSuccess={() => {
            setEditZone(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

export default ZonePage;
