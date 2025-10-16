export interface ReportType {
  value: string;
  label: string;
  description: string;
}

export interface CreateReportDto {
  asset: string; // Asset ID (MongoId)
  type: string; // Report type (enum)
  description: string; // Description (10-1000 chars)
  images: string[]; // Array of image paths (required)
}
