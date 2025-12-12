import { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { deleteAsset, getAssets } from "../api/asset.api";
import {
  getAssetStatsDashboard,
  type AssetDashboardStats,
} from "../api/stats.api";
import type {
  PaginationRequest,
  PaginationResponse,
} from "@/types/pagination.type";
import { DEFAULT_PAGINATION_RESPONSE } from "@/types/pagination.type";

export interface AssetListItem {
  _id: string;
  name: string;
  status: string;
  image?: string;
  code?: string;
  description?: string;
  assetType?: {
    _id: string;
    name: string;
  };
  assetCategory?: {
    _id: string;
    name: string;
  };
  zone?: {
    _id: string;
    name: string;
  };
  area?: {
    _id: string;
    name: string;
  };
}

interface UseAssetDataProps {
  filters: {
    search: string;
    statusFilter: string;
    typeFilter: string;
  };
  paginationRequest: PaginationRequest;
  onPaginationUpdate: (pagination: PaginationResponse) => void;
}

/**
 * Hook xử lý data & gọi API cho AssetPage
 */
export function useAssetData({
  filters,
  paginationRequest,
  onPaginationUpdate,
}: UseAssetDataProps) {
  const [assets, setAssets] = useState<AssetListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AssetDashboardStats | undefined>(
    undefined
  );

  // Sử dụng useRef để tránh stale closure
  const onPaginationUpdateRef = useRef(onPaginationUpdate);
  onPaginationUpdateRef.current = onPaginationUpdate;

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      
      const query = {
        ...paginationRequest,
        ...(filters.search && { keyword: filters.search }),
        ...(filters.statusFilter !== "all" && { status: filters.statusFilter }),
      };

      const res = await getAssets(query);
      if (!res.success) {
        toast.error(res.message || "Không thể tải danh sách thiết bị.");
        setAssets([]);
        onPaginationUpdateRef.current(DEFAULT_PAGINATION_RESPONSE);
        return;
      }

      const list = (res.data?.assets || []) as AssetListItem[];
      setAssets(list);
      onPaginationUpdateRef.current(
        res.data?.pagination || DEFAULT_PAGINATION_RESPONSE
      );
    } catch (err: unknown) {
      console.error("Lỗi khi tải thiết bị:", err);
      toast.error("Không thể tải danh sách thiết bị.");
      setAssets([]);
      onPaginationUpdateRef.current(DEFAULT_PAGINATION_RESPONSE);
    } finally {
      setLoading(false);
    }
  }, [filters, paginationRequest]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getAssetStatsDashboard();
      if (!res.success || !res.data) {
        if (!res.success) {
          toast.error(res.message || "Không thể tải thống kê thiết bị.");
        }
        setStats(undefined);
        return;
      }

      setStats(res.data);
    } catch (err: unknown) {
      console.error("Lỗi khi tải thống kê thiết bị:", err);
      toast.error("Không thể tải thống kê thiết bị.");
      setStats(undefined);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
    fetchStats();
  }, [fetchAssets, fetchStats]);

  const handleDelete = async (id: string) => {
    if (!id) return toast.error("Không tìm thấy thiết bị.");
    const confirmDelete = confirm("Bạn có chắc muốn xóa thiết bị này?");
    if (!confirmDelete) return;

    try {
      const res = await deleteAsset(id);
      if (res.success) {
        toast.success(res.message || "Đã xóa thiết bị thành công!");
        fetchAssets();
        fetchStats();
      } else {
        toast.error(res.message || "Không thể xóa thiết bị này.");
      }
    } catch (err: unknown) {
      console.error("Lỗi khi xóa thiết bị:", err);
      toast.error("Không thể xóa thiết bị này.");
    }
  };

  const refetchAll = () => {
    fetchAssets();
    fetchStats();
  };

  return {
    assets,
    loading,
    stats,
    handleDelete,
    refetchAll,
    refetch: fetchAssets,
  };
}
