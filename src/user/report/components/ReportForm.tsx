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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Reveal } from "@/components/motion";
import { FileText, Upload } from "lucide-react";
import { getReportTypes, createReport, sendReportOTP } from "../api/report.api";
import type { ReportType } from "../types/report.types";
import { getCampuses, type Campus } from "../api/campus.api";
import { toast } from "sonner";
// import { useNavigate } from "react-router-dom"; // Uncomment if using navigation
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
  // const navigate = useNavigate(); // Uncomment if you want to redirect after submit

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // OTP Dialog for non-authenticated users
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Form state
  const [selectedCampus, setSelectedCampus] = useState("");
  const [areaType, setAreaType] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedOutdoorArea, setSelectedOutdoorArea] = useState("");
  const [selectedIndoorZone, setSelectedIndoorZone] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedReportType, setSelectedReportType] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<
    { url: string; type: string; name: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (reportTypesRes.data?.reportTypes) {
          setReportTypes(reportTypesRes.data.reportTypes);
        }
        if (campusesRes.data?.campuses) {
          setCampuses(campusesRes.data?.campuses || []);
        }
        console.log("[REPORT TYPES]:", reportTypesRes.data?.reportTypes);
        console.log("[CAMPUSES]:", campusesRes.data?.campuses);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Load user info from localStorage and check authentication
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const accountData = localStorage.getItem("account");

    if (token && accountData) {
      setIsAuthenticated(true);
      try {
        const account = JSON.parse(accountData);
        setFullName(account.fullName || account.name || "");
        setEmail(account.email || "");
      } catch (error) {
        console.error("Error parsing account data:", error);
      }
    } else {
      setIsAuthenticated(false);
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

  // Handle file selection and preview (images + videos)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Clear old previews
    previewImages.forEach((preview) => URL.revokeObjectURL(preview.url));

    // Store actual files
    const filesArray = Array.from(files);
    setSelectedFiles(filesArray);

    // Create new preview URLs with file type
    const newPreviews = filesArray.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
    }));
    setPreviewImages(newPreviews);
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewImages.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previewImages]);

  // Create report with FormData
  const submitReport = async (otpCode?: string) => {
    try {
      const formData = new FormData();
      formData.append("asset", selectedAsset);
      formData.append("type", selectedReportType);
      formData.append("description", description.trim());
      formData.append("email", email.trim());

      // For non-authenticated users, add OTP
      if (!isAuthenticated && otpCode) {
        formData.append("authOTP", otpCode);
      }

      // Append all files
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Create report
      toast.info("Đang gửi báo cáo...");
      await createReport(formData);

      toast.success("Báo cáo đã được gửi thành công!");
      setShowOtpDialog(false);

      // Reset form or redirect
      setTimeout(() => {
        // Reset form
        setSelectedReportType("");
        setDescription("");
        setSelectedFiles([]);
        setPreviewImages([]);
        setSelectedAsset("");
        setOtp("");
        // Or navigate
        // navigate("/");
      }, 1500);
    } catch (error: unknown) {
      console.error("Error submitting report:", error);
      let errorMsg = "Lỗi khi gửi báo cáo. Vui lòng thử lại.";

      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
      ) {
        errorMsg = error.response.data.message;
      }

      toast.error(errorMsg);
      throw error;
    }
  };

  // Handle verify OTP and submit
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Vui lòng nhập mã OTP");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      await submitReport(otp);
    } catch {
      // Error already handled in submitReport
    } finally {
      setIsVerifyingOtp(false);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedReportType) {
      toast.error("Vui lòng chọn loại báo cáo");
      return;
    }

    if (!description.trim()) {
      toast.error("Vui lòng nhập mô tả chi tiết");
      return;
    }

    // Validate description length
    if (description.trim().length < 10) {
      toast.error("Mô tả phải có ít nhất 10 ký tự");
      return;
    }

    if (description.trim().length > 1000) {
      toast.error("Mô tả không được quá 1000 ký tự");
      return;
    }

    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }

    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    // Validate images are required
    if (selectedFiles.length === 0) {
      toast.error("Vui lòng tải lên ít nhất 1 hình ảnh");
      return;
    }

    if (!selectedAsset) {
      toast.error("Vui lòng chọn thiết bị cần báo cáo");
      return;
    }

    setIsSubmitting(true);

    // If authenticated, submit directly
    if (isAuthenticated) {
      try {
        await submitReport();
        setIsSubmitting(false);
      } catch {
        setIsSubmitting(false);
      }
      return;
    }

    // For non-authenticated users, send OTP first
    setIsSendingOtp(true);
    try {
      await sendReportOTP(email);
      toast.success("OTP đã được gửi đến email của bạn");
      setShowOtpDialog(true);
      setIsSendingOtp(false);
    } catch (error: unknown) {
      console.error("Error sending OTP:", error);
      let errorMsg = "Không thể gửi OTP. Vui lòng thử lại.";

      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
      ) {
        errorMsg = error.response.data.message;
      }

      toast.error(errorMsg);
      setIsSendingOtp(false);
      setIsSubmitting(false);
    }
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
                {isAuthenticated && (
                  <span className="ml-2 text-xs text-green-600 font-normal">
                    (Đã xác thực)
                  </span>
                )}
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
                    disabled={isAuthenticated}
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
                    disabled={isAuthenticated}
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
                <Select
                  required
                  value={selectedReportType}
                  onValueChange={setSelectedReportType}
                >
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Chọn loại báo cáo" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
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
                  placeholder="Mô tả chi tiết về vấn đề cần báo cáo... (10-1000 ký tự)"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/1000 ký tự
                </p>
              </div>

              {/* Row 1: Campus + Area Type */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Column 1: Campus */}
                <div className="space-y-2">
                  <Label htmlFor="campus">Cơ sở *</Label>
                  <Select
                    required
                    value={selectedCampus}
                    onValueChange={setSelectedCampus}
                  >
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
                <div className="space-y-2">
                  <Label htmlFor="area-type">Loại khu vực *</Label>
                  <Select
                    required
                    value={areaType}
                    onValueChange={setAreaType}
                    disabled={!selectedCampus}
                  >
                    <SelectTrigger id="area-type" className="w-full">
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

              {/* Row 2: Location Details (Building/Outdoor) + Floor/Equipment */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Outdoor Area OR Building */}
                {areaType === "outdoor" ? (
                  <div className="space-y-2">
                    <Label htmlFor="outdoor-area">Khu vực ngoài trời *</Label>
                    <Select
                      required
                      value={selectedOutdoorArea}
                      onValueChange={setSelectedOutdoorArea}
                      disabled={!areaType}
                    >
                      <SelectTrigger id="outdoor-area" className="w-full">
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
                    <Label htmlFor="building">Tòa nhà *</Label>
                    <Select
                      required
                      value={selectedBuilding}
                      onValueChange={setSelectedBuilding}
                      disabled={!areaType}
                    >
                      <SelectTrigger id="building" className="w-full">
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
                ) : (
                  <div className="space-y-2">
                    <Label
                      htmlFor="placeholder-location"
                      className="text-muted-foreground"
                    >
                      Vị trí *
                    </Label>
                    <Select disabled>
                      <SelectTrigger
                        id="placeholder-location"
                        className="w-full"
                      >
                        <SelectValue placeholder="Vui lòng chọn loại khu vực" />
                      </SelectTrigger>
                    </Select>
                  </div>
                )}

                {/* Floor (for building) OR Equipment (for outdoor) */}
                {areaType === "building" ? (
                  <div className="space-y-2">
                    <Label htmlFor="floor">Tầng *</Label>
                    <Select
                      required
                      value={selectedFloor}
                      onValueChange={setSelectedFloor}
                      disabled={!selectedBuilding}
                    >
                      <SelectTrigger id="floor" className="w-full">
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
                    <Label htmlFor="equipment-outdoor">Thiết bị (nếu có)</Label>
                    <Select
                      value={selectedAsset}
                      onValueChange={setSelectedAsset}
                      disabled={!selectedOutdoorArea}
                    >
                      <SelectTrigger id="equipment-outdoor" className="w-full">
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
                ) : (
                  <div className="space-y-2">
                    <Label
                      htmlFor="placeholder-floor"
                      className="text-muted-foreground"
                    >
                      Tầng / Thiết bị
                    </Label>
                    <Select disabled>
                      <SelectTrigger id="placeholder-floor" className="w-full">
                        <SelectValue placeholder="Vui lòng chọn loại khu vực" />
                      </SelectTrigger>
                    </Select>
                  </div>
                )}
              </div>

              {/* Row 3: Indoor Zone Area + Equipment (only for building) */}
              {areaType === "building" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="zone-area">Khu vực nội bộ *</Label>
                    <Select
                      required
                      value={selectedIndoorZone}
                      onValueChange={setSelectedIndoorZone}
                      disabled={!selectedFloor}
                    >
                      <SelectTrigger id="zone-area" className="w-full">
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
                    <Label htmlFor="equipment-building">
                      Thiết bị (nếu có)
                    </Label>
                    <Select
                      value={selectedAsset}
                      onValueChange={setSelectedAsset}
                      disabled={!selectedIndoorZone}
                    >
                      <SelectTrigger id="equipment-building" className="w-full">
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
                <Label htmlFor="attachments">Hình ảnh/Video báo cáo *</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="cursor-pointer"
                    onChange={handleImageChange}
                    required
                  />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ: JPG, PNG, MP4, MOV (Tối đa 10MB mỗi file)
                </p>

                {/* Media Preview */}
                {previewImages.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>
                      Preview ({previewImages.length}{" "}
                      {previewImages.length === 1 ? "file" : "files"})
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {previewImages.map((preview, index) => (
                        <div
                          key={index}
                          className="rounded-lg border p-2 bg-muted/30"
                        >
                          {preview.type.startsWith("image/") ? (
                            <img
                              src={preview.url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-auto rounded object-contain"
                            />
                          ) : preview.type.startsWith("video/") ? (
                            <video
                              src={preview.url}
                              controls
                              className="w-full h-auto rounded"
                            >
                              Your browser does not support video.
                            </video>
                          ) : null}
                          <p className="mt-1 text-xs text-center text-muted-foreground truncate">
                            {preview.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[#204195] text-white hover:bg-[#204195]/90 hover:text-white/95 cursor-pointer"
                size="lg"
                variant={"outline"}
                disabled={isSubmitting || isSendingOtp}
              >
                {isSubmitting || isSendingOtp ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    {isSendingOtp ? "Đang gửi OTP..." : "Đang gửi..."}
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Gửi báo cáo
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* OTP Dialog with InputOTP */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-center">Xác thực Email</DialogTitle>
            <DialogDescription className="text-center">
              Mã OTP đã được gửi đến email
              <br />
              <strong className="text-foreground">{email}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* InputOTP - 6 slots riêng biệt */}
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isVerifyingOtp}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-14 text-2xl" />
                  <InputOTPSlot index={1} className="w-12 h-14 text-2xl" />
                  <InputOTPSlot index={2} className="w-12 h-14 text-2xl" />
                  <InputOTPSlot index={3} className="w-12 h-14 text-2xl" />
                  <InputOTPSlot index={4} className="w-12 h-14 text-2xl" />
                  <InputOTPSlot index={5} className="w-12 h-14 text-2xl" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Resend OTP */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Không nhận được OTP?{" "}
              </span>
              <Button
                type="button"
                variant="link"
                className="px-1 h-auto"
                onClick={async () => {
                  try {
                    await sendReportOTP(email);
                    toast.success("OTP đã được gửi lại");
                    setOtp("");
                  } catch {
                    toast.error("Không thể gửi lại OTP");
                  }
                }}
                disabled={isVerifyingOtp}
              >
                Gửi lại mã
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowOtpDialog(false);
                setOtp("");
                setIsSubmitting(false);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleVerifyOtp}
              disabled={isVerifyingOtp || otp.length < 6}
            >
              {isVerifyingOtp ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Đang xác thực...
                </>
              ) : (
                "Xác nhận"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Reveal>
  );
}
