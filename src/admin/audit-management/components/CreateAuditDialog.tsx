import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { createAudit, type CreateAuditDto } from "../api/audit.api";
import { getStaff } from "@/admin/staff-management/api/staff.api";
import type { StaffResponse } from "@/admin/staff-management/types/staff.type";
import { Loader2, CheckCircle2, X } from "lucide-react";
import { getCampuses, type Campus } from "@/user/report/api/campus.api";
import {
  getOutdoorAreasByCampusId,
  type Area,
} from "@/user/report/api/area.api";
import {
  getBuildingsByCampusId,
  getZonesByBuildingFloor,
  type Building,
  type ZoneArea,
} from "@/user/report/api/building.api";
import {
  getAssetsByZoneId,
  getAssetsByAreaId,
  type Asset,
} from "@/user/report/api/asset.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateAuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  reportId?: string; // Optional - if creating from report
  assetId?: string; // Optional - if creating from asset
  suggestedProcessingDays?: number; // Optional - AI suggested processing days from report (only available when creating from report)
}

const getUserInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const areaTypes = [
  { value: "outdoor", label: "Khu vực ngoài trời" },
  { value: "building", label: "Tòa nhà" },
];

export function CreateAuditDialog({
  open,
  onOpenChange,
  onSuccess,
  reportId,
  assetId,
  suggestedProcessingDays,
}: CreateAuditDialogProps) {
  const [loading, setLoading] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [staffList, setStaffList] = useState<StaffResponse[]>([]);
  const [searchStaff, setSearchStaff] = useState("");
  const [expirationDays, setExpirationDays] = useState<string>(
    suggestedProcessingDays ? String(suggestedProcessingDays) : ""
  );

  // Asset selection states
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [areaType, setAreaType] = useState("");
  const [outdoorAreas, setOutdoorAreas] = useState<Area[]>([]);
  const [selectedOutdoorArea, setSelectedOutdoorArea] = useState("");
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [indoorZoneAreas, setIndoorZoneAreas] = useState<ZoneArea[]>([]);
  const [selectedIndoorZone, setSelectedIndoorZone] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState("");

  const [formData, setFormData] = useState<CreateAuditDto>({
    status: "PENDING",
    subject: "",
    description: "",
    staffs: [],
    report: reportId,
    asset: assetId || selectedAsset,
  });

  const availableFloors =
    buildings.find((b) => b._id === selectedBuilding)?.floor || 0;

  // Fetch staff list
  const fetchStaff = async () => {
    try {
      setLoadingStaff(true);
      const response = await getStaff({
        page: 1,
        limit: 100,
        search: searchStaff || undefined,
      });
      if (response.success && response.data) {
        setStaffList(response.data.accounts);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoadingStaff(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchStaff();
      fetchCampuses();
      // Set suggestedProcessingDays as default value if available (only when creating from report)
      // Note: suggestedProcessingDays is a field from report, not from audit log
      if (suggestedProcessingDays) {
        setExpirationDays(String(suggestedProcessingDays));
      } else {
        setExpirationDays("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, suggestedProcessingDays]);

  // Fetch campuses
  const fetchCampuses = async () => {
    try {
      const response = await getCampuses();
      if (response.data?.campuses) {
        setCampuses(response.data.campuses);
      }
    } catch (error) {
      console.error("Error fetching campuses:", error);
    }
  };

  // Reset selections when campus changes
  useEffect(() => {
    if (selectedCampus) {
      setAreaType("");
      setOutdoorAreas([]);
      setBuildings([]);
      setSelectedOutdoorArea("");
      setSelectedBuilding("");
      setSelectedFloor("");
      setIndoorZoneAreas([]);
      setSelectedIndoorZone("");
      setAssets([]);
      setSelectedAsset("");
    }
  }, [selectedCampus]);

  // Reset when area type changes
  useEffect(() => {
    setSelectedOutdoorArea("");
    setSelectedBuilding("");
    setSelectedFloor("");
    setSelectedIndoorZone("");
    setAssets([]);
    setSelectedAsset("");
    if (areaType === "building") {
      setOutdoorAreas([]);
    } else if (areaType === "outdoor") {
      setBuildings([]);
      setIndoorZoneAreas([]);
    }
  }, [areaType]);

  // Reset when building changes
  useEffect(() => {
    if (selectedBuilding) {
      setSelectedFloor("");
      setIndoorZoneAreas([]);
    }
  }, [selectedBuilding]);

  // Fetch outdoor areas or buildings when area type changes
  useEffect(() => {
    if (selectedCampus && areaType === "outdoor") {
      getOutdoorAreasByCampusId(selectedCampus)
        .then((res) => {
          if (res.data?.areas) {
            setOutdoorAreas(res.data.areas);
          }
        })
        .catch((error) => {
          console.error("Error fetching outdoor areas:", error);
          setOutdoorAreas([]);
        });
    } else if (selectedCampus && areaType === "building") {
      getBuildingsByCampusId(selectedCampus)
        .then((res) => {
          if (res.data?.buildings) {
            setBuildings(res.data.buildings);
          }
        })
        .catch((error) => {
          console.error("Error fetching buildings:", error);
          setBuildings([]);
        });
    }
  }, [selectedCampus, areaType]);

  // Fetch indoor zones when building and floor are selected
  useEffect(() => {
    if (selectedBuilding && selectedFloor && areaType === "building") {
      const floorNumber = parseInt(selectedFloor);
      getZonesByBuildingFloor(selectedBuilding, floorNumber)
        .then((res) => {
          if (res.data?.zones) {
            setIndoorZoneAreas(res.data.zones);
          }
        })
        .catch((error) => {
          console.error("Error fetching zones:", error);
          setIndoorZoneAreas([]);
        });
    } else {
      setIndoorZoneAreas([]);
    }
  }, [selectedBuilding, selectedFloor, areaType]);

  // Fetch assets for outdoor area
  useEffect(() => {
    if (selectedOutdoorArea && areaType === "outdoor") {
      getAssetsByAreaId(selectedOutdoorArea)
        .then((res) => {
          if (res.data?.assets) {
            setAssets(res.data.assets);
          }
        })
        .catch((error) => {
          console.error("Error fetching assets:", error);
          setAssets([]);
        });
    } else {
      setAssets([]);
    }
  }, [selectedOutdoorArea, areaType]);

  // Fetch assets for indoor zone
  useEffect(() => {
    if (selectedIndoorZone && areaType === "building") {
      getAssetsByZoneId(selectedIndoorZone)
        .then((res) => {
          if (res.data?.assets) {
            setAssets(res.data.assets);
          }
        })
        .catch((error) => {
          console.error("Error fetching assets:", error);
          setAssets([]);
        });
    }
  }, [selectedIndoorZone, areaType]);

  // Update formData.asset when selectedAsset changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      asset: selectedAsset || assetId,
    }));
  }, [selectedAsset, assetId]);

  // Reset form when reportId changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      report: reportId,
    }));
  }, [reportId]);

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();

    // Validation
    if (!formData.subject || formData.subject.length < 5) {
      toast.error("Tiêu đề phải có ít nhất 5 ký tự");
      return;
    }

    if (formData.staffs.length === 0) {
      toast.error("Vui lòng chọn ít nhất một nhân viên");
      return;
    }

    if (!reportId && !selectedAsset) {
      toast.error("Vui lòng chọn thiết bị");
      return;
    }

    if (!formData.report && !formData.asset) {
      toast.error("Phải có ít nhất báo cáo hoặc tài sản");
      return;
    }

    if (
      !expirationDays ||
      isNaN(Number(expirationDays)) ||
      Number(expirationDays) <= 0
    ) {
      toast.error("Vui lòng nhập số ngày hết hạn hợp lệ");
      return;
    }

    try {
      setLoading(true);

      // Calculate expiresAt: current date + number of days
      const currentDate = new Date();
      const daysToAdd = Number(expirationDays);
      const expiresAt = new Date(currentDate);
      expiresAt.setDate(expiresAt.getDate() + daysToAdd);

      await createAudit({
        ...formData,
        expiresAt: expiresAt.toISOString(),
      });
      toast.success("Tạo nhiệm vụ thành công!");
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error creating audit:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err.response?.data?.message || "Không thể tạo công việc bảo trì"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form data
    setFormData({
      status: "PENDING",
      subject: "",
      description: "",
      staffs: [],
      report: reportId,
      asset: assetId,
    });

    // Reset staff search
    setSearchStaff("");

    // Reset expiration days to suggestedProcessingDays if available (only when creating from report)
    // Note: suggestedProcessingDays is a field from report, not from audit log
    if (suggestedProcessingDays) {
      setExpirationDays(String(suggestedProcessingDays));
    } else {
      setExpirationDays("");
    }

    // Reset asset selection
    setSelectedCampus("");
    setAreaType("");
    setSelectedOutdoorArea("");
    setSelectedBuilding("");
    setSelectedFloor("");
    setSelectedIndoorZone("");
    setSelectedAsset("");
    setOutdoorAreas([]);
    setBuildings([]);
    setIndoorZoneAreas([]);
    setAssets([]);

    onOpenChange(false);
  };

  const handleToggleStaff = (staffId: string) => {
    setFormData((prev) => ({
      ...prev,
      staffs: prev.staffs.includes(staffId)
        ? prev.staffs.filter((id) => id !== staffId)
        : [...prev.staffs, staffId],
    }));
  };

  const selectedStaff = staffList.filter((staff) =>
    formData.staffs.includes(staff._id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Tạo nhiệm vụ mới</DialogTitle>
          <DialogDescription>
            {reportId
              ? "Tạo nhiệm vụ bảo trì từ báo cáo đã được phê duyệt"
              : "Tạo nhiệm vụ bảo trì trực tiếp cho tài sản"}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-180px)] overflow-y-auto pr-2">
          <div className="space-y-4">
            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">
                Tiêu đề <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                placeholder="Nhập tiêu đề nhiệm vụ (5-200 ký tự)"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                maxLength={200}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.subject.length}/200 ký tự
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả chi tiết</Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả chi tiết (10-1000 ký tự)"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                maxLength={1000}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {formData.description?.length || 0}/1000 ký tự
              </p>
            </div>

            {/* Expiration Days Input */}
            <div className="space-y-2">
              <Label htmlFor="expirationDays">
                Số ngày hết hạn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="expirationDays"
                type="number"
                min="1"
                placeholder="Nhập số ngày (ví dụ: 7)"
                value={expirationDays}
                onChange={(e) => setExpirationDays(e.target.value)}
                className="bg-white"
              />
              <p className="text-xs text-muted-foreground">
                Nhiệm vụ sẽ hết hạn sau số ngày được nhập tính từ ngày hiện tại
              </p>
            </div>

            {/* Asset Selection - Only show if not from report */}
            {!reportId && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h3 className="text-sm font-semibold">
                  Chọn thiết bị <span className="text-red-500">*</span>
                </h3>

                {/* Row 1: Campus + Area Type */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="campus">Cơ sở</Label>
                    <Select
                      value={selectedCampus}
                      onValueChange={setSelectedCampus}
                    >
                      <SelectTrigger id="campus">
                        <SelectValue placeholder="Chọn cơ sở" />
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

                  <div className="space-y-2">
                    <Label htmlFor="area-type">Loại khu vực</Label>
                    <Select
                      value={areaType}
                      onValueChange={setAreaType}
                      disabled={!selectedCampus}
                    >
                      <SelectTrigger id="area-type">
                        <SelectValue
                          placeholder={
                            !selectedCampus
                              ? "Vui lòng chọn cơ sở trước"
                              : "Chọn loại khu vực"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {areaTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2: Location Details */}
                <div className="grid gap-3 md:grid-cols-2">
                  {areaType === "outdoor" ? (
                    <div className="space-y-2">
                      <Label htmlFor="outdoor-area">Khu vực ngoài trời</Label>
                      <Select
                        value={selectedOutdoorArea}
                        onValueChange={setSelectedOutdoorArea}
                        disabled={!areaType}
                      >
                        <SelectTrigger id="outdoor-area">
                          <SelectValue
                            placeholder={
                              outdoorAreas.length === 0
                                ? "Không có khu vực"
                                : "Chọn khu vực"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {outdoorAreas.length > 0 ? (
                            outdoorAreas.map((area) => (
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
                    </div>
                  ) : areaType === "building" ? (
                    <div className="space-y-2">
                      <Label htmlFor="building">Tòa nhà</Label>
                      <Select
                        value={selectedBuilding}
                        onValueChange={setSelectedBuilding}
                        disabled={!areaType}
                      >
                        <SelectTrigger id="building">
                          <SelectValue
                            placeholder={
                              buildings.length === 0
                                ? "Không có tòa nhà"
                                : "Chọn tòa nhà"
                            }
                          />
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
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Vị trí</Label>
                      <Select disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="Vui lòng chọn loại khu vực" />
                        </SelectTrigger>
                      </Select>
                    </div>
                  )}

                  {areaType === "building" ? (
                    <div className="space-y-2">
                      <Label htmlFor="floor">Tầng</Label>
                      <Select
                        value={selectedFloor}
                        onValueChange={setSelectedFloor}
                        disabled={!selectedBuilding}
                      >
                        <SelectTrigger id="floor">
                          <SelectValue
                            placeholder={
                              !selectedBuilding
                                ? "Vui lòng chọn tòa nhà"
                                : "Chọn tầng"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {availableFloors > 0 &&
                            Array.from(
                              { length: availableFloors },
                              (_, i) => i + 1
                            ).map((floor) => (
                              <SelectItem key={floor} value={floor.toString()}>
                                Tầng {floor}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : areaType === "outdoor" ? (
                    <div className="space-y-2">
                      <Label htmlFor="asset-outdoor">Thiết bị</Label>
                      <Select
                        value={selectedAsset}
                        onValueChange={setSelectedAsset}
                        disabled={!selectedOutdoorArea}
                      >
                        <SelectTrigger id="asset-outdoor">
                          <SelectValue
                            placeholder={
                              !selectedOutdoorArea
                                ? "Vui lòng chọn khu vực"
                                : assets.length === 0
                                ? "Không có thiết bị"
                                : "Chọn thiết bị"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {assets.length > 0 ? (
                            assets.map((asset) => (
                              <SelectItem key={asset._id} value={asset._id}>
                                {asset.name} - {asset.code}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty" disabled>
                              Không có thiết bị
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">
                        Tầng / Thiết bị
                      </Label>
                      <Select disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="Vui lòng chọn loại khu vực" />
                        </SelectTrigger>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Row 3: Indoor Zone + Asset (only for building) */}
                {areaType === "building" && (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="zone-area">Khu vực nội bộ</Label>
                      <Select
                        value={selectedIndoorZone}
                        onValueChange={setSelectedIndoorZone}
                        disabled={!selectedFloor}
                      >
                        <SelectTrigger id="zone-area">
                          <SelectValue
                            placeholder={
                              !selectedFloor
                                ? "Vui lòng chọn tầng"
                                : indoorZoneAreas.length === 0
                                ? "Không có khu vực"
                                : "Chọn khu vực"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {indoorZoneAreas.length > 0 ? (
                            indoorZoneAreas.map((zone) => (
                              <SelectItem key={zone._id} value={zone._id}>
                                {zone.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty" disabled>
                              Không có khu vực nội bộ ở tầng này
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="asset-building">Thiết bị</Label>
                      <Select
                        value={selectedAsset}
                        onValueChange={setSelectedAsset}
                        disabled={!selectedIndoorZone}
                      >
                        <SelectTrigger id="asset-building">
                          <SelectValue
                            placeholder={
                              !selectedIndoorZone
                                ? "Vui lòng chọn khu vực"
                                : assets.length === 0
                                ? "Không có thiết bị"
                                : "Chọn thiết bị"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {assets.length > 0 ? (
                            assets.map((asset) => (
                              <SelectItem key={asset._id} value={asset._id}>
                                {asset.name} - {asset.code}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty" disabled>
                              Không có thiết bị
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Selected Staff Display */}
            {formData.staffs.length > 0 && (
              <div className="space-y-2">
                <Label>Nhân viên được chọn ({formData.staffs.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedStaff.map((staff) => (
                    <Badge
                      key={staff._id}
                      variant="secondary"
                      className="pl-1 pr-2 py-1 gap-1"
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[10px]">
                          {getUserInitials(staff.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{staff.fullName}</span>
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleToggleStaff(staff._id)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Staff Search */}
            <div className="space-y-2">
              <Label htmlFor="search-staff">Tìm và chọn nhân viên</Label>
              <Input
                id="search-staff"
                placeholder="Tìm theo tên nhân viên..."
                value={searchStaff}
                onChange={(e) => {
                  setSearchStaff(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    fetchStaff();
                  }
                }}
                className="bg-white"
              />
            </div>

            {/* Staff List */}
            <div className="space-y-2">
              <Label>Danh sách nhân viên</Label>
              <div className="border rounded-lg bg-white max-h-[300px] overflow-y-auto">
                {loadingStaff ? (
                  <div className="py-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Đang tải...
                    </p>
                  </div>
                ) : !staffList || staffList.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Không tìm thấy nhân viên
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {staffList.map((staff) => (
                      <div
                        key={staff._id}
                        className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                          formData.staffs.includes(staff._id)
                            ? "bg-primary/5"
                            : ""
                        }`}
                        onClick={() => handleToggleStaff(staff._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="text-xs">
                                {getUserInitials(staff.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {staff.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {staff.email}
                              </p>
                            </div>
                          </div>
                          {formData.staffs.includes(staff._id) && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              loading ||
              !formData.subject ||
              formData.subject.length < 5 ||
              formData.staffs.length === 0 ||
              (!reportId && !selectedAsset) ||
              !expirationDays ||
              isNaN(Number(expirationDays)) ||
              Number(expirationDays) <= 0
            }
            className="cursor-pointer"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Tạo nhiệm vụ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
