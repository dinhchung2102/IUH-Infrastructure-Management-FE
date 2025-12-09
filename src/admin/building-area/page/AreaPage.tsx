"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { RefreshCcw, BarChart3, Plus } from "lucide-react";
import { AreaStatsCards } from "../components/AreaStatsCards";
import { BuildingAreaAddDialog } from "../components/BuildingAreaAddDialog";
import { AreaStatsByCampusDialog } from "../components/AreaStatsByCampusDialog";
import { BuildingAreaFilters } from "../components/BuildingAreaFilters";
import { BuildingAreaTable } from "../components/BuildingAreaTable";
import PaginationComponent from "@/components/PaginationComponent";
import {
  useBuildingAreaFilters,
  useBuildingAreaPagination,
  useBuildingAreaData,
  type BuildingAreaItem,
} from "../hooks";
import { getAreaStats } from "../api/area.api";
import type { AreaStatsResponse } from "../api/area.api";

export default function AreaPage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const [editingItem, setEditingItem] = useState<BuildingAreaItem | null>(null);
  const [areaStats, setAreaStats] = useState<AreaStatsResponse | undefined>(
    undefined
  );
  const [statsLoading, setStatsLoading] = useState(true);
  const filterType = "AREA" as const;

  // Pagination
  const {
    paginationRequest,
    pagination,
    updatePagination,
    changePage,
    resetToFirstPage,
  } = useBuildingAreaPagination();

  // Get campuses first to set default campus
  const [defaultCampusId, setDefaultCampusId] = useState<string>("");

  // Filters - will be initialized with default campus after campuses are loaded
  const { filters, handleFiltersChange, handleClearFilters } =
    useBuildingAreaFilters(defaultCampusId);

  // Data fetching
  const {
    items,
    loading,
    campuses,
    pagination: dataPagination,
    fetchData,
    handleDelete,
  } = useBuildingAreaData({
    filterType,
    filters,
    paginationRequest,
  });

  // Set default campus when campuses are loaded (only once)
  useEffect(() => {
    if (campuses.length > 0 && !defaultCampusId && !filters.campus) {
      const firstCampusId = campuses[0]._id;
      setDefaultCampusId(firstCampusId);
      handleFiltersChange({ campus: firstCampusId });
    }
  }, [campuses, defaultCampusId, filters.campus, handleFiltersChange]);

  // Update pagination when data is fetched
  useEffect(() => {
    if (dataPagination) {
      updatePagination(dataPagination);
    }
  }, [dataPagination, updatePagination]);

  // Fetch area stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const stats = await getAreaStats();
        setAreaStats(stats);
      } catch (error) {
        console.error("Error fetching area stats:", error);
        setAreaStats(undefined);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Handle filter changes - reset to first page
  const handleFilterChange = (updates: Partial<typeof filters>) => {
    handleFiltersChange(updates);
    resetToFirstPage();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Quản lý", href: "/admin/areas" },
            { label: "Quản lý Khu vực ngoài trời", isCurrent: true },
          ]}
        />
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            className="flex-1 md:flex-initial cursor-pointer hidden"
            variant="outline"
            onClick={fetchData}
          >
            <RefreshCcw className="h-4 w-4" />
            Làm mới
          </Button>
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            variant="outline"
            onClick={() => setOpenStats(true)}
          >
            <BarChart3 className="h-4 w-4" />
            Xem thống kê
          </Button>
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            onClick={() => {
              setEditingItem(null);
              setOpenAdd(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Thêm khu vực ngoài trời
          </Button>
        </div>
      </div>

      {/* Cards thống kê */}
      <AreaStatsCards stats={areaStats} loading={statsLoading} />

      {/* Bộ lọc */}
      <BuildingAreaFilters
        search={filters.search}
        filterType={filterType}
        filterStatus={filters.status}
        filterCampus={filters.campus}
        filterZoneType={filters.zoneType || ""}
        campuses={campuses}
        onSearchSubmit={(value) => handleFilterChange({ search: value })}
        onFilterTypeChange={() => {}}
        onFilterStatusChange={(value) => handleFilterChange({ status: value })}
        onFilterCampusChange={(value) => handleFilterChange({ campus: value })}
        onFilterZoneTypeChange={(value) =>
          handleFilterChange({ zoneType: value })
        }
        onClearFilters={() => {
          handleClearFilters();
          resetToFirstPage();
        }}
        hideTypeFilter={true}
      />

      {/* Bảng dữ liệu */}
      <BuildingAreaTable
        items={items}
        loading={loading}
        onEdit={(item) => {
          setEditingItem(item);
          setOpenAdd(true);
        }}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <PaginationComponent
        pagination={pagination}
        currentPage={paginationRequest.page}
        onPageChange={changePage}
      />

      {/* Dialog thêm/sửa */}
      <BuildingAreaAddDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        onSuccess={fetchData}
        mode={editingItem ? "edit" : "add"}
        item={editingItem}
        campuses={campuses}
        defaultType="AREA"
      />

      {/* Dialog thống kê */}
      <AreaStatsByCampusDialog
        open={openStats}
        onOpenChange={setOpenStats}
        campuses={campuses}
      />
    </div>
  );
}
