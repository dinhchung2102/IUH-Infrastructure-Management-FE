import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "../api/auth.api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-handler";

const loginSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập là bắt buộc"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister?: () => void;
  onSwitchToForgotPassword?: () => void;
  onLoginSuccess?: () => void;
}

export function LoginDialog({
  open,
  onOpenChange,
  onSwitchToRegister,
  onSwitchToForgotPassword,
  onLoginSuccess,
}: LoginDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: localStorage.getItem("remembered_username") || "",
      password: "",
      rememberMe: !!localStorage.getItem("remembered_username"),
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await login(data);

      // Store tokens
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);

      // Store account info
      localStorage.setItem("account", JSON.stringify(response.account));

      // Handle remember me
      if (data.rememberMe) {
        localStorage.setItem("remembered_username", data.username);
      } else {
        localStorage.removeItem("remembered_username");
      }

      toast.success(response.message || "Đăng nhập thành công!");
      form.reset();
      onOpenChange(false);

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Đăng nhập thất bại. Vui lòng thử lại.")
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
            Đăng nhập
          </DialogTitle>
          <DialogDescription className="text-center">
            Đăng nhập vào hệ thống quản lý cơ sở vật chất IUH
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đăng nhập</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      type="text"
                      autoComplete="username"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
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

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm font-medium italic leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                    >
                      Nhớ mật khẩu
                    </label>
                  </div>
                )}
              />
              <Button
                type="button"
                variant="link"
                className="px-0 text-sm italic h-auto cursor-pointer"
                onClick={() => {
                  onOpenChange(false);
                  onSwitchToForgotPassword?.();
                }}
                disabled={isLoading}
              >
                Quên mật khẩu?
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <>Đang đăng nhập...</> : "Đăng nhập"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Chưa có tài khoản? </span>
              <Button
                type="button"
                variant="link"
                className="px-1"
                onClick={() => {
                  onOpenChange(false);
                  onSwitchToRegister?.();
                }}
                disabled={isLoading}
              >
                Đăng ký ngay
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
