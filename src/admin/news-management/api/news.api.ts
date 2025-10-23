import axios from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type {
  News,
  CreateNewsDto,
  UpdateNewsDto,
  NewsFilters,
  NewsStats,
} from "../types/news.type";

export const getNews = async (
  filters: NewsFilters & { page?: number; limit?: number }
): Promise<
  ApiResponse<{
    news: News[];
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
  if (filters.status) params.append("status", filters.status);
  if (filters.author) params.append("author", filters.author);
  if (filters.category) params.append("category", filters.category);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

  const response = await axios.get(`/news?${params.toString()}`);
  return response.data;
};

export const getNewsById = async (id: string): Promise<ApiResponse<News>> => {
  const response = await axios.get(`/news/${id}`);
  return response.data;
};

export const getNewsBySlug = async (
  slug: string
): Promise<ApiResponse<News>> => {
  const response = await axios.get(`/news/slug/${slug}`);
  return response.data;
};

export const createNews = async (
  data: CreateNewsDto
): Promise<ApiResponse<News>> => {
  const response = await axios.post("/news", data);
  return response.data;
};

export const updateNews = async (
  id: string,
  data: UpdateNewsDto
): Promise<ApiResponse<News>> => {
  const response = await axios.patch(`/news/${id}`, data);
  return response.data;
};

export const deleteNews = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axios.delete(`/news/${id}`);
  return response.data;
};

export const getNewsStats = async (): Promise<
  ApiResponse<{ stats: NewsStats }>
> => {
  const response = await axios.get("/news/stats");
  return response.data;
};
