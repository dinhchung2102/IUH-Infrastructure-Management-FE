export type PaginationResponse = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

export type PaginationRequest = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

// Default values cho pagination
export const DEFAULT_PAGINATION_REQUEST: PaginationRequest = {
  page: 1,
  limit: 10,
  sortBy: "fullName",
  sortOrder: "asc",
};

export const DEFAULT_PAGINATION_RESPONSE: PaginationResponse = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
};

/**
 * Base query DTO cho tất cả các query có pagination
 *
 * Các field bao gồm:
 * - page?: number - Số trang hiện tại
 * - limit?: number - Số items trên mỗi trang
 * - sortBy?: string - Field để sort
 * - sortOrder?: "asc" | "desc" - Thứ tự sắp xếp
 *
 * @example
 * // Sử dụng cho query DTO:
 * export type QueryFacilitiesDto = BaseQueryDto & {
 *   search?: string;
 *   type?: string;
 *   status?: string;
 * };
 */
export type BaseQueryDto = Partial<PaginationRequest>;
