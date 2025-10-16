import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Upload,
  AlertCircle,
  MapPin,
  Package,
  Building2,
} from "lucide-react";
import { getAssetById, type AssetResponse } from "./api/asset.api";
import { getReportTypes } from "./api/report.api";
import type { ReportType } from "./types/report.types";
import { toast } from "sonner";

export default function QuickReportPage() {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Asset and form data
  const [asset, setAsset] = useState<AssetResponse | null>(null);
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);

  // User info (auto-filled from localStorage or manual)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Form fields (user input only)
  const [selectedReportType, setSelectedReportType] = useState("");
  const [description, setDescription] = useState("");
  const [previewFiles, setPreviewFiles] = useState<
    { url: string; type: string; name: string }[]
  >([]);

  // Load user info from localStorage
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

  // Fetch asset and report types
  useEffect(() => {
    if (!assetId) {
      setError("Không tìm thấy mã thiết bị");
      setIsLoading(false);
      return;
    }

    Promise.all([getAssetById(assetId), getReportTypes()])
      .then(([assetRes, reportTypesRes]) => {
        if (assetRes.data?.asset) {
          setAsset(assetRes.data.asset);
          console.log("[ASSET LOADED]:", assetRes.data.asset);
        } else {
          setError("Không tìm thấy thông tin thiết bị");
        }

        if (reportTypesRes.data?.reportTypes) {
          setReportTypes(reportTypesRes.data.reportTypes);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Lỗi tải dữ liệu. Vui lòng thử lại sau.");
        setIsLoading(false);
      });
  }, [assetId]);

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Clear old previews
    previewFiles.forEach((preview) => URL.revokeObjectURL(preview.url));

    // Create new preview URLs
    const newPreviews = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
    }));
    setPreviewFiles(newPreviews);
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewFiles.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previewFiles]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReportType) {
      toast.error("Vui lòng chọn loại báo cáo");
      return;
    }

    if (!description.trim()) {
      toast.error("Vui lòng nhập mô tả chi tiết");
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin cá nhân");
      return;
    }

    // TODO: Implement API call to submit report
    console.log("Submitting report:", {
      assetId: asset?._id,
      reportType: selectedReportType,
      description,
      fullName,
      email,
      files: previewFiles,
    });

    toast.success("Báo cáo đã được gửi thành công!");

    // Redirect after 2 seconds
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !asset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Lỗi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              className="w-full mt-4"
              onClick={() => navigate("/")}
              variant="outline"
            >
              Quay về trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-4 px-4 sm:py-8">
      <div className="w-full max-w-2xl mx-auto space-y-4">
        {/* Asset Info Card */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Thông tin thiết bị
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {/* Asset Image */}
            {asset.zone?.image && (
              <div className="rounded-lg overflow-hidden border bg-muted/30">
                <img
                  src={`${import.meta.env.VITE_URL_UPLOADS}${asset.zone.image}`}
                  alt={asset.name}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Asset Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Tên thiết bị</p>
                <p className="font-medium">{asset.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mã thiết bị</p>
                <p className="font-medium">{asset.code}</p>
              </div>
            </div>

            {/* Location Info */}
            <div className="pt-2 border-t space-y-2">
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Vị trí</p>
                  <p className="font-medium text-sm break-words">
                    {asset.zone?.building.name} - Tầng{" "}
                    {asset.zone?.building.floor}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Cơ sở</p>
                  <p className="font-medium text-sm break-words">
                    {asset.zone?.building.campus.name}
                  </p>
                </div>
              </div>
              {asset.zone?.name && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Khu vực</p>
                    <p className="font-medium text-sm break-words">
                      {asset.zone.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Report Form Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Báo cáo sự cố</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Vui lòng điền đầy đủ thông tin để chúng tôi xử lý báo cáo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">
                  Thông tin người báo cáo
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullname" className="text-sm">
                      Họ và tên *
                    </Label>
                    <Input
                      id="fullname"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@iuh.edu.vn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Report Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">
                  Chi tiết sự cố
                </h3>

                <div className="space-y-1.5">
                  <Label htmlFor="report-type" className="text-sm">
                    Loại báo cáo *
                  </Label>
                  <Select
                    required
                    value={selectedReportType}
                    onValueChange={setSelectedReportType}
                  >
                    <SelectTrigger id="report-type" className="h-10">
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

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-sm">
                    Mô tả chi tiết *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Mô tả càng chi tiết càng giúp chúng tôi xử lý nhanh hơn
                  </p>
                </div>

                {/* File Upload */}
                <div className="space-y-1.5">
                  <Label htmlFor="attachments" className="text-sm">
                    Hình ảnh/Video (Tùy chọn)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="attachments"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="cursor-pointer h-10 text-sm"
                      onChange={handleFileChange}
                    />
                    <Upload className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Hỗ trợ: JPG, PNG, MP4, MOV (Tối đa 10MB/file)
                  </p>

                  {/* File Preview */}
                  {previewFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <Label className="text-xs">
                        {previewFiles.length}{" "}
                        {previewFiles.length === 1 ? "file" : "files"} đã chọn
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {previewFiles.map((preview, index) => (
                          <div
                            key={index}
                            className="rounded-lg border p-2 bg-muted/30"
                          >
                            {preview.type.startsWith("image/") ? (
                              <img
                                src={preview.url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 rounded object-cover"
                              />
                            ) : preview.type.startsWith("video/") ? (
                              <video
                                src={preview.url}
                                controls
                                className="w-full h-24 rounded object-cover"
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all"
                size="lg"
              >
                <FileText className="h-5 w-5" />
                Gửi báo cáo
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
