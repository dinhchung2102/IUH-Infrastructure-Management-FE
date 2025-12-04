import { useState, useEffect, useCallback } from "react";
import {
  getBuildings,
  type BuildingResponse,
} from "../../building-area/api/building.api";

interface Campus {
  _id: string;
  name: string;
}

export function useZoneCampuses() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCampuses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getBuildings({});
      const unique = new Map<string, Campus>();
      (res?.data?.buildings || []).forEach((b: BuildingResponse) => {
        if (b?.campus?._id) {
          unique.set(b.campus._id, b.campus);
        }
      });
      setCampuses(Array.from(unique.values()));
    } catch (err) {
      console.error("Lỗi khi tải cơ sở:", err);
      setCampuses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampuses();
  }, [fetchCampuses]);

  return {
    campuses,
    loading,
    refetch: fetchCampuses,
  };
}
