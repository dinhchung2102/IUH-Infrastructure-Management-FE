import { apiHelper } from "./index.js";

const AREAS_ENDPOINTS = {
  GET_ALL: "/zone-area/areas",
  CREATE: "/zone-area/areas",
  GET_BY_ID: (id) => `/zone-area/areas/${id}`,
  UPDATE: (id) => `/zone-area/areas/${id}`,
  DELETE: (id) => `/zone-area/areas/${id}`,
};

export const areasService = {
  /**
   * Lấy danh sách tất cả khu vực
   * @returns {Promise} Danh sách khu vực
   */
  async getAll() {
    try {
      const response = await apiHelper.get(AREAS_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error("getAll areas error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },

  /**
   * Lấy chi tiết khu vực theo ID
   * @param {string} id - ID khu vực
   * @returns {Promise} Chi tiết khu vực
   */
  async getById(id) {
    try {
      const response = await apiHelper.get(AREAS_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error("getById areas error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },

  /**
   * Tạo khu vực mới
   * @param {Object} payload - Thông tin khu vực
   * @returns {Promise} Kết quả tạo khu vực
   */
  async create(payload) {
    try {
      const response = await apiHelper.post(AREAS_ENDPOINTS.CREATE, payload);
      return response.data;
    } catch (error) {
      console.error("create areas error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },

  /**
   * Cập nhật khu vực
   * @param {string} id - ID khu vực
   * @param {Object} payload - Thông tin cập nhật
   * @returns {Promise} Kết quả cập nhật
   */
  async update(id, payload) {
    try {
      const response = await apiHelper.patch(AREAS_ENDPOINTS.UPDATE(id), payload);
      return response.data;
    } catch (error) {
      console.error("update areas error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },

  /**
   * Xóa khu vực
   * @param {string} id - ID khu vực
   * @returns {Promise} Kết quả xóa
   */
  async delete(id) {
    try {
      const response = await apiHelper.delete(AREAS_ENDPOINTS.DELETE(id));
      return response.data;
    } catch (error) {
      console.error("delete areas error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },
};

export default areasService;
