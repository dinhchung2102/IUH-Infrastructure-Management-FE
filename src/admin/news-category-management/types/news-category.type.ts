export interface NewsCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsCategoryDto {
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface UpdateNewsCategoryDto {
  name?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface NewsCategoryFilters {
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface NewsCategoryStats {
  total: number;
  active: number;
  inactive: number;
}
