import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { resetPassword } from "../api/auth.api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-handler";

const resetPasswordSchema = z
  .object({
    authOTP: z
      .string()
      .min(6, "Mã OTP phải có 6 ký tự")
      .max(6, "Mã OTP phải có 6 ký tự"),
    newPassword: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(100, "Mật khẩu không được quá 100 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onSwitchToLogin?: () => void;
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  email,
  onSwitchToLogin,
}: ResetPasswordDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      authOTP: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      await resetPassword({
        email,
        authOTP: data.authOTP,
        newPassword: data.newPassword,
      });

      toast.success("Đặt lại mật khẩu thành công!");
      form.reset();
      onOpenChange(false);

      // Switch to login dialog
      if (onSwitchToLogin) {
        onSwitchToLogin();
      }
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Đặt lại mật khẩu thất bại. Vui lòng thử lại.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="size-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Đặt lại mật khẩu
          </DialogTitle>
          <DialogDescription className="text-center">
            Nhập mã OTP và mật khẩu mới cho email
            <br />
            <span className="font-semibold text-foreground">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="authOTP"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã OTP</FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} disabled={isLoading} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="text-2xl w-12 h-12"
                          />
                          <InputOTPSlot
                            index={1}
                            className="text-2xl w-12 h-12"
                          />
                          <InputOTPSlot
                            index={2}
                            className="text-2xl w-12 h-12"
                          />
                          <InputOTPSlot
                            index={3}
                            className="text-2xl w-12 h-12"
                          />
                          <InputOTPSlot
                            index={4}
                            className="text-2xl w-12 h-12"
                          />
                          <InputOTPSlot
                            index={5}
                            className="text-2xl w-12 h-12"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Nhập mật khẩu mới"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        disabled={isLoading}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Xác nhận mật khẩu mới"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        disabled={isLoading}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <>Đang đặt lại mật khẩu...</> : "Đặt lại mật khẩu"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Nhớ mật khẩu? </span>
              <Button
                type="button"
                variant="link"
                className="px-1"
                onClick={() => {
                  onOpenChange(false);
                  onSwitchToLogin?.();
                }}
                disabled={isLoading}
              >
                Đăng nhập ngay
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
