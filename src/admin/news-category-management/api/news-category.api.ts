import axios from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type {
  NewsCategory,
  CreateNewsCategoryDto,
  UpdateNewsCategoryDto,
  NewsCategoryFilters,
} from "../types/news-category.type";

export const getNewsCategories = async (
  filters: NewsCategoryFilters & { page?: number; limit?: number }
): Promise<
  ApiResponse<{
    categories: NewsCategory[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }>
> => {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.isActive !== undefined)
    params.append("isActive", filters.isActive.toString());
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

  const response = await axios.get(`/news-categories?${params.toString()}`);
  return response.data;
};

export const getNewsCategoryById = async (
  id: string
): Promise<ApiResponse<NewsCategory>> => {
  const response = await axios.get(`/news-categories/${id}`);
  return response.data;
};

export const getNewsCategoryBySlug = async (
  slug: string
): Promise<ApiResponse<NewsCategory>> => {
  const response = await axios.get(`/news-categories/slug/${slug}`);
  return response.data;
};

export const createNewsCategory = async (
  data: CreateNewsCategoryDto | FormData
): Promise<ApiResponse<NewsCategory>> => {
  const response = await axios.post("/news-categories", data, {
    headers:
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
  });
  return response.data;
};

export const updateNewsCategory = async (
  id: string,
  data: UpdateNewsCategoryDto | FormData
): Promise<ApiResponse<NewsCategory>> => {
  const response = await axios.patch(`/news-categories/${id}`, data, {
    headers:
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
  });
  return response.data;
};

export const deleteNewsCategory = async (
  id: string
): Promise<ApiResponse<void>> => {
  const response = await axios.delete(`/news-categories/${id}`);
  return response.data;
};
