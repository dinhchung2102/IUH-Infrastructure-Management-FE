import axios from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

export interface PublicNews {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  content: string | Record<string, unknown>;
  status: string;
  author: string;
  category?: string;
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicNewsCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getPublicNews = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<
  ApiResponse<{
    news: PublicNews[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }>
> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.category) queryParams.append("category", params.category);
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

  // Filter only PUBLISHED news
  queryParams.append("status", "PUBLISHED");

  const response = await axios.get(`/news?${queryParams.toString()}`);
  return response.data;
};

export const getPublicNewsCategories = async (): Promise<
  ApiResponse<{
    categories: PublicNewsCategory[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }>
> => {
  // Get all active categories
  const response = await axios.get("/news-categories?isActive=true&limit=100");
  return response.data;
};

export const getPublicNewsById = async (
  id: string
): Promise<ApiResponse<{ data: PublicNews }>> => {
  const response = await axios.get(`/news/${id}`);
  return response.data;
};

export const getPublicNewsBySlug = async (
  slug: string
): Promise<ApiResponse<{ data: PublicNews }>> => {
  const response = await axios.get(`/news/slug/${slug}`);
  return response.data;
};
