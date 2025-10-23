export type NewsStatus = "DRAFT" | "PUBLISHED";

export const NewsStatus = {
  DRAFT: "DRAFT" as const,
  PUBLISHED: "PUBLISHED" as const,
};

export interface Author {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export interface News {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  content: any; // Rich text content (can be object or string)
  status: NewsStatus;
  author: string | Author; // Can be populated or just ID
  category?: string | Category; // Can be populated or just ID
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsDto {
  title: string;
  description: string;
  thumbnail: string;
  content: any;
  status?: NewsStatus;
  author: string; // author ID
  category?: string; // category ID
}

export interface UpdateNewsDto {
  title?: string;
  description?: string;
  thumbnail?: string;
  content?: any;
  status?: NewsStatus;
  category?: string; // category ID
}

export interface NewsFilters {
  search?: string;
  status?: NewsStatus;
  author?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface NewsStats {
  total: number;
  published: number;
  draft: number;
  newThisMonth: number;
}
