import type {
  PaginationRequest,
  PaginationResponse,
} from "@/types/pagination.type";

// Maintenance Status
export type MaintenanceStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "OVERDUE";

// Maintenance Priority
export type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// Asset reference
export interface AssetReference {
  _id: string;
  name: string;
  code: string;
  status: string;
}

// User reference
export interface UserReference {
  _id: string;
  fullName: string;
  email: string;
}

// Maintenance entity
export interface Maintenance {
  _id: string;
  asset: AssetReference;
  title: string;
  description: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  scheduledDate: string;
  completedDate?: string;
  createdBy: UserReference;
  assignedTo: UserReference[];
  notes?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

// Create Maintenance DTO
export interface CreateMaintenanceDto {
  asset: string; // Asset ID
  title: string;
  description: string;
  status?: MaintenanceStatus;
  priority?: MaintenancePriority;
  scheduledDate: string; // ISO 8601
  assignedTo?: string[]; // Array of staff IDs
  notes?: string;
  images?: File[]; // Files to upload
}

// Update Maintenance DTO
export interface UpdateMaintenanceDto {
  asset?: string;
  title?: string;
  description?: string;
  status?: MaintenanceStatus;
  priority?: MaintenancePriority;
  scheduledDate?: string;
  assignedTo?: string[];
  notes?: string;
  completedDate?: string;
  images?: File[];
}

// Query Maintenance DTO
export interface QueryMaintenanceDto
  extends Omit<PaginationRequest, "sortBy" | "sortOrder"> {
  search?: string;
  status?: MaintenanceStatus;
  priority?: MaintenancePriority;
  asset?: string; // Asset ID
  assignedTo?: string; // Staff ID
  startDate?: string; // ISO 8601 - filter by scheduledDate >= startDate
  endDate?: string; // ISO 8601 - filter by scheduledDate <= endDate
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Maintenance List Response
export interface MaintenanceListResponse {
  maintenances: Maintenance[];
  pagination: PaginationResponse;
}

// Maintenance Stats (for future use)
export interface MaintenanceStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  upcoming: number;
}
