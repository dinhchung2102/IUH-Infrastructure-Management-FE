import { apiHelper } from "./index.js";

const ASSET_CATEGORY_ENDPOINTS = {
  GET_ALL: "/assets/categories",
  CREATE: "/assets/categories",
  GET_BY_ID: (id) => `/assets/categories/${id}`,
  UPDATE: (id) => `/assets/categories/${id}`,
  DELETE: (id) => `/assets/categories/${id}`,
};

export const assetCategoryService = {
  /**
   * Lấy danh sách tất cả danh mục thiết bị
   * @returns {Promise} Danh sách danh mục thiết bị
   */
  async getAll() {
    try {
      const response = await apiHelper.get(ASSET_CATEGORY_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error("getAll asset categories error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /**
   * Lấy chi tiết danh mục thiết bị theo ID
   * @param {string} id - ID danh mục thiết bị
   * @returns {Promise} Chi tiết danh mục thiết bị
   */
  async getById(id) {
    try {
      const response = await apiHelper.get(ASSET_CATEGORY_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error("getById asset category error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /**
   * Tạo danh mục thiết bị mới
   * @param {Object} payload - Thông tin danh mục thiết bị
   * @param {string} payload.name - Tên danh mục
   * @param {string} payload.code - Mã danh mục
   * @param {string} [payload.description] - Mô tả danh mục
   * @returns {Promise} Kết quả tạo danh mục
   */
  async create(payload) {
    try {
      const response = await apiHelper.post(ASSET_CATEGORY_ENDPOINTS.CREATE, payload);
      return response.data;
    } catch (error) {
      console.error("create asset category error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /**
   * Cập nhật danh mục thiết bị
   * @param {string} id - ID danh mục thiết bị
   * @param {Object} payload - Thông tin cần cập nhật
   * @returns {Promise} Kết quả cập nhật
   */
  async update(id, payload) {
    try {
      const response = await apiHelper.patch(ASSET_CATEGORY_ENDPOINTS.UPDATE(id), payload);
      return response.data;
    } catch (error) {
      console.error("update asset category error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /**
   * Xóa danh mục thiết bị
   * @param {string} id - ID danh mục thiết bị
   * @returns {Promise} Kết quả xóa
   */
  async delete(id) {
    try {
      const response = await apiHelper.delete(ASSET_CATEGORY_ENDPOINTS.DELETE(id));
      return response.data;
    } catch (error) {
      console.error("delete asset category error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },
};

export default assetCategoryService;
