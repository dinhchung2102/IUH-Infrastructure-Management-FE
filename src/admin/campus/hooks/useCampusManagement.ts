import { useState } from "react";
import type { Campus } from "../components/CampusTable";
import { useCampusFilters } from "./useCampusFilters";
import { useCampusData } from "./useCampusData";

/**
 * Custom hook aggregator for Campus page
 * Kết hợp hooks: filters + data + một ít UI state (dialog, editing)
 */
export function useCampusManagement() {
  const {
    campuses,
    loading,
    stats,
    handleDelete,
    handleToggleStatus,
    refetchAll,
  } = useCampusData();
  const { filters, handleFiltersChange, handleClearFilters } =
    useCampusFilters();

  // Dialog / edit state
  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editCampus, setEditCampus] = useState<Campus | null>(null);

  const handleAddSuccess = () => {
    refetchAll();
  };

  const handleEditSuccess = () => {
    setEditCampus(null);
    refetchAll();
  };

  const filteredCampuses = campuses.filter((c) => {
    const search = filters.search.toLowerCase();
    const matchSearch =
      c?.name?.toLowerCase().includes(search) ||
      c?.email?.toLowerCase().includes(search);

    const matchStatus =
      filters.statusFilter === "all" || c.status === filters.statusFilter;

    const matchManager =
      filters.managerFilter === "all"
        ? true
        : filters.managerFilter === "has"
        ? !!c.manager
        : !c.manager;

    return matchSearch && matchStatus && matchManager;
  });

  return {
    campuses,
    filteredCampuses,
    loading,
    stats,

    filters,
    handleFiltersChange,
    handleClearFilters,

    openStatsDialog,
    setOpenStatsDialog,
    openAddDialog,
    setOpenAddDialog,
    editCampus,
    setEditCampus,

    handleDelete,
    handleToggleStatus,
    handleAddSuccess,
    handleEditSuccess,
  };
}
