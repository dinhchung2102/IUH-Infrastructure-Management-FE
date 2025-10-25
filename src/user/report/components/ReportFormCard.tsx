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
import { FileText, Upload } from "lucide-react";
import type { ReportType } from "../types/report.types";

interface ReportFormCardProps {
  // User info
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  isAuthenticated: boolean;

  // Form fields
  selectedReportType: string;
  setSelectedReportType: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  previewFiles: { url: string; type: string; name: string }[];
  setPreviewFiles: (
    files: { url: string; type: string; name: string }[]
  ) => void;

  // Report types
  reportTypes: ReportType[];

  // Submit handlers
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isSendingOtp: boolean;
}

export function ReportFormCard({
  fullName,
  setFullName,
  email,
  setEmail,
  isAuthenticated,
  selectedReportType,
  setSelectedReportType,
  description,
  setDescription,
  setSelectedFiles,
  previewFiles,
  setPreviewFiles,
  reportTypes,
  onSubmit,
  isSubmitting,
  isSendingOtp,
}: ReportFormCardProps) {
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

  return (
    <Card className="border border-gray-200 shadow-lg bg-white rounded-xl overflow-hidden">
      <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6 border-b border-gray-200">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
          Báo cáo sự cố
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-gray-600 mt-1">
          Vui lòng điền đầy đủ thông tin về báo cáo sự cố của bạn để chúng tôi
          có thể hỗ trợ tốt nhất
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 sm:pb-6 px-4 sm:px-6">
        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
          {/* Personal Info */}
          <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2 sm:pb-3">
              <span>Thông tin người báo cáo</span>
              {isAuthenticated && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  Đã xác thực
                </span>
              )}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label
                  htmlFor="fullname"
                  className="text-xs sm:text-sm font-medium text-gray-700"
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
                  className="h-9 sm:h-10 text-sm sm:text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500 rounded-lg"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs sm:text-sm font-medium text-gray-700"
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
                  className="h-9 sm:h-10 text-sm sm:text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500 rounded-lg"
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2 sm:pb-3">
              <span>Chi tiết sự cố</span>
            </h3>

            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="report-type"
                className="text-xs sm:text-sm font-medium text-gray-700"
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
                  className="h-9 sm:h-10 text-sm sm:text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500 rounded-lg"
                >
                  <SelectValue placeholder="Chọn loại báo cáo" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="text-base"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="description"
                className="text-xs sm:text-sm font-medium text-gray-700"
              >
                Mô tả chi tiết *
                <span className="text-xs text-gray-500 font-normal ml-1 sm:ml-2">
                  ({description.length}/1000)
                </span>
              </Label>
              <Textarea
                id="description"
                placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="resize-none text-sm sm:text-base min-h-[100px] sm:min-h-[120px] border-gray-300 focus:border-gray-500 focus:ring-gray-500 rounded-lg"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="attachments"
                className="text-xs sm:text-sm font-medium text-gray-700"
              >
                Hình ảnh/Video *
              </Label>
              <label
                htmlFor="attachments"
                className="flex items-center justify-center gap-2 sm:gap-3 h-12 sm:h-14 px-4 sm:px-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-white transition-all duration-200 bg-white active:scale-[0.98]"
              >
                <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
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
              <p className="text-xs text-gray-500 font-medium">
                Bắt buộc tải lên ít nhất 1 hình ảnh/video (Tối đa 10MB/file)
              </p>

              {/* File Preview */}
              {previewFiles.length > 0 && (
                <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                  <Label className="text-xs sm:text-sm font-medium text-gray-700">
                    {previewFiles.length}{" "}
                    {previewFiles.length === 1 ? "file" : "files"} đã chọn
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {previewFiles.map((preview, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 p-3 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        {preview.type.startsWith("image/") ? (
                          <img
                            src={preview.url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 sm:h-28 rounded-lg object-cover shadow-sm"
                          />
                        ) : preview.type.startsWith("video/") ? (
                          <video
                            src={preview.url}
                            className="w-full h-20 sm:h-28 rounded-lg object-cover shadow-sm"
                          >
                            Your browser does not support video.
                          </video>
                        ) : null}
                        <p className="mt-1 sm:mt-2 text-xs text-center text-gray-600 font-medium truncate">
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
          <div className="pt-3 sm:pt-4">
            <Button
              type="submit"
              className="w-full h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base font-semibold"
              size="lg"
              disabled={isSubmitting || isSendingOtp}
            >
              {isSubmitting || isSendingOtp ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3" />
                  <span className="text-sm sm:text-base">
                    {isSendingOtp ? "Đang gửi OTP..." : "Đang gửi..."}
                  </span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="text-sm sm:text-base">Gửi báo cáo</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
