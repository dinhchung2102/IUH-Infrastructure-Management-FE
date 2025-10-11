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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { sendRegisterOTP } from "../api/auth.api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-handler";
import { useRegistrationStore } from "../stores/registration.store";

const registerSchema = z
  .object({
    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
    fullName: z
      .string()
      .min(2, "Họ tên phải có ít nhất 2 ký tự")
      .max(100, "Họ tên không được quá 100 ký tự"),
    gender: z.enum(["MALE", "FEMALE"]),
    password: z
      .string()
      .min(6, "Mật khẩu tối thiểu 6 ký tự")
      .max(100, "Mật khẩu không được quá 100 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không trùng khớp",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin?: () => void;
  onSwitchToOTP?: (email: string) => void;
}

export function RegisterDialog({
  open,
  onOpenChange,
  onSwitchToLogin,
  onSwitchToOTP,
}: RegisterDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setRegistrationData } = useRegistrationStore();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      fullName: "",
      gender: "MALE",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Save registration data to store (except confirmPassword)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registrationData } = data;
      setRegistrationData(registrationData);

      // Send OTP to email
      await sendRegisterOTP({ email: data.email });

      toast.success("Mã OTP đã được gửi đến email của bạn!");
      form.reset();
      onOpenChange(false);

      // Switch to OTP dialog
      if (onSwitchToOTP) {
        onSwitchToOTP(data.email);
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
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Đăng ký tài khoản
          </DialogTitle>
          <DialogDescription className="text-center">
            Điền thông tin để tạo tài khoản mới
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Single column layout */}
            <div className="space-y-4">
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

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nguyễn Văn A"
                        autoComplete="name"
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
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                        disabled={isLoading}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="MALE"
                            id="male"
                            className="cursor-pointer"
                          />
                          <Label
                            htmlFor="male"
                            className="cursor-pointer font-normal"
                          >
                            Nam
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="FEMALE"
                            id="female"
                            className="cursor-pointer"
                          />
                          <Label
                            htmlFor="female"
                            className="cursor-pointer font-normal"
                          >
                            Nữ
                          </Label>
                        </div>
                      </RadioGroup>
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
                          placeholder="Nhập mật khẩu"
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
                          placeholder="Xác nhận mật khẩu"
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
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <>Đang gửi OTP...</> : "Tiếp tục"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Đã có tài khoản? </span>
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
