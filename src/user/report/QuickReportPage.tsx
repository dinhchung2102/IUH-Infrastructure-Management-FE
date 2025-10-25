import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAssetById, type AssetResponse } from "./api/asset.api";
import { getReportTypes, createReport, sendReportOTP } from "./api/report.api";
import type { ReportType } from "./types/report.types";
import { toast } from "sonner";
import {
  AssetInfoCard,
  ReportFormCard,
  OtpDialog,
  LoadingState,
  ErrorState,
} from "./components";

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
    return <LoadingState />;
  }

  // Error state
  if (error || !asset) {
    return (
      <ErrorState
        error={error || "Không tìm thấy thông tin thiết bị"}
        onGoHome={() => navigate("/")}
      />
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/nhaE.png')`,
        }}
      />
      <div className="absolute inset-0 " />

      {/* Content */}
      <div className="relative z-10 py-4 px-3 sm:py-6 sm:px-4 lg:py-12 lg:px-6">
        <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Asset Info Card */}
          <AssetInfoCard asset={asset} />

          {/* Report Form Card */}
          <ReportFormCard
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            isAuthenticated={isAuthenticated}
            selectedReportType={selectedReportType}
            setSelectedReportType={setSelectedReportType}
            description={description}
            setDescription={setDescription}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            previewFiles={previewFiles}
            setPreviewFiles={setPreviewFiles}
            reportTypes={reportTypes}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isSendingOtp={isSendingOtp}
          />

          {/* OTP Dialog */}
          <OtpDialog
            open={showOtpDialog}
            onOpenChange={setShowOtpDialog}
            email={email}
            otp={otp}
            setOtp={setOtp}
            isVerifyingOtp={isVerifyingOtp}
            onVerify={handleVerifyOtp}
            onCancel={() => {
              setShowOtpDialog(false);
              setOtp("");
              setIsSubmitting(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
