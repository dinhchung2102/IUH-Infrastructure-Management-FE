import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Sun, Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [settings, setSettings] = useState({
    emailNotifications: true,
    reportNotifications: true,
    maintenanceNotifications: true,
    auditNotifications: false,
    weeklyReport: true,
  });

  useEffect(() => {
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | "system"
      | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("system");
    }
  }, []);

  const applyTheme = (selectedTheme: "light" | "dark" | "system") => {
    const root = document.documentElement;
    if (selectedTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      root.classList.toggle("dark", selectedTheme === "dark");
    }
  };

  const handleThemeChange = (value: "light" | "dark" | "system") => {
    setTheme(value);
    localStorage.setItem("theme", value);
    applyTheme(value);
  };

  const handleSave = () => {
    // Save notification settings to localStorage
    localStorage.setItem("notificationSettings", JSON.stringify(settings));
    toast.success("Đã lưu cài đặt thành công!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cài đặt</h1>
          <p className="text-muted-foreground">
            Quản lý cấu hình và tùy chọn hệ thống
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Lưu thay đổi
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Giao diện
            </CardTitle>
            <CardDescription>
              Tùy chọn giao diện và chủ đề màu sắc
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Chủ đề</Label>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Sáng</SelectItem>
                  <SelectItem value="dark">Tối</SelectItem>
                  <SelectItem value="system">Theo hệ thống</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Chọn chủ đề sáng, tối hoặc theo cài đặt hệ thống
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Thông báo
            </CardTitle>
            <CardDescription>
              Quản lý các loại thông báo và cảnh báo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications">Thông báo qua email</Label>
                <p className="text-sm text-muted-foreground">
                  Gửi thông báo quan trọng qua email
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    emailNotifications: checked,
                  })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reportNotifications">
                  Thông báo báo cáo mới
                </Label>
                <p className="text-sm text-muted-foreground">
                  Nhận thông báo khi có báo cáo mới
                </p>
              </div>
              <Switch
                id="reportNotifications"
                checked={settings.reportNotifications}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    reportNotifications: checked,
                  })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenanceNotifications">
                  Thông báo bảo trì
                </Label>
                <p className="text-sm text-muted-foreground">
                  Nhận thông báo về lịch bảo trì
                </p>
              </div>
              <Switch
                id="maintenanceNotifications"
                checked={settings.maintenanceNotifications}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    maintenanceNotifications: checked,
                  })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auditNotifications">Thông báo kiểm tra</Label>
                <p className="text-sm text-muted-foreground">
                  Nhận thông báo về các cuộc kiểm tra
                </p>
              </div>
              <Switch
                id="auditNotifications"
                checked={settings.auditNotifications}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    auditNotifications: checked,
                  })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weeklyReport">Báo cáo tuần</Label>
                <p className="text-sm text-muted-foreground">
                  Gửi báo cáo tổng hợp hàng tuần
                </p>
              </div>
              <Switch
                id="weeklyReport"
                checked={settings.weeklyReport}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, weeklyReport: checked })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
