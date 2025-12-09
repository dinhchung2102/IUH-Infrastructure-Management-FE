export type ReportStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ReportPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Report {
  _id: string;
  asset: {
    _id: string;
    name: string;
    code: string;
    status: string;
    image?: string; // Hình ảnh của thiết bị (hiển thị trong table)
    zone?: {
      _id: string;
      name: string;
      building: {
        _id: string;
        name: string;
        campus: {
          _id: string;
          name: string;
        };
      };
    } | null;
    area?: {
      _id: string;
      name: string;
      campus: {
        _id: string;
        name: string;
      };
    } | null;
  };
  type: string;
  status: ReportStatus;
  priority?: ReportPriority;
  description: string;
  images: string[]; // Hình ảnh báo cáo (hiển thị trong detail dialog)
  suggestedProcessingDays?: number; // Gợi ý số ngày xử lý từ AI
  rejectReason?: string; // Lý do từ chối (nếu có)
  createdBy: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  // Helper field for display
  location?: {
    campus: string;
    building?: string;
    zone?: string;
  };
}

export interface ReportFilters {
  search: string;
  status: string;
  type: string;
  dateFrom: string;
  dateTo: string;
}

export interface ReportStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  avgResolutionTime: string;
  todayReports: number;
}
