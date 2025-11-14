// Dashboard types
export interface DashboardStats {
  totalAssets: number;
  activeUsers: number;
  pendingReports: number;
  pendingAudits: number;
}

export interface DashboardReport {
  _id: string;
  type: string;
  status: string;
  description: string;
  images: string[];
  asset: {
    _id: string;
    name: string;
    code: string;
    status: string;
    image: string;
    zone: {
      _id: string;
      name: string;
      building?: {
        _id: string;
        name: string;
        campus?: {
          _id: string;
          name: string;
        };
      };
    };
    area: {
      _id: string;
      name: string;
      code: string;
    } | null;
  };
  createdBy: {
    _id: string;
    email: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentReports: DashboardReport[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
  timestamp?: string;
  path?: string;
}
