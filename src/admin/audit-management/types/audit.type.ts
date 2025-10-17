export type AuditStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface AuditLog {
  _id: string;
  report: {
    _id: string;
    asset: {
      _id: string;
      name: string;
      code: string;
      status: string;
      image?: string;
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
    status: string;
    description: string;
    images: string[];
    createdBy: {
      _id: string;
      fullName: string;
      email: string;
    };
  };
  status: AuditStatus;
  subject: string;
  staffs: Array<{
    _id: string;
    fullName: string;
    email: string;
  }>;
  images: string[];
  createdAt: string;
  updatedAt: string;
  // Helper field for display
  location?: {
    campus: string;
    building?: string;
    zone?: string;
  };
}

export interface AuditFilters {
  search: string;
  status: string;
  campus: string;
  zone: string;
  startDate: string;
  endDate: string;
}

export interface AuditStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  todayAudits: number;
}
