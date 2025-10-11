import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "../api/auth.api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-handler";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin?: () => void;
  onSwitchToResetPassword?: (email: string) => void;
}

export function ForgotPasswordDialog({
  open,
  onOpenChange,
  onSwitchToLogin,
  onSwitchToResetPassword,
}: ForgotPasswordDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await requestPasswordReset(data.email);
      toast.success("Mã OTP đã được gửi đến email của bạn!");
      form.reset();
      onOpenChange(false);

      // Switch to reset password dialog
      if (onSwitchToResetPassword) {
        onSwitchToResetPassword(data.email);
      }
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Gửi OTP thất bại. Vui lòng thử lại.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Quên mật khẩu
          </DialogTitle>
          <DialogDescription className="text-center">
            Nhập email để nhận mã OTP đặt lại mật khẩu
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@iuh.edu.vn"
                      type="email"
                      autoComplete="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <>Đang gửi OTP...</> : "Gửi mã OTP"}
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
