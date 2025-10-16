export type ReportStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
export type ReportPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Report {
  _id: string;
  reportCode: string;
  type: {
    _id: string;
    value: string;
    label: string;
  };
  description: string;
  status: ReportStatus;
  priority: ReportPriority;
  reporter: {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  asset: {
    _id: string;
    name: string;
    code: string;
    image?: string;
  };
  location: {
    campus: string;
    building?: string;
    floor?: number;
    zone?: string;
  };
  images: string[];
  assignedTo?: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface ReportFilters {
  search: string;
  status: string;
  priority: string;
  type: string;
  dateFrom: string;
  dateTo: string;
}

export interface ReportStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  avgResolutionTime: string;
  todayReports: number;
}
