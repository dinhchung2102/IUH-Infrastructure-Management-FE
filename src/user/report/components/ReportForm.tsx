import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reveal } from "@/components/motion";
import { FileText, Upload } from "lucide-react";
import { getReportTypes } from "../api/report.api";
import type { ReportType } from "../types/report.types";
import { getCampuses, type Campus } from "../api/campus.api";
import { getOutdoorAreasByCampusId, type Area } from "../api/area.api";
import {
  getBuildingsByCampusId,
  getZonesByBuildingFloor,
  type Building,
  type ZoneArea,
} from "../api/building.api";
import {
  getAssetsByZoneId,
  getAssetsByAreaId,
  type Asset,
} from "../api/asset.api";

const areaTypes = [
  { value: "outdoor", label: "Khu vực ngoài trời" },
  { value: "building", label: "Tòa nhà" },
];

export function ReportForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Form state
  const [selectedCampus, setSelectedCampus] = useState("");
  const [areaType, setAreaType] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedOutdoorArea, setSelectedOutdoorArea] = useState("");
  const [selectedIndoorZone, setSelectedIndoorZone] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Data from API
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [outdoorAreas, setOutdoorAreas] = useState<Area[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [indoorZoneAreas, setIndoorZoneAreas] = useState<ZoneArea[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);

  // Get selected asset object
  const selectedAssetObj = assets.find((a) => a._id === selectedAsset);

  // Get available floors for selected building
  const availableFloors =
    buildings.find((b) => b._id === selectedBuilding)?.floor || 0;

  // Fetch report types and campuses
  useEffect(() => {
    Promise.all([getReportTypes(), getCampuses()])
      .then(([reportTypesRes, campusesRes]) => {
        if (reportTypesRes.data.reportTypes) {
          setReportTypes(reportTypesRes.data.reportTypes);
        }
        if (campusesRes.data?.campuses) {
          setCampuses(campusesRes.data?.campuses || []);
        }
        console.log("[REPORT TYPES]:", reportTypesRes.data.reportTypes);
        console.log("[CAMPUSES]:", campusesRes.data?.campuses);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Load user info from localStorage if logged in
  useEffect(() => {
    const accountData = localStorage.getItem("account");
    if (accountData) {
      try {
        const account = JSON.parse(accountData);
        setFullName(account.fullName || account.name || "");
        setEmail(account.email || "");
      } catch (error) {
        console.error("Error parsing account data:", error);
      }
    }
  }, []);

  // Reset area type when campus changes
  useEffect(() => {
    if (selectedCampus) {
      setAreaType("");
      setOutdoorAreas([]);
      setBuildings([]);
      setSelectedBuilding("");
      setSelectedFloor("");
      setIndoorZoneAreas([]);
    }
  }, [selectedCampus]);

  // Reset floor when building changes
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
            console.log("[OUTDOOR AREAS]:", res.data.areas);
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
            console.log("[BUILDINGS]:", res.data.buildings);
          }
        })
        .catch((error) => {
          console.error("Error fetching buildings:", error);
          setBuildings([]);
        });
    }
  }, [selectedCampus, areaType]);

  // Fetch indoor zone areas when building and floor are selected
  useEffect(() => {
    if (selectedBuilding && selectedFloor && areaType === "building") {
      const floorNumber = parseInt(selectedFloor);
      getZonesByBuildingFloor(selectedBuilding, floorNumber)
        .then((res) => {
          if (res.data?.zones) {
            setIndoorZoneAreas(res.data.zones);
            console.log("[INDOOR ZONE AREAS]:", res.data.zones);
          }
        })
        .catch((error) => {
          console.error("Error fetching indoor zone areas:", error);
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
            console.log("[OUTDOOR ASSETS]:", res.data.assets);
          }
        })
        .catch((error) => {
          console.error("Error fetching outdoor assets:", error);
          setAssets([]);
        });
    } else if (areaType === "outdoor" && !selectedOutdoorArea) {
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
            console.log("[INDOOR ASSETS]:", res.data.assets);
          }
        })
        .catch((error) => {
          console.error("Error fetching indoor assets:", error);
          setAssets([]);
        });
    } else if (areaType === "building" && !selectedIndoorZone) {
      setAssets([]);
    }
  }, [selectedIndoorZone, areaType]);

  // Handle image file selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Clear old previews
    previewImages.forEach((url) => URL.revokeObjectURL(url));

    // Create new preview URLs
    const newPreviews = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages(newPreviews);
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Report submitted");
    // TODO: Implement API call
  };

  return (
    <Reveal delay={0}>
      <Card className="hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl">Báo cáo sự cố</CardTitle>
          <CardDescription>
            Vui lòng điền đầy đủ thông tin để chúng tôi có thể xử lý báo cáo của
            bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Thông tin người báo cáo
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Họ và tên *</Label>
                  <Input
                    id="fullname"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@iuh.edu.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Report Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Chi tiết báo cáo
              </h3>

              <div className="space-y-2">
                <Label htmlFor="report-type">Loại báo cáo *</Label>
                <Select required>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Chọn loại báo cáo" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.label}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả *</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết về vấn đề cần báo cáo..."
                  rows={5}
                  required
                />
              </div>

              {/* Campus, Area Type, Location and Equipment - 4 Columns in 1 Row */}
              <div className="grid gap-4 md:grid-cols-4">
                {/* Column 1: Campus */}
                <div className="space-y-2">
                  <Label htmlFor="campus">Cơ sở *</Label>
                  <Select required onValueChange={setSelectedCampus}>
                    <SelectTrigger id="campus" className="w-full">
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

                {/* Column 2: Area Type */}
                {selectedCampus && (
                  <div className="space-y-2">
                    <Label htmlFor="area-type">Loại khu vực *</Label>
                    <Select required onValueChange={setAreaType}>
                      <SelectTrigger id="area-type" className="w-full">
                        <SelectValue placeholder="Chọn loại" />
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
                )}

                {/* Column 3: Specific Location (Conditional) */}
                {areaType === "outdoor" && (
                  <div className="space-y-2">
                    <Label htmlFor="outdoor-area">Khu vực *</Label>
                    <Select required onValueChange={setSelectedOutdoorArea}>
                      <SelectTrigger id="outdoor-area" className="w-full">
                        <SelectValue placeholder="Chọn khu vực" />
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
                )}

                {/* Column 3: Building (when building type selected) */}
                {areaType === "building" && (
                  <div className="space-y-2">
                    <Label htmlFor="building">Tòa nhà *</Label>
                    <Select required onValueChange={setSelectedBuilding}>
                      <SelectTrigger id="building" className="w-full">
                        <SelectValue placeholder="Chọn tòa nhà" />
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

                {/* Column 4: Floor (when building selected) */}
                {areaType === "building" && selectedBuilding && (
                  <div className="space-y-2">
                    <Label htmlFor="floor">Tầng *</Label>
                    <Select required onValueChange={setSelectedFloor}>
                      <SelectTrigger id="floor" className="w-full">
                        <SelectValue placeholder="Chọn tầng" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
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
                )}

                {/* Column 4: Equipment (only for outdoor) */}
                {areaType === "outdoor" && selectedOutdoorArea && (
                  <div className="space-y-2">
                    <Label htmlFor="equipment-outdoor">Thiết bị (nếu có)</Label>
                    <Select onValueChange={setSelectedAsset}>
                      <SelectTrigger id="equipment-outdoor" className="w-full">
                        <SelectValue placeholder="Chọn thiết bị" />
                      </SelectTrigger>
                      <SelectContent>
                        {assets.length > 0 ? (
                          assets.map((asset) => (
                            <SelectItem key={asset._id} value={asset._id}>
                              {asset.name}
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
                )}
              </div>

              {/* Row 2: Indoor Zone Area + Equipment (when floor is selected) */}
              {areaType === "building" && selectedBuilding && selectedFloor && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="zone-area">Khu vực nội bộ *</Label>
                    <Select required onValueChange={setSelectedIndoorZone}>
                      <SelectTrigger id="zone-area" className="w-full">
                        <SelectValue placeholder="Chọn khu vực" />
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
                  {selectedIndoorZone && (
                    <div className="space-y-2">
                      <Label htmlFor="equipment-building">
                        Thiết bị (nếu có)
                      </Label>
                      <Select onValueChange={setSelectedAsset}>
                        <SelectTrigger
                          id="equipment-building"
                          className="w-full"
                        >
                          <SelectValue placeholder="Chọn thiết bị" />
                        </SelectTrigger>
                        <SelectContent>
                          {assets.length > 0 ? (
                            assets.map((asset) => (
                              <SelectItem key={asset._id} value={asset._id}>
                                {asset.name}
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
                  )}
                </div>
              )}
            </div>

            {/* Asset Image + File Upload Preview - 2 Columns */}
            <div
              className={`grid gap-4 ${
                selectedAssetObj && selectedAssetObj.image
                  ? "md:grid-cols-2"
                  : "md:grid-cols-1"
              }`}
            >
              {/* Asset Image Preview */}
              {selectedAssetObj && selectedAssetObj.image && (
                <div className="space-y-2">
                  <Label>Hình ảnh thiết bị</Label>
                  <div className="rounded-lg border p-4 bg-muted/30">
                    <img
                      src={`${import.meta.env.VITE_URL_UPLOADS}${
                        selectedAssetObj.image
                      }`}
                      alt={selectedAssetObj.name}
                      className="w-full h-auto rounded-lg object-contain"
                    />
                    <p className="mt-2 text-center text-sm font-medium">
                      {selectedAssetObj.name}
                    </p>
                  </div>
                </div>
              )}

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="attachments">Hình ảnh báo cáo</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={handleImageChange}
                  />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ: JPG, PNG (Tối đa 5MB mỗi file)
                </p>

                {/* Image Preview */}
                {previewImages.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Preview ({previewImages.length} ảnh)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {previewImages.map((url, index) => (
                        <div
                          key={index}
                          className="rounded-lg border p-2 bg-muted/30"
                        >
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-auto rounded object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full hover:scale-105 transition-transform"
              size="lg"
            >
              <FileText className="h-4 w-4" />
              Gửi báo cáo
            </Button>
          </form>
        </CardContent>
      </Card>
    </Reveal>
  );
}
