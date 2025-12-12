import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { FileText } from "lucide-react";
import { sendReportOTP } from "../api/report.api";
import { toast } from "sonner";

interface OtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  otp: string;
  setOtp: (value: string) => void;
  isVerifyingOtp: boolean;
  onVerify: () => void;
  onCancel: () => void;
}

export function OtpDialog({
  open,
  onOpenChange,
  email,
  otp,
  setOtp,
  isVerifyingOtp,
  onVerify,
  onCancel,
}: OtpDialogProps) {
  const handleResendOtp = async () => {
    try {
      await sendReportOTP(email);
      toast.success("OTP đã được gửi lại");
      setOtp("");
    } catch {
      toast.error("Không thể gửi lại OTP");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md bg-white border border-gray-200 shadow-xl rounded-xl mx-4 sm:mx-auto">
        <DialogHeader className="space-y-3 sm:space-y-4 text-center px-2 sm:px-6">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
          </div>
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 px-2">
            Xác thực Email
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
            Mã OTP đã được gửi đến email
            <br />
            <strong className="text-gray-800 break-all">{email}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 py-4 sm:py-6 px-4 sm:px-6">
          {/* InputOTP - 6 slots */}
          <div className="flex justify-center w-full overflow-x-auto">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={isVerifyingOtp}
            >
              <InputOTPGroup className="gap-1.5 sm:gap-2 md:gap-3 flex-nowrap">
                <InputOTPSlot
                  index={0}
                  className="w-11 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-base sm:text-lg md:text-xl lg:text-2xl font-bold border-2 border-gray-300 focus:border-gray-500 rounded-lg flex-shrink-0"
                />
                <InputOTPSlot
                  index={1}
                  className="w-11 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-base sm:text-lg md:text-xl lg:text-2xl font-bold border-2 border-gray-300 focus:border-gray-500 rounded-lg flex-shrink-0"
                />
                <InputOTPSlot
                  index={2}
                  className="w-11 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-base sm:text-lg md:text-xl lg:text-2xl font-bold border-2 border-gray-300 focus:border-gray-500 rounded-lg flex-shrink-0"
                />
                <InputOTPSlot
                  index={3}
                  className="w-11 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-base sm:text-lg md:text-xl lg:text-2xl font-bold border-2 border-gray-300 focus:border-gray-500 rounded-lg flex-shrink-0"
                />
                <InputOTPSlot
                  index={4}
                  className="w-11 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-base sm:text-lg md:text-xl lg:text-2xl font-bold border-2 border-gray-300 focus:border-gray-500 rounded-lg flex-shrink-0"
                />
                <InputOTPSlot
                  index={5}
                  className="w-11 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-base sm:text-lg md:text-xl lg:text-2xl font-bold border-2 border-gray-300 focus:border-gray-500 rounded-lg flex-shrink-0"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Resend OTP */}
          <div className="text-center px-2">
            <span className="text-gray-600 text-xs sm:text-sm">
              Không nhận được OTP?{" "}
            </span>
            <Button
              type="button"
              variant="link"
              className="px-1 sm:px-2 h-auto text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-700 inline-block"
              onClick={handleResendOtp}
              disabled={isVerifyingOtp}
            >
              Gửi lại mã
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-3 pt-3 sm:pt-4 px-4 sm:px-6 pb-4 sm:pb-6">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 h-10 sm:h-11 text-sm sm:text-base font-semibold border-gray-300 hover:border-gray-400 rounded-lg"
          >
            Hủy
          </Button>
          <Button
            onClick={onVerify}
            disabled={isVerifyingOtp || otp.length < 6}
            className="flex-1 h-10 sm:h-11 text-sm sm:text-base font-semibold bg-gray-800 hover:bg-gray-900 text-white rounded-lg"
          >
            {isVerifyingOtp ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <span>Xác nhận</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
