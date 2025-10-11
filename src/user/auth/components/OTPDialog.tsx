import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { register, sendRegisterOTP } from "../api/auth.api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-handler";
import { useRegistrationStore } from "../stores/registration.store";

const otpSchema = z.object({
  otp: z.string().length(6, "Mã OTP phải có 6 số"),
});

type OTPFormValues = z.infer<typeof otpSchema>;

interface OTPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerifySuccess?: () => void;
}

export function OTPDialog({
  open,
  onOpenChange,
  email,
  onVerifySuccess,
}: OTPDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { registrationData, clearRegistrationData } = useRegistrationStore();

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Countdown timer for resend OTP
  useEffect(() => {
    if (!open) {
      setCountdown(60);
      setCanResend(false);
      return;
    }

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown, open]);

  const onSubmit = async (data: OTPFormValues) => {
    if (!registrationData) {
      toast.error("Không tìm thấy thông tin đăng ký. Vui lòng thử lại.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await register({
        ...registrationData,
        authOTP: data.otp,
      });

      // Store token
      localStorage.setItem("access_token", response.access_token);

      // Store account info
      localStorage.setItem("account", JSON.stringify(response.account));

      // Don't show toast here - let parent handle it
      form.reset();
      clearRegistrationData();
      onOpenChange(false);

      if (onVerifySuccess) {
        onVerifySuccess();
      }
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Mã OTP không hợp lệ. Vui lòng thử lại.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || !email) return;

    try {
      setCanResend(false);
      setCountdown(60);

      await sendRegisterOTP({ email });

      toast.success("Đã gửi lại mã OTP!");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gửi lại mã OTP thất bại."));
      setCanResend(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="size-6 text-primary" />
          </div>

          <DialogDescription className="text-center">
            Mã OTP đã được gửi đến email
            <br />
            <span className="font-semibold text-foreground">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-center  h-20">
                      <InputOTP
                        maxLength={6}
                        disabled={isLoading}
                        {...field}
                        className="h-full"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="text-3xl w-14 h-16"
                          />
                          <InputOTPSlot
                            index={1}
                            className="text-3xl w-14 h-16"
                          />
                          <InputOTPSlot
                            index={2}
                            className="text-3xl w-14 h-16"
                          />
                          <InputOTPSlot
                            index={3}
                            className="text-3xl w-14 h-16"
                          />
                          <InputOTPSlot
                            index={4}
                            className="text-3xl w-14 h-16"
                          />
                          <InputOTPSlot
                            index={5}
                            className="text-3xl w-14 h-16"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-center items-center">
              <Button
                type="submit"
                className="w-40"
                disabled={isLoading || form.watch("otp").length !== 6}
              >
                {isLoading ? <>Đang xác thực...</> : "Xác thực"}
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Không nhận được mã?{" "}
              </span>
              <Button
                type="button"
                variant="link"
                className="px-1"
                onClick={handleResendOTP}
                disabled={!canResend || isLoading}
              >
                {canResend ? (
                  "Gửi lại mã"
                ) : (
                  <span>Gửi lại sau {countdown}s</span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
