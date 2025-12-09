import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, X, Plus, MapPin, Building2, Home } from "lucide-react";
import type { StaffResponse } from "../types/staff.type";
import {
  assignCampusToAccount,
  assignBuildingsToAccount,
  assignZonesToAccount,
  assignAreasToAccount,
  removeCampusFromAccount,
  removeBuildingFromAccount,
  removeZoneFromAccount,
  removeAreaFromAccount,
} from "../api/staff-actions.api";
import { getCampus } from "@/admin/campus/api/campus.api";
import {
  getBuildingsByCampusId,
  getZoneAreasByBuildingId,
  type Building,
  type ZoneArea,
} from "@/user/report/api/building.api";
import {
  getOutdoorAreasByCampusId,
  type Area,
} from "@/user/report/api/area.api";
import type { CampusResponse } from "@/admin/campus/api/campus.api";

interface AssignLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffResponse | null;
  onSuccess?: () => void;
}

export function AssignLocationDialog({
  open,
  onOpenChange,
  staff,
  onSuccess,
}: AssignLocationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("campus");

  // Data lists
  const [campuses, setCampuses] = useState<CampusResponse[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [zones, setZones] = useState<ZoneArea[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  // Selected values for Campus tab
  const [selectedCampus, setSelectedCampus] = useState<string>("");

  // Selected values for Building tab
  const [selectedCampusForBuilding, setSelectedCampusForBuilding] =
    useState<string>("");
  const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);

  // Selected values for Zone tab
  const [selectedCampusForZone, setSelectedCampusForZone] =
    useState<string>("");
  const [selectedBuildingForZone, setSelectedBuildingForZone] =
    useState<string>("");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

  // Selected values for Area tab
  const [selectedCampusForArea, setSelectedCampusForArea] =
    useState<string>("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  // Fetch campuses on open
  useEffect(() => {
    if (open) {
      fetchCampuses();
    }
  }, [open]);

  // Fetch buildings when campus is selected in Building tab
  useEffect(() => {
    if (selectedCampusForBuilding) {
      fetchBuildingsByCampus(selectedCampusForBuilding);
    } else {
      setBuildings([]);
      setSelectedBuildings([]);
    }
  }, [selectedCampusForBuilding]);

  // Fetch buildings when campus is selected in Zone tab
  useEffect(() => {
    if (selectedCampusForZone) {
      fetchBuildingsByCampus(selectedCampusForZone);
    } else {
      setBuildings([]);
      setSelectedBuildingForZone("");
      setSelectedZones([]);
    }
  }, [selectedCampusForZone]);

  // Fetch zones when building is selected in Zone tab
  useEffect(() => {
    if (selectedBuildingForZone) {
      fetchZones(selectedBuildingForZone);
    } else {
      setZones([]);
      setSelectedZones([]);
    }
  }, [selectedBuildingForZone]);

  // Fetch areas when campus is selected in Area tab
  useEffect(() => {
    if (selectedCampusForArea) {
      fetchAreasByCampus(selectedCampusForArea);
    } else {
      setAreas([]);
      setSelectedAreas([]);
    }
  }, [selectedCampusForArea]);

  const fetchCampuses = async () => {
    try {
      const res = await getCampus();
      setCampuses(res?.data?.campuses || []);
    } catch (error) {
      console.error("Error fetching campuses:", error);
    }
  };

  const fetchBuildingsByCampus = async (campusId: string) => {
    try {
      const res = await getBuildingsByCampusId(campusId);
      setBuildings(res?.data?.buildings || []);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setBuildings([]);
    }
  };

  const fetchZones = async (buildingId: string) => {
    try {
      const res = await getZoneAreasByBuildingId(buildingId);
      setZones(res?.data?.zones || []);
    } catch (error) {
      console.error("Error fetching zones:", error);
      setZones([]);
    }
  };

  const fetchAreasByCampus = async (campusId: string) => {
    try {
      const res = await getOutdoorAreasByCampusId(campusId);
      setAreas(res?.data?.areas || []);
    } catch (error) {
      console.error("Error fetching areas:", error);
      setAreas([]);
    }
  };

  // Handle assign campus
  const handleAssignCampus = async () => {
    if (!staff || !selectedCampus) {
      toast.error("Vui lòng chọn cơ sở");
      return;
    }

    try {
      setLoading(true);
      await assignCampusToAccount(staff._id, selectedCampus);
      toast.success("Phân công cơ sở thành công");
      setSelectedCampus("");
      onSuccess?.();
    } catch (error) {
      console.error("Error assigning campus:", error);
      toast.error("Không thể phân công cơ sở");
    } finally {
      setLoading(false);
    }
  };

  // Handle assign buildings
  const handleAssignBuildings = async () => {
    if (!staff || selectedBuildings.length === 0) {
      toast.error("Vui lòng chọn ít nhất một tòa nhà");
      return;
    }

    try {
      setLoading(true);
      await assignBuildingsToAccount(staff._id, selectedBuildings);
      toast.success(`Đã phân công ${selectedBuildings.length} tòa nhà`);
      setSelectedBuildings([]);
      onSuccess?.();
    } catch (error) {
      console.error("Error assigning buildings:", error);
      toast.error("Không thể phân công tòa nhà");
    } finally {
      setLoading(false);
    }
  };

  // Handle assign zones
  const handleAssignZones = async () => {
    if (!staff || selectedZones.length === 0) {
      toast.error("Vui lòng chọn ít nhất một khu vực");
      return;
    }

    try {
      setLoading(true);
      await assignZonesToAccount(staff._id, selectedZones);
      toast.success(`Đã phân công ${selectedZones.length} khu vực`);
      setSelectedZones([]);
      setSelectedBuildingForZone("");
      onSuccess?.();
    } catch (error) {
      console.error("Error assigning zones:", error);
      toast.error("Không thể phân công khu vực");
    } finally {
      setLoading(false);
    }
  };

  // Handle assign areas
  const handleAssignAreas = async () => {
    if (!staff || selectedAreas.length === 0) {
      toast.error("Vui lòng chọn ít nhất một khu vực ngoài trời");
      return;
    }

    try {
      setLoading(true);
      await assignAreasToAccount(staff._id, selectedAreas);
      toast.success(`Đã phân công ${selectedAreas.length} khu vực ngoài trời`);
      setSelectedAreas([]);
      onSuccess?.();
    } catch (error) {
      console.error("Error assigning areas:", error);
      toast.error("Không thể phân công khu vực ngoài trời");
    } finally {
      setLoading(false);
    }
  };

  // Handle remove campus
  const handleRemoveCampus = async () => {
    if (!staff) return;

    try {
      setLoading(true);
      await removeCampusFromAccount(staff._id);
      toast.success("Đã xóa phân công cơ sở");
      onSuccess?.();
    } catch (error) {
      console.error("Error removing campus:", error);
      toast.error("Không thể xóa phân công cơ sở");
    } finally {
      setLoading(false);
    }
  };

  // Handle remove building
  const handleRemoveBuilding = async (buildingId: string) => {
    if (!staff) return;

    try {
      setLoading(true);
      await removeBuildingFromAccount(staff._id, buildingId);
      toast.success("Đã xóa phân công tòa nhà");
      onSuccess?.();
    } catch (error) {
      console.error("Error removing building:", error);
      toast.error("Không thể xóa phân công tòa nhà");
    } finally {
      setLoading(false);
    }
  };

  // Handle remove zone
  const handleRemoveZone = async (zoneId: string) => {
    if (!staff) return;

    try {
      setLoading(true);
      await removeZoneFromAccount(staff._id, zoneId);
      toast.success("Đã xóa phân công khu vực");
      onSuccess?.();
    } catch (error) {
      console.error("Error removing zone:", error);
      toast.error("Không thể xóa phân công khu vực");
    } finally {
      setLoading(false);
    }
  };

  // Handle remove area
  const handleRemoveArea = async (areaId: string) => {
    if (!staff) return;

    try {
      setLoading(true);
      await removeAreaFromAccount(staff._id, areaId);
      toast.success("Đã xóa phân công khu vực ngoài trời");
      onSuccess?.();
    } catch (error) {
      console.error("Error removing area:", error);
      toast.error("Không thể xóa phân công khu vực ngoài trời");
    } finally {
      setLoading(false);
    }
  };

  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Phân công khu vực phụ trách</DialogTitle>
          <DialogDescription>
            Quản lý khu vực phụ trách cho: <strong>{staff.fullName}</strong>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campus">Cơ sở</TabsTrigger>
            <TabsTrigger value="building">Tòa nhà</TabsTrigger>
            <TabsTrigger value="zone">Khu vực nội bộ</TabsTrigger>
            <TabsTrigger value="area">Khu vực ngoài trời</TabsTrigger>
          </TabsList>

          {/* Campus Tab */}
          <TabsContent value="campus" className="space-y-4">
            {/* Current assignment */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Cơ sở hiện tại</Label>
                {staff.campusManaged && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCampus}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Xóa
                  </Button>
                )}
              </div>
              {staff.campusManaged ? (
                <Badge variant="outline" className="gap-2">
                  <Home className="h-3 w-3" />
                  {staff.campusManaged.name}
                </Badge>
              ) : (
                <p className="text-sm text-muted-foreground">Chưa phân công</p>
              )}
            </div>

            {/* Assign new */}
            <div className="space-y-3">
              <Label>Phân công cơ sở mới</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedCampus}
                  onValueChange={setSelectedCampus}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Chọn cơ sở..." />
                  </SelectTrigger>
                  <SelectContent>
                    {campuses.map((campus) => (
                      <SelectItem key={campus._id} value={campus._id}>
                        {campus.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAssignCampus}
                  disabled={!selectedCampus || loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Phân công
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Building Tab */}
          <TabsContent value="building" className="space-y-4">
            {/* Current assignments */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <Label className="text-sm font-medium mb-2 block">
                Tòa nhà hiện tại
              </Label>
              {staff.buildingsManaged && staff.buildingsManaged.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {staff.buildingsManaged.map((building) => (
                    <Badge
                      key={building._id}
                      variant="outline"
                      className="gap-2"
                    >
                      <Building2 className="h-3 w-3" />
                      {building.name}
                      <button
                        onClick={() => handleRemoveBuilding(building._id)}
                        disabled={loading}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Chưa phân công</p>
              )}
            </div>

            {/* Assign new */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Bước 1: Chọn cơ sở</Label>
                <Select
                  value={selectedCampusForBuilding}
                  onValueChange={setSelectedCampusForBuilding}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cơ sở..." />
                  </SelectTrigger>
                  <SelectContent>
                    {campuses.map((campus) => (
                      <SelectItem key={campus._id} value={campus._id}>
                        {campus.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCampusForBuilding && (
                <>
                  <div className="space-y-2">
                    <Label>Bước 2: Phân công tòa nhà</Label>
                    <div className="flex gap-2">
                      <Select
                        value={selectedBuildings.length > 0 ? "selected" : ""}
                        onValueChange={(value) => {
                          if (value && value !== "selected") {
                            setSelectedBuildings((prev) =>
                              prev.includes(value) ? prev : [...prev, value]
                            );
                          }
                        }}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Chọn tòa nhà..." />
                        </SelectTrigger>
                        <SelectContent>
                          {buildings.length > 0 ? (
                            buildings.map((building) => (
                              <SelectItem
                                key={building._id}
                                value={building._id}
                              >
                                {building.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty" disabled>
                              Không có tòa nhà
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleAssignBuildings}
                        disabled={selectedBuildings.length === 0 || loading}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        Phân công
                      </Button>
                    </div>
                  </div>
                  {selectedBuildings.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedBuildings.map((id) => {
                        const building = buildings.find((b) => b._id === id);
                        return building ? (
                          <Badge key={id} variant="secondary">
                            {building.name}
                            <button
                              onClick={() =>
                                setSelectedBuildings((prev) =>
                                  prev.filter((bid) => bid !== id)
                                )
                              }
                              className="ml-2"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {/* Zone Tab */}
          <TabsContent value="zone" className="space-y-4">
            {/* Current assignments */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <Label className="text-sm font-medium mb-2 block">
                Khu vực nội bộ hiện tại
              </Label>
              {staff.zonesManaged && staff.zonesManaged.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {staff.zonesManaged.map((zone) => (
                    <Badge key={zone._id} variant="outline" className="gap-2">
                      <MapPin className="h-3 w-3" />
                      {zone.name}
                      <button
                        onClick={() => handleRemoveZone(zone._id)}
                        disabled={loading}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Chưa phân công</p>
              )}
            </div>

            {/* Assign new */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Bước 1: Chọn cơ sở</Label>
                <Select
                  value={selectedCampusForZone}
                  onValueChange={setSelectedCampusForZone}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cơ sở..." />
                  </SelectTrigger>
                  <SelectContent>
                    {campuses.map((campus) => (
                      <SelectItem key={campus._id} value={campus._id}>
                        {campus.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCampusForZone && (
                <div className="space-y-2">
                  <Label>Bước 2: Chọn tòa nhà</Label>
                  <Select
                    value={selectedBuildingForZone}
                    onValueChange={setSelectedBuildingForZone}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tòa nhà..." />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.length > 0 ? (
                        buildings.map((building) => (
                          <SelectItem key={building._id} value={building._id}>
                            {building.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          Không có tòa nhà
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedBuildingForZone && (
                <>
                  <div className="space-y-2">
                    <Label>Bước 3: Phân công khu vực nội bộ</Label>
                    <div className="flex gap-2">
                      <Select
                        value={selectedZones.length > 0 ? "selected" : ""}
                        onValueChange={(value) => {
                          if (value && value !== "selected") {
                            setSelectedZones((prev) =>
                              prev.includes(value) ? prev : [...prev, value]
                            );
                          }
                        }}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Chọn khu vực..." />
                        </SelectTrigger>
                        <SelectContent>
                          {zones.length > 0 ? (
                            zones.map((zone) => (
                              <SelectItem key={zone._id} value={zone._id}>
                                {zone.name} - Tầng {zone.floorLocation}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty" disabled>
                              Không có khu vực
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleAssignZones}
                        disabled={selectedZones.length === 0 || loading}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        Phân công
                      </Button>
                    </div>
                  </div>
                  {selectedZones.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedZones.map((id) => {
                        const zone = zones.find((z) => z._id === id);
                        return zone ? (
                          <Badge key={id} variant="secondary">
                            {zone.name}
                            <button
                              onClick={() =>
                                setSelectedZones((prev) =>
                                  prev.filter((zid) => zid !== id)
                                )
                              }
                              className="ml-2"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {/* Area Tab */}
          <TabsContent value="area" className="space-y-4">
            {/* Current assignments */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <Label className="text-sm font-medium mb-2 block">
                Khu vực ngoài trời hiện tại
              </Label>
              {staff.areasManaged && staff.areasManaged.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {staff.areasManaged.map((area) => (
                    <Badge key={area._id} variant="outline" className="gap-2">
                      <MapPin className="h-3 w-3" />
                      {area.name}
                      <button
                        onClick={() => handleRemoveArea(area._id)}
                        disabled={loading}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Chưa phân công</p>
              )}
            </div>

            {/* Assign new */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Bước 1: Chọn cơ sở</Label>
                <Select
                  value={selectedCampusForArea}
                  onValueChange={setSelectedCampusForArea}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cơ sở..." />
                  </SelectTrigger>
                  <SelectContent>
                    {campuses.map((campus) => (
                      <SelectItem key={campus._id} value={campus._id}>
                        {campus.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCampusForArea && (
                <>
                  <div className="space-y-2">
                    <Label>Bước 2: Phân công khu vực ngoài trời</Label>
                    <div className="flex gap-2">
                      <Select
                        value={selectedAreas.length > 0 ? "selected" : ""}
                        onValueChange={(value) => {
                          if (value && value !== "selected") {
                            setSelectedAreas((prev) =>
                              prev.includes(value) ? prev : [...prev, value]
                            );
                          }
                        }}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Chọn khu vực..." />
                        </SelectTrigger>
                        <SelectContent>
                          {areas.length > 0 ? (
                            areas.map((area) => (
                              <SelectItem key={area._id} value={area._id}>
                                {area.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty" disabled>
                              Không có khu vực ngoài trời
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleAssignAreas}
                        disabled={selectedAreas.length === 0 || loading}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        Phân công
                      </Button>
                    </div>
                  </div>
                  {selectedAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedAreas.map((id) => {
                        const area = areas.find((a) => a._id === id);
                        return area ? (
                          <Badge key={id} variant="secondary">
                            {area.name}
                            <button
                              onClick={() =>
                                setSelectedAreas((prev) =>
                                  prev.filter((aid) => aid !== id)
                                )
                              }
                              className="ml-2"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
