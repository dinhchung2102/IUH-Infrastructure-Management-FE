import { apiHelper } from "./index.js";

const BUILDING_ENDPOINTS = {
  GET_ALL: "/zone-area/buildings",
  CREATE: "/zone-area/buildings",
  GET_BY_ID: (id) => `/zone-area/buildings/${id}`,
  UPDATE: (id) => `/zone-area/buildings/${id}`,
  DELETE: (id) => `/zone-area/buildings/${id}`,
};

export const buildingService = {
  /**
   * Lấy danh sách tất cả tòa nhà
   * @returns {Promise} Danh sách tòa nhà
   */
  async getAll() {
    try {
      const response = await apiHelper.get(BUILDING_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error("getAll building error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /**
   * Lấy chi tiết tòa nhà theo ID
   * @param {string} id - ID tòa nhà
   * @returns {Promise} Chi tiết tòa nhà
   */
  async getById(id) {
    try {
      const response = await apiHelper.get(BUILDING_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error("getById building error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /**
   * Tạo tòa nhà mới
   * @param {Object} payload - Thông tin tòa nhà
   * @param {string} payload.name
   * @param {number} payload.floor
   * @param {string} payload.status
   * @param {string} payload.campus - ID campus (có thể null)
   * @returns {Promise} Kết quả tạo tòa nhà
   */
  async create(payload) {
    try {
      const response = await apiHelper.post(BUILDING_ENDPOINTS.CREATE, payload);
      return response.data;
    } catch (error) {
      console.error("create building error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /**
   * Cập nhật tòa nhà
   * @param {string} id - ID tòa nhà
   * @param {Object} payload - Thông tin cần cập nhật
   * @returns {Promise} Kết quả cập nhật
   */
  async update(id, payload) {
    try {
      const response = await apiHelper.patch(BUILDING_ENDPOINTS.UPDATE(id), payload);
      return response.data;
    } catch (error) {
      console.error("update building error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /**
   * Xóa tòa nhà
   * @param {string} id - ID tòa nhà
   * @returns {Promise} Kết quả xóa
   */
  async delete(id) {
    try {
      const response = await apiHelper.delete(BUILDING_ENDPOINTS.DELETE(id));
      return response.data;
    } catch (error) {
      console.error("delete building error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },
};

export default buildingService;
