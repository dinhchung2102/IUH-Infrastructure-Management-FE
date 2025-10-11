import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Users,
  FileText,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Tổng cơ sở vật chất",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Người dùng hoạt động",
    value: "856",
    change: "+8%",
    trend: "up",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Báo cáo chờ xử lý",
    value: "23",
    change: "-5%",
    trend: "down",
    icon: FileText,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    title: "Vấn đề cần xử lý",
    value: "12",
    change: "+3%",
    trend: "up",
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
];

const recentActivities = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    action: "đã báo cáo sự cố",
    target: "Phòng A101",
    time: "5 phút trước",
    status: "pending",
  },
  {
    id: 2,
    user: "Trần Thị B",
    action: "đã hoàn thành bảo trì",
    target: "Phòng B205",
    time: "15 phút trước",
    status: "completed",
  },
  {
    id: 3,
    user: "Lê Văn C",
    action: "đã yêu cầu đặt phòng",
    target: "Hội trường C",
    time: "30 phút trước",
    status: "pending",
  },
  {
    id: 4,
    user: "Phạm Thị D",
    action: "đã cập nhật thông tin",
    target: "Phòng máy D301",
    time: "1 giờ trước",
    status: "completed",
  },
];

const upcomingMaintenance = [
  {
    id: 1,
    facility: "Phòng A101",
    type: "Bảo trì định kỳ",
    date: "15/10/2025",
    priority: "high",
  },
  {
    id: 2,
    facility: "Hệ thống điện B",
    type: "Kiểm tra an toàn",
    date: "18/10/2025",
    priority: "medium",
  },
  {
    id: 3,
    facility: "Phòng máy C301",
    type: "Nâng cấp thiết bị",
    date: "20/10/2025",
    priority: "low",
  },
];

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">Cao</Badge>;
    case "medium":
      return <Badge variant="secondary">Trung bình</Badge>;
    case "low":
      return <Badge variant="outline">Thấp</Badge>;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Đang xử lý</Badge>;
    case "completed":
      return <Badge variant="default">Hoàn thành</Badge>;
    default:
      return null;
  }
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Chào mừng trở lại! Đây là tổng quan về hệ thống quản lý cơ sở vật
          chất.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`size-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="size-3 text-green-600" />
                ) : (
                  <TrendingDown className="size-3 text-red-600" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span>so với tháng trước</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Tables Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activities */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các hoạt động mới nhất trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                  {getStatusBadge(activity.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Maintenance */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Lịch bảo trì</CardTitle>
            <CardDescription>Kế hoạch bảo trì sắp tới</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMaintenance.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{item.facility}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.type}
                      </p>
                    </div>
                    {getPriorityBadge(item.priority)}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    📅 {item.date}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
