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
import { getReportTypes, createReport, sendReportOTP } from "./api/report.api";
import type { ReportType } from "./types/report.types";
import { toast } from "sonner";

export default function QuickReportPage() {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Asset and form data
  const [asset, setAsset] = useState<AssetResponse | null>(null);
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);

  // User info (auto-filled from localStorage or manual)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // OTP Dialog for non-authenticated users
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Form fields (user input only)
  const [selectedReportType, setSelectedReportType] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewFiles, setPreviewFiles] = useState<
    { url: string; type: string; name: string }[]
  >([]);

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

    // Store actual files
    const filesArray = Array.from(files);
    setSelectedFiles(filesArray);

    // Create new preview URLs
    const newPreviews = filesArray.map((file) => ({
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

  // Create report with FormData
  const submitReport = async (otpCode?: string) => {
    try {
      const formData = new FormData();
      formData.append("asset", asset!._id);
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

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
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

  // Handle form submission
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

    if (!asset?._id) {
      toast.error("Không tìm thấy thông tin thiết bị");
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-3 px-3 sm:py-8 sm:px-4">
      <div className="w-full max-w-2xl mx-auto space-y-3 sm:space-y-4">
        {/* Asset Info Card - Mobile Optimized */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="truncate">Thông tin thiết bị</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 sm:space-y-3 text-sm">
            {/* Asset Image - Mobile Optimized */}
            {asset?.image && (
              <div className="rounded-md sm:rounded-lg overflow-hidden border bg-muted/30">
                <img
                  src={`${import.meta.env.VITE_URL_UPLOADS}${asset.image}`}
                  alt={asset.name}
                  className="w-full h-auto object-contain max-h-48 sm:max-h-64"
                />
              </div>
            )}

            {/* Asset Details - Mobile Optimized */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">
                  Tên thiết bị
                </p>
                <p className="font-medium text-sm truncate" title={asset.name}>
                  {asset.name}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">
                  Mã thiết bị
                </p>
                <p className="font-medium text-sm truncate" title={asset.code}>
                  {asset.code}
                </p>
              </div>
            </div>

            {/* Location Info - Mobile Optimized */}
            <div className="pt-2 border-t space-y-1.5 sm:space-y-2">
              <div className="flex items-start gap-1.5 sm:gap-2">
                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    Vị trí
                  </p>
                  <p className="font-medium text-xs sm:text-sm break-words leading-tight">
                    {asset.zone?.building.name} - Tầng{" "}
                    {asset.zone?.building.floor}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-1.5 sm:gap-2">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    Cơ sở
                  </p>
                  <p className="font-medium text-xs sm:text-sm break-words leading-tight">
                    {asset.zone?.building.campus.name}
                  </p>
                </div>
              </div>
              {asset.zone?.name && (
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      Khu vực
                    </p>
                    <p className="font-medium text-xs sm:text-sm break-words leading-tight">
                      {asset.zone.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Report Form Card - Mobile Optimized */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Báo cáo sự cố</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Vui lòng điền đầy đủ thông tin về báo cáo sự cố của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4 sm:pb-6">
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              {/* Personal Info - Mobile Optimized */}
              <div className="space-y-2.5 sm:space-y-3">
                <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground border-b pb-1.5 sm:pb-2 flex items-center flex-wrap gap-1">
                  <span>Thông tin người báo cáo</span>
                  {isAuthenticated && (
                    <span className="text-[10px] sm:text-xs text-green-600 font-normal">
                      (Đã xác thực)
                    </span>
                  )}
                </h3>
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="space-y-1 sm:space-y-1.5">
                    <Label
                      htmlFor="fullname"
                      className="text-xs sm:text-sm font-medium"
                    >
                      Họ và tên *
                    </Label>
                    <Input
                      id="fullname"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={isAuthenticated}
                      className="h-11 sm:h-10 text-base sm:text-sm"
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-1 sm:space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-xs sm:text-sm font-medium"
                    >
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@iuh.edu.vn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isAuthenticated}
                      className="h-11 sm:h-10 text-base sm:text-sm"
                      autoComplete="email"
                      inputMode="email"
                    />
                  </div>
                </div>
              </div>

              {/* Report Details - Mobile Optimized */}
              <div className="space-y-2.5 sm:space-y-3">
                <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground border-b pb-1.5 sm:pb-2">
                  Chi tiết sự cố
                </h3>

                <div className="space-y-1 sm:space-y-1.5">
                  <Label
                    htmlFor="report-type"
                    className="text-xs sm:text-sm font-medium"
                  >
                    Loại báo cáo *
                  </Label>
                  <Select
                    required
                    value={selectedReportType}
                    onValueChange={setSelectedReportType}
                  >
                    <SelectTrigger
                      id="report-type"
                      className="h-11 sm:h-10 text-base sm:text-sm"
                    >
                      <SelectValue placeholder="Chọn loại báo cáo" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          className="text-base sm:text-sm py-3 sm:py-2"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <Label
                    htmlFor="description"
                    className="text-xs sm:text-sm font-medium"
                  >
                    Mô tả chi tiết *
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-normal ml-1">
                      ({description.length}/1000)
                    </span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải..."
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="resize-none text-base sm:text-sm min-h-[120px]"
                  />
                </div>

                {/* File Upload - Mobile Optimized */}
                <div className="space-y-1 sm:space-y-1.5">
                  <Label
                    htmlFor="attachments"
                    className="text-xs sm:text-sm font-medium"
                  >
                    Hình ảnh/Video *
                  </Label>
                  <label
                    htmlFor="attachments"
                    className="flex items-center justify-center gap-2 h-11 sm:h-10 px-4 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors bg-muted/30 active:scale-[0.98]"
                  >
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                      {previewFiles.length > 0
                        ? `${previewFiles.length} file đã chọn`
                        : "Chọn hình ảnh/video"}
                    </span>
                  </label>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                    required
                  />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Bắt buộc tải lên ít nhất 1 hình ảnh/video (Tối đa 10MB/file)
                  </p>

                  {/* File Preview - Mobile Optimized */}
                  {previewFiles.length > 0 && (
                    <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
                      <Label className="text-[10px] sm:text-xs text-muted-foreground">
                        {previewFiles.length}{" "}
                        {previewFiles.length === 1 ? "file" : "files"} đã chọn
                      </Label>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        {previewFiles.map((preview, index) => (
                          <div
                            key={index}
                            className="rounded-md border p-1.5 sm:p-2 bg-muted/30"
                          >
                            {preview.type.startsWith("image/") ? (
                              <img
                                src={preview.url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 sm:h-24 rounded object-cover"
                              />
                            ) : preview.type.startsWith("video/") ? (
                              <video
                                src={preview.url}
                                className="w-full h-20 sm:h-24 rounded object-cover"
                              >
                                Your browser does not support video.
                              </video>
                            ) : null}
                            <p className="mt-1 text-[10px] sm:text-xs text-center text-muted-foreground truncate px-0.5">
                              {preview.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button - Mobile Optimized (Touch-friendly 48px) */}
              <Button
                type="submit"
                className="w-full h-12 sm:h-11 text-base sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                size="lg"
                disabled={isSubmitting || isSendingOtp}
              >
                {isSubmitting || isSendingOtp ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    {isSendingOtp ? "Đang gửi OTP..." : "Đang gửi..."}
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5 mr-2" />
                    Gửi báo cáo
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* OTP Dialog - Mobile Optimized with InputOTP */}
        <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-md mx-4 sm:mx-auto">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-center text-lg sm:text-xl">
                Xác thực Email
              </DialogTitle>
              <DialogDescription className="text-center text-xs sm:text-sm leading-relaxed">
                Mã OTP đã được gửi đến email
                <br />
                <strong className="text-foreground break-all">{email}</strong>
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
                    <InputOTPSlot
                      index={0}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-xl sm:text-2xl"
                    />
                    <InputOTPSlot
                      index={1}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-xl sm:text-2xl"
                    />
                    <InputOTPSlot
                      index={2}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-xl sm:text-2xl"
                    />
                    <InputOTPSlot
                      index={3}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-xl sm:text-2xl"
                    />
                    <InputOTPSlot
                      index={4}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-xl sm:text-2xl"
                    />
                    <InputOTPSlot
                      index={5}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-xl sm:text-2xl"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Resend OTP */}
              <div className="text-center text-xs sm:text-sm">
                <span className="text-muted-foreground">
                  Không nhận được OTP?{" "}
                </span>
                <Button
                  type="button"
                  variant="link"
                  className="px-1 h-auto text-xs sm:text-sm"
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

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => {
                  setShowOtpDialog(false);
                  setOtp("");
                  setIsSubmitting(false);
                }}
                className="flex-1 sm:flex-none h-11 sm:h-10"
              >
                Hủy
              </Button>
              <Button
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp || otp.length < 6}
                className="flex-1 sm:flex-none h-11 sm:h-10"
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
      </div>
    </div>
  );
}
