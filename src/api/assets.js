import { apiHelper } from "./index.js";

const ASSET_ENDPOINTS = {
  GET_ALL: "/assets",
  CREATE: "/assets",
  GET_BY_ID: (id) => `/assets/${id}`,
  UPDATE: (id) => `/assets/${id}`,
  DELETE: (id) => `/assets/${id}`,
};

export const assetService = {
  /**
   * Lấy danh sách tất cả thiết bị
   * @returns {Promise} Danh sách thiết bị
   */
  async getAll() {
    try {
      const response = await apiHelper.get(ASSET_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error("getAll assets error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /**
   * Lấy chi tiết thiết bị theo ID
   * @param {string} id - ID thiết bị
   * @returns {Promise} Chi tiết thiết bị
   */
  async getById(id) {
    try {
      const response = await apiHelper.get(ASSET_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error("getById asset error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /**
   * Tạo thiết bị mới
   * @param {Object} payload - Thông tin thiết bị
   * @param {string} payload.name
   * @param {string} payload.code
   * @param {string} payload.status
   * @param {string} payload.description
   * @param {string} payload.serialNumber
   * @param {string} payload.brand
   * @param {string} payload.assetType - ID loại thiết bị
   * @param {string} payload.assetCategory - ID danh mục thiết bị
   * @param {string} payload.image
   * @param {string} payload.warrantyEndDate
   * @param {string} payload.lastMaintenanceDate
   * @param {string} payload.zone - ID khu vực
   * @param {string|null} payload.area
   * @param {Object} payload.properties
   * @returns {Promise} Kết quả tạo thiết bị
   */
  async create(payload) {
    try {
      const response = await apiHelper.post(ASSET_ENDPOINTS.CREATE, payload);
      return response.data;
    } catch (error) {
      console.error("create asset error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /**
   * Cập nhật thiết bị
   * @param {string} id - ID thiết bị
   * @param {Object} payload - Thông tin cần cập nhật
   * @returns {Promise} Kết quả cập nhật
   */
  async update(id, payload) {
    try {
      const response = await apiHelper.patch(ASSET_ENDPOINTS.UPDATE(id), payload);
      return response.data;
    } catch (error) {
      console.error("update asset error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /**
   * Xóa thiết bị
   * @param {string} id - ID thiết bị
   * @returns {Promise} Kết quả xóa
   */
  async delete(id) {
    try {
      const response = await apiHelper.delete(ASSET_ENDPOINTS.DELETE(id));
      return response.data;
    } catch (error) {
      console.error("delete asset error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },
};

export default assetService;
