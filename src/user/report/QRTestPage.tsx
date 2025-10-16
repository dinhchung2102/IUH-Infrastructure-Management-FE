import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  QrCode,
  Download,
  Copy,
  CheckCircle2,
  AlertCircle,
  Home,
  ExternalLink,
} from "lucide-react";
import { generateQRCode, type QRCodeData } from "./api/qr.api";
import { toast } from "sonner";

export default function QRTestPage() {
  const navigate = useNavigate();
  const { assetId: urlAssetId } = useParams<{ assetId?: string }>();

  const [assetId, setAssetId] = useState(urlAssetId || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [copied, setCopied] = useState(false);

  // Handle QR generation
  const handleGenerate = async () => {
    if (!assetId.trim()) {
      toast.error("Vui lòng nhập Asset ID");
      return;
    }

    setIsLoading(true);
    setError(null);
    setQrData(null);

    try {
      const response = await generateQRCode(assetId.trim());
      if (response.data) {
        setQrData(response.data);
        toast.success("QR Code đã được tạo thành công!");
      } else {
        setError("Không nhận được dữ liệu QR code");
      }
    } catch (err: any) {
      console.error("Error generating QR:", err);
      const errorMsg =
        err?.response?.data?.message ||
        "Lỗi tạo QR code. Vui lòng kiểm tra Asset ID.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle copy URL
  const handleCopyURL = () => {
    if (!qrData?.url) return;

    navigator.clipboard.writeText(qrData.url).then(() => {
      setCopied(true);
      toast.success("URL đã được copy!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Handle download QR
  const handleDownloadQR = () => {
    if (!qrData?.qr) return;

    const link = document.createElement("a");
    link.href = qrData.qr;
    link.download = `qr-code-${assetId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code đã được tải xuống!");
  };

  // Handle open URL in new tab
  const handleOpenURL = () => {
    if (!qrData?.url) return;
    window.open(qrData.url, "_blank");
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background py-8 px-4">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <QrCode className="h-8 w-8 text-primary" />
              QR Code Generator
            </h1>
            <p className="text-muted-foreground mt-1">
              Test và debug QR code cho thiết bị
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="h-4 w-4" />
            Trang chủ
          </Button>
        </div>

        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle>Nhập Asset ID</CardTitle>
            <CardDescription>
              Nhập ID của thiết bị để tạo QR code báo cáo nhanh
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assetId">Asset ID *</Label>
              <div className="flex gap-2">
                <Input
                  id="assetId"
                  placeholder="68e092552bbf40ca0dc74497"
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="font-mono"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !assetId.trim()}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <QrCode className="h-4 w-4" />
                      Tạo QR
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Ví dụ: 68e092552bbf40ca0dc74497 (24 ký tự hex)
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Skeleton className="h-64 w-64 rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Code Result */}
        {qrData && !isLoading && (
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                QR Code đã sẵn sàng!
              </CardTitle>
              <CardDescription>
                Quét mã QR này để mở trang báo cáo nhanh
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Image */}
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg shadow-md border-2 border-primary/10">
                  <img src={qrData.qr} alt="QR Code" className="w-64 h-64" />
                </div>
              </div>

              {/* URL Display */}
              <div className="space-y-2">
                <Label>Quick Report URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={qrData.url}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyURL}
                    title="Copy URL"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleOpenURL}
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={handleDownloadQR}
                  variant="default"
                  className="w-full"
                >
                  <Download className="h-4 w-4" />
                  Tải xuống QR
                </Button>
                <Button
                  onClick={() => {
                    setAssetId("");
                    setQrData(null);
                    setError(null);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <QrCode className="h-4 w-4" />
                  Tạo mã mới
                </Button>
              </div>

              {/* Info Box */}
              <Alert>
                <QrCode className="h-4 w-4" />
                <AlertDescription>
                  <strong>Asset ID:</strong> {assetId}
                  <br />
                  <strong>Cách dùng:</strong> In QR code và dán lên thiết bị.
                  User quét QR để báo cáo sự cố nhanh.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!qrData && !isLoading && !error && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">💡 Hướng dẫn sử dụng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="font-bold text-primary">1.</span>
                <p>Lấy Asset ID từ database hoặc danh sách thiết bị</p>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-primary">2.</span>
                <p>Nhập Asset ID vào ô input và nhấn "Tạo QR"</p>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-primary">3.</span>
                <p>
                  Tải xuống QR code và in ra, sau đó dán lên thiết bị tương ứng
                </p>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-primary">4.</span>
                <p>
                  User quét QR sẽ được redirect đến trang báo cáo nhanh với
                  thông tin thiết bị đã tự động điền
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
